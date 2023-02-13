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
const url = require("url");
var admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

// https://firebase.google.com/docs/database/admin/save-data
// https://console.firebase.google.com/u/0/project/edging-abb31/database/edging-abb31-default-rtdb/data
var serviceAccount = require(__dirname +
    "/edging-6301e-firebase-adminsdk-la5eu-f8ab970f3d.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://edging-6301e-default-rtdb.firebaseio.com",
});

const MAX_QUEUE_LENGTH = 500;

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
const usersRef = db.ref("/users");

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
        res.cookie("uuid", uuid);

        // talk to QueueManager and let it know to create a user
        // under this UID in firebase
        createUserFunc(uuid)
            .then((result) => {})
            .catch((error) => {
                console.log(error);
            });
    }
    next();
});

function generateUUID() {
    return crypto.randomBytes(16).toString("hex");
}

const compiler = webpack(webpackConfig);

app.use(
    webpackDevMiddleware(compiler, {
        hot: true,
        filename: "bundle.js",
        publicPath: "/",
        stats: {
            colors: true,
        },
        historyApiFallback: true,
    })
);

app.use(express.static(__dirname + "/www"));
app.use(express.static(__dirname + "/public"));

app.get("/about", function (req, res) {
    res.sendFile(__dirname + "/www/index.html", function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});

function addSongToQueue(videoId, uuid, whichQueue = "foreground") {
    // whichQueue can either be "foreground" or "background"
    return new Promise((resolve, reject) => {
        const dateObject = new Date();
        const timestamp = dateObject.getTime();

        usersRef
            .child(uuid)
            .child(whichQueue)
            .push(
                {
                    left: null,
                    right: null,
                    motionLink: null,
                    timestamp: timestamp,
                    videoId: videoId,
                },
                (error) => {
                    if (error) {
                        reject(error);
                    }
                }
            );

        resolve();
    });
}

async function getQueueLength(uuid) {
    const snapshot = await usersRef.child(uuid).get();
    return snapshot.numChildren();
}

async function getQueueVideoIds(uuid) {
    const snapshot = await usersRef.child(uuid).get();
    const queueVideoIds = [];
    snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        queueVideoIds.push(childData.videoId);
    });

    return queueVideoIds;
}

async function handleLink(link, uuid, res) {
    const videoId = link.split("v=")[1];

    // validate link
    if (videoId == null) {
        res.send({ status: 500, message: "error adding song to queue" });
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
            res.send({ status: 500, message: "song is already in queue" });
            return;
        }
    } catch (error) {
        console.log(error);
        res.send({ status: 500, message: "error getting queue" });
        return;
    }

    try {
        const queueLength = await getQueueLength(uuid);
        console.log("the queue length is: ", queueLength);
        if (queueLength > MAX_QUEUE_LENGTH) {
            res.send({ status: 500, message: "queue is too long" });
            return;
        }
    } catch (error) {
        console.log(error);
        res.send({ status: 500, message: "error getting queue length" });
        return;
    }

    try {
        const result = await addSongToQueue(videoId, uuid);
        res.send({ status: 200, message: "song added to queue" });
    } catch (error) {
        console.log(error);
        res.send({ status: 500, message: "error adding song to queue" });
        return;
    }
}

// GET endpoints
app.get("/api/get_motions", function (req, res) {
    // get the motions for the given index in the linked list + timestamps

    const uuid = req.cookies.uuid;

    const userRef = usersRef.child(uuid);

    // get the linked list (/api/get_linked_list)
    getLinkedList(uuid)
        .then((linkedList) => {
            console.log(linkedList);
        })
        .catch((error) => {
            console.log(error);
        });
});

async function getLinkedList(uuid) {
    // return an ordered list of video id’s along with which queue they are in (from the linked list)
    usersRef
        .child(uuid)
        .get()
        .then((snapshot) => {
            const queueIds = [];
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                queueIds.push(childData.queueId + "/" + childData.videoId);
            });

            console.log("got linked list from inside the function");
            console.log(queueIds);

            return queueIds;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}

app.get("/api/get_linked_list", function (req, res) {
    // return an ordered list of video id’s along with which queue they are in (from the linked list)

    const uuid = req.cookies.uuid;

    getLinkedList(uuid)
        .then((linkedList) => {
            console.log("got linked list");
            console.log(linkedList);
            res.send({ status: 200, message: JSON.stringify(linkedList) });
        })
        .catch((error) => {
            console.log(error);
            res.send({ status: 500, message: "error encountered" });
        });

    // usersRef
    //     .child(uuid)
    //     .get()
    //     .then((snapshot) => {
    //         const queueIds = [];
    //         snapshot.forEach((childSnapshot) => {
    //             const childData = childSnapshot.val();
    //             queueIds.push(childData.queueId + "/" + childData.videoId);
    //         });

    //         res.send({ status: 200, message: JSON.stringify(queueIds) });
    //     })
    //     .catch((error) => {
    //         res.send({ status: 500, message: "error encountered" });
    //     });
});

// POST endpoints

async function createUserFunc(uuid) {
    return new Promise((resolve, reject) => {
        const dateObject = new Date();
        const timestamp = dateObject.getTime();

        const videoIds = [
            "RnBT9uUYb1w",
            "5dJG_DdOuOM",
            "uhA55hYnoHw",
            "W2TE0DjdNqI",
            "gEABPD4wNCg",
        ];

        // set up the data struct locally
        // now set up background queue
        backgroundQueue = [];
        for (const videoId of videoIds) {
            backgroundQueue.push({
                videoId: videoId,
                left: null,
                right: null,
                motionLink: null,
            });
        }

        const userRef = usersRef.child(uuid);

        userRef.set({ firstSong: "background/" + videoIds[0] });

        // push the entire background queue
        var updates = {};
        backgroundQueue.map((item) => {
            // var newPostKey = userRef.child("background").push().key;
            // var newPostKey = firebase.database().ref().child(`boards/${boardId}/containers/`).push().key;
            updates[`background/` + item.videoId] = item;
        });
        userRef.update(updates);

        resolve();
    });
}

async function createUser(res, uuid) {
    try {
        const result = await createUserFunc(uuid);
        res.send({ status: 200, message: "created user" });
    } catch (error) {
        console.log(error);
        res.send({ status: 500, message: "error creating user" });
        return;
    }
}

app.post("/api/create_user", function (req, res) {
    // create a new user with the given uid.
    // under the hood: lays out the two queues + linked list + ensures that you can get the motions for current song and next song

    const uuid = req.cookies.uuid;
    createUser(res, uuid);
});

app.post("/api/add_song", function (req, res) {
    // adds a song to the foreground queue.
    // DO NOT IMPLEMENT UNTIL WE GIVE WRITE-ACCESS!!!
});

app.post("/api/finish_song", function (req, res) {
    // indicates that we have finished the current song.
    // under the hood, this just shifts things around (delete song from foreground queue if it’s foreground, reassign the “firstSong” pointer) and computes new motions
});

app.post("/api/recompute_motions", function (req, res) {
    // recomputes the motions for current and next song assuming that we are cutting to the next song at the given cutTime timestamp within the song. infill everything after infillStartTime.
    // if vertex AI doesn’t give back the motions within “timeout”, then just return an error.
    // DO NOT IMPLEMENT UNTIL WE GIVE WRITE-ACCESS!!!
});

app.post("/api/request_song", function (req, res) {
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

const server = app.listen(80, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
