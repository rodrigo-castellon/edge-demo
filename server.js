/**
 * The general architecture is roughly as follows:
 * - The client sends a request to the server to request a song
 * - The server validates the request (song length, queue length, etc.).
 *   If the song is validated, the server sends a success response to the
 *   client and adds the song to the Firebase queue. Otherwise, it sends a
 *   failure response to the client.
 * - In the end, there should be another bucket that contains a sequence of FBX/GLTF
 *   files that are ordered.
 * - The client is always keeping track of the queue. As time goes on,
 *   the client tries to, depending on availability, download the dance
 *   sequences from the GCP bucket for every song in the queue. On the client
 *   side, these motions are just progressively stored as files on the device.
 *   Since everything is synchronized, the client knows when to play each animation,
 *   and does so.
 */

const express = require("express");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const url = require('url');
var admin = require("firebase-admin");
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

// https://firebase.google.com/docs/database/admin/save-data
// https://console.firebase.google.com/u/0/project/edging-abb31/database/edging-abb31-default-rtdb/data
var serviceAccount = require(__dirname + "/edging-6301e-firebase-adminsdk-la5eu-f8ab970f3d.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://edging-6301e-default-rtdb.firebaseio.com"
});

const MAX_QUEUE_LENGTH = 500;

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
const queueRef = db.ref('/queue');

// Initialize Realtime Database and get a reference to the service
// const database = getDatabase(app);

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

const app = express();

// cookie middleware
app.use(cookieParser());

app.use((req, res, next) => {
    if (!req.cookies.uuid) {
        const uuid = generateUUID();
        res.cookie('uuid', uuid);
    }
    next();
});

function generateUUID() {
    return crypto.randomBytes(16).toString('hex');
}

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
    res.sendFile(__dirname + '/www/index.html', function(err) {
        if (err) {
            res.status(500).send(err)
        }
    })
});

function addSongToQueue(videoId, uuid) {
    return new Promise((resolve, reject) => {
        const dateObject = new Date();
        const timestamp = dateObject.getTime();

        const userRef = queueRef.child(uuid);

        userRef.push({
            timestamp: timestamp,
            videoId: videoId
        }, (error) => {
            if (error) {
                reject(error);
            }
        });

        resolve();
    });
}

async function getQueueLength() {
    const snapshot = await queueRef.child(uuid).get();
    return snapshot.numChildren();
}

async function getQueueVideoIds(uuid) {
    const snapshot = await queueRef.child(uuid).get();
    const queueVideoIds = [];
    snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        queueVideoIds.push(childData.videoId);
    });

    return queueVideoIds;
}

async function handleLink(link, uuid, res) {
    const videoId = link.split('v=')[1];

    // validate link
    if (videoId == null) {
        res.send({"status": 500, "message": "error adding song to queue"});
        return;
    }

    // perform a couple checks:
    // 1. check if the video is already in the queue
    // 2. check if the queue is too long

    // if any of the above trigger, send a message to the client
    // saying that the song cannot be added to the queue
    try {
        const queueVideoIds = await getQueueVideoIds(uuid);

        if (queueVideoIds.includes(videoId)) {
            res.send({"status": 500, "message": "song is already in queue"});
            return;
        }

    } catch (error) {
        console.log(error);
        res.send({"status": 500, "message": "error getting queue"});
        return;
    }

    try {
        const queueLength = await getQueueLength(uuid);
        console.log('the queue length is: ', queueLength);
        if (queueLength > MAX_QUEUE_LENGTH) {
            res.send({"status": 500, "message": "queue is too long"});
            return;
        }
    } catch (error) {
        console.log(error);
        res.send({"status": 500, "message": "error getting queue length"});
        return;
    }

    try {
        const result = await addSongToQueue(videoId, uuid);
        res.send({"status": 200, "message": "song added to queue"});
    } catch (error) {
        console.log(error);
        res.send({"status": 500, "message": "error adding song to queue"});
        return;
    }
}

app.post('/api/request_song', function(req, res) {
    // the user wants to request a song to be put onto
    // the queue

    // the request contains a youtube link, so we need to
    // parse the link and get the video id

    const queryObject = url.parse(req.url, true).query;
    const link = queryObject.link;

    // check against firebase queue. if the queue is too long,
    // then we need to send a message to the client saying that
    // the queue is too long, and that they need to wait for
    // a while before requesting another song

    handleLink(link, req.cookies.uuid, res);
});

const server = app.listen(8080, function() {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
