/**
 * The general architecture is roughly as follows:
 * - The client sends a request to the server to request a song
 * - The server checks the queue (Firebase) and if the queue is too long, it
 *  sends a response to the client saying that the queue is too long,
 *  and the client should try again later.
 * - If the queue is not too long, then the server sends a response
 *  to the client saying that the queue is not too long, and that
 *  the song has been placed into the queue. It also updates the Firebase
 *  database so that the queue has this song at the end. Since every client
 *  is viewing the same Firebase database, every client will see the song
 *  appear at the end of the queue.
 * - The server then downloads the song from youtube as an MP3,
 *  and uploads it to the GCP bucket. On GCP, the bucket is
 *  configured to trigger a Cloud Function when a new file is
 *  uploaded.
 * - The Cloud Function then spins up a VM, and runs a script that runs
 *  inference on the song, producing a sequence of human dance motions.
 *  This is then saved to another GCP bucket.
 * - The client is always keeping track of the queue. As time goes on,
 *  the client tries to, depending on availability, download the dance
 *  sequences from the GCP bucket for every song in the queue. On the client
 *  side, these motions are just progressively stored as files on the device.
 *  Since everything is synchronized, the client knows when to play each animation,
 *  and does so.
 */

const path = require('node:path');
const express = require("express");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const url = require('url');
const youtubedl = require('youtube-dl-exec')
const {Storage} = require('@google-cloud/storage');
var admin = require("firebase-admin");

// https://firebase.google.com/docs/database/admin/save-data
var serviceAccount = require("/Users/rodrigo-castellon/edging/edging-abb31-firebase-adminsdk-8f00j-721d54f56d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://edging-abb31-default-rtdb.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
const queueRef = db.ref('/queue');

queueRef.set({
    alanisawesome: {
        date_of_birth: 'June 23, 1912',
        full_name: 'Alan Turing'
    },
});

// Initialize Realtime Database and get a reference to the service
// const database = getDatabase(app);

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

// Creates a client from a Google service account key
const storage = new Storage({keyFilename: 'hai-gcp-dexterous-e53879aeb117.json'});

const MP3_DIR = 'mp3s';

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
});

function uploadSongToGCP(videoId) {
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

        uploadFile(
            MP3_DIR + '/' + videoId + '.mp3', videoId + '.mp3'
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
}

function addSongToQueue(videoId, res) {
    return new Promise((resolve, reject) => {
        queueRef.set({
            videoId: videoId
        }, (error) => {
            if (error) {
                reject(error);
            } else {
                res.send({"status": 200, "message": "song added to queue"});
                resolve();
            }
        });
    });
}


function handleLink(link, res) {
    const videoId = link.split('v=')[1];

    // check against firebase queue. if the queue is too long,
    // then we need to send a message to the client saying that
    // the queue is too long, and that they need to wait for
    // a while before requesting another song
    queueRef.on('value', (snapshot) => {
        const queueLength = snapshot.numChildren();
        console.log("queue length is:" + queueLength);
        if (queueLength > 10) {
            res.send({"status": 500, "message": "queue is too long"});
        } else {
            addSongToQueue(
                videoId, res
            ).then(() => uploadSongToGCP(videoId)
            ).catch((err) => {
                console.log(err);
                res.send({"status": 500, "message": "error adding song to queue"});
            });
        }
    }).catch((err) => {
        console.log(err);
        res.send({"status": 500, "message": "error checking queue length"});
    });
};

app.post('/api/request_song', function(req, res) {
    // the user wants to request a song to be put onto
    // the queue

    // the request contains a youtube link, so we need to
    // parse the link and get the video id

    const queryObject = url.parse(req.url, true).query;
    const link = queryObject.link;
    const videoId = link.split('v=')[1];

    // check against firebase queue. if the queue is too long,
    // then we need to send a message to the client saying that
    // the queue is too long, and that they need to wait for
    // a while before requesting another song

    handleLink(link, res);
});

const server = app.listen(3000, function() {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
