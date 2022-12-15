const path = require('node:path');
const express = require("express");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const url = require('url');
const youtubedl = require('youtube-dl-exec')
const {Storage} = require('@google-cloud/storage');

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

// Creates a client from a Google service account key
const storage = new Storage({keyFilename: 'hai-gcp-dexterous-e53879aeb117.json'});

const MP3_DIR = 'mp3s';

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// The ID of your GCS bucket
const ingestionBucketName = 'song-ingestion';

async function uploadFile(localName, destFileName) {
    /**
     * Uploads a local file to the bucket.
     */
    const options = {
      destination: destFileName,
      // Optional:
      // Set a generation-match precondition to avoid potential race conditions
      // and data corruptions. The request to upload is aborted if the object's
      // generation number does not match your precondition. For a destination
      // object that does not yet exist, set the ifGenerationMatch precondition to 0
      // If the destination object already exists in your bucket, set instead a
      // generation-match precondition using its generation number.
    //   preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
    };

    await storage.bucket(ingestionBucketName).upload(localName, options);
    console.log(`${localName} uploaded to ${ingestionBucketName}`);
}

const app = express();

const compiler = webpack(webpackConfig);

app.use(
    webpackDevMiddleware(compiler, {
        hot: true,
        filename: "bundle.js",
        publicPath: "/",
        stats: {
            colors: true
        },
        historyApiFallback: true
    })
);

app.use(express.static(__dirname + "/www"));
app.use(express.static(__dirname + "/public"));

app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname, 'www/index.html'), function(err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})

app.post('/api/request_song', function(req, res) {
    // the user wants to request a song to be put onto
    // the queue

    // the request contains a youtube link, so we need to
    // parse the link and get the video id

    const queryObject = url.parse(req.url, true).query;

    const link = queryObject.link;

    // make request to youtube api to download the video
    // as an mp3 file
    youtubedl(link, {
        x: true,
        o: MP3_DIR + "/%(id)s.%(ext)s",
        audioFormat: "mp3",
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
            'referer:youtube.com',
            'user-agent:googlebot'
        ]
    }).then(output => {
        // now we need to send the mp3 file to the google cloud
        // storage bucket
        const video_id = link.split('v=')[1];

        uploadFile(
            MP3_DIR + '/' + video_id + '.mp3', video_id + '.mp3'
        ).then(() => {
            console.log("uploaded file to google cloud storage successfully");
            res.send({"status": 200, "message": "success"});
        }).catch(err => {
            console.error(err);
            res.send({"status": 500, "message": "failed on upload"});
        });
    }).catch(err => {
        console.error(err);
        res.send({"status": 500, "message": "failed on download"});
    });
});

const server = app.listen(3000, function() {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
