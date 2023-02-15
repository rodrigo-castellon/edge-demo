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
const { Storage } = require("@google-cloud/storage");
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

const app = express();

const storage = new Storage();
// audio and FBXes stored here
const backgroundBucket = storage.bucket("edging-background");
// stores anything related to foreground queue here
const foregroundBucket = storage.bucket("edging-foreground");

// Initialize Realtime Database and get a reference to the service
// const database = getDatabase(app);

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

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
    } else {
        // check if we already have it in our database, create if we don't
        // this should not really trigger, but included for debugging purposes
        usersRef
            .child(req.cookies.uuid)
            .get()
            .then((data) => {
                if (data.val() === null) {
                    createUserFunc(req.cookies.uuid).catch((error) => {
                        console.log(error);
                    });
                }
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

function sendBackBucketFile(pointer, res) {
    // only handle background for now
    let file = "";
    if (pointer.split("/")[0] === "background") {
        file = backgroundBucket.file(
            "v1/gltf/" + pointer.split("/")[1] + ".gltf"
        );
    }

    file.createReadStream()
        .on("error", (err) => {
            console.error(err);
            res.status(500).send(err.message);
        })
        .pipe(res);
}

// GET endpoints
app.get("/api/get_motions/:idx", function (req, res) {
    // get the motions for the given index in the linked list + timestamps

    const uuid = req.cookies.uuid;

    const userRef = usersRef.child(uuid);

    userRef
        .child("firstSong")
        .get()
        .then((snapshot) => {
            const firstSong = snapshot.val();

            if (req.params.idx == 0) {
                sendBackBucketFile(firstSong, res);
            } else {
                userRef
                    .child(firstSong.split("/")[0])
                    .child(firstSong.split("/")[1])
                    .child("right")
                    .get()
                    .then((snapshot) => {
                        const pointer = snapshot.val();

                        sendBackBucketFile(pointer, res);
                    });
            }
        });
});

async function getLinkedList(uuid) {
    // return an ordered list of video id’s along with which queue they are in (from the linked list)

    const userRef = usersRef.child(uuid);
    const firstSong = await (await userRef.child("firstSong").get()).val();

    let songs = [];
    let curSong = firstSong;

    while (true) {
        console.log(curSong);
        songs.push(curSong);
        curSong = (
            await userRef
                .child(curSong.split("/")[0])
                .child(curSong.split("/")[1])
                .child("right")
                .get()
        ).val();
        if (songs.includes(curSong)) {
            break;
        }
    }

    return songs;

    // while (true) {
    //     userRef.get().then((snapshot) => {

    //     })
    // }

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
});

function mod(n, m) {
    return ((n % m) + m) % m;
}

// POST endpoints

async function createUserFunc(uuid) {
    return new Promise((resolve, reject) => {
        const dateObject = new Date();

        // const videoIds = [
        //     "RnBT9uUYb1w",
        //     "5dJG_DdOuOM",
        //     "uhA55hYnoHw",
        //     "W2TE0DjdNqI",
        //     "gEABPD4wNCg",
        // ];

        // const videoIds = [
        //     "test_aint_no_mountain_high_enough",
        //     "test_andrew_belle_in_my_veins_official_song",
        //     "test_baby_one_more_time_britney_spears_lyrics",
        //     "test_bee_gees_stayin_alive_official_music_video",
        //     "test_beyonce_crazy_in_love_ft_jay_z",
        //     "test_britney_spears_toxic_official_hd_video",
        //     "test_chubby_checker_the_twist_official_music_video",
        //     "test_doja_cat_kiss_me_more_lyrics_ft_sza",
        //     "test_doja_cat_woman_lyrics",
        //     "test_dua_lipa_levitating_featuring_dababy_official_music_video_tuvczfqe",
        //     "test_earth_wind_fire_boogie_wonderland_official_video",
        //     "test_ed_sheeran_shape_of_you_lyrics",
        //     "test_holiday",
        //     "test_jump",
        //     "test_justin_bieber_sorry_lyrics",
        //     "test_katrina_and_the_waves_walking_on_sunshine_lyrics",
        //     "test_kenny_loggins_footloose_lyrics",
        //     "test_kylie_minogue_cant_get_you_out_of_my_head_official_video",
        //     "test_le_freak_2006_remaster",
        //     "test_like_a_virgin",
        //     "test_lil_nas_x_industry_baby_lyrics_ft_jack_harlow",
        //     "test_lil_nas_x_montero_call_me_by_your_name_lyrics",
        //     "test_luis_fonsi_despacito_lyrics___lyric_video_ft_daddy_yankee_gm3",
        //     "test_macarena_original_version",
        //     "test_mark_ronson_uptown_funk_official_video_ft_bruno_mars",
        //     "test_martha_reeves_the_vandellas_dancing_in_the_street_1964",
        //     "test_michael_jackson_billie_jean_official_video",
        //     "test_michael_jackson_dont_stop_til_you_get_enough_official_video",
        //     "test_rhythm_is_a_dancer_p",
        //     "test_sia_cheap_thrills_lyrics",
        //     "test_the_black_eyed_peas_i_gotta_feeling_official_music_video",
        //     "test_the_four_tops_i_cant_help_myself_sugar_pie_honey_bunch",
        //     "test_toxic",
        //     "test_twist_and_shout_remastered_2009",
        //     "test_usher_yeah_official_video_ft_lil_jon_ludacris",
        //     "test_you_should_be_dancing",
        // ];

        const videoIds = [
            "1sqE6P3XyiQ",
            "-CCgDvUM4TM",
            "2RicaUqd9Hg",
            "3gMG_FZMavU",
            "6lxBcKB3Ohc",
            "8Jtokmp8zoE",
            "9i6bCWIdhBw",
            "9KhbM2mqhCQ",
            "9vMLTcftlyI",
            "ABfQuZqq8wg",
            "BerNfXSuvJ0",
            "BRG03PZXo2w",
            "dm0ndgjk9V4",
            "g7X9X6TlrUo",
            "god7hAPv8f0",
            "HCq1OcAEAm0",
            "I_izvAbhExY",
            "JYIaWeVL1JM",
            "LOZuxwVk7TU",
            "LPYw3jXjd74",
            "niewe7xfoWs",
            "nsXwi67WgOo",
            "OPf0YbXqDm0",
            "q0KZuZF01FA",
            "qK5KhQG06xU",
            "qw7WNwMyagw",
            "Rfr9bhSmfXc",
            "s__rX_WL100",
            "SwYN7mTi6HM",
            "uSD4vsh1zDA",
            "ViwtNLUqkMY",
            "VJ2rlci9PE0",
            "XnAB7kJEO-Y",
            "yURRmWtbTbo",
            "Zi_XLOBDo_Y",
        ];

        // set up the data struct locally
        // now set up background queue
        backgroundQueue = [];
        for (let i = 0; i < videoIds.length; i++) {
            let left = "background/" + videoIds[mod(i - 1, videoIds.length)];
            let right = "background/" + videoIds[mod(i + 1, videoIds.length)];

            backgroundQueue.push({
                videoId: videoIds[i],
                left: left,
                right: right,
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

function getAllFunctions(obj) {
    const allFunctionNames = [];
    let currentObject = obj;

    while (currentObject !== null) {
        const prototype = Object.getPrototypeOf(currentObject);
        const ownFunctionNames = Object.getOwnPropertyNames(currentObject); //.filter((name) => typeof currentObject[name] === "function");
        allFunctionNames.push(...ownFunctionNames);

        currentObject = prototype;
    }

    return allFunctionNames;
}

app.post("/api/prev_song", function (req, res) {
    // inverse of /api/next_song

    const uuid = req.cookies.uuid;

    console.log("uuid", uuid);

    const userRef = usersRef.child(uuid);

    userRef
        .child("firstSong")
        .get()
        .then((snapshot) => {
            const firstSong = snapshot.val();

            const firstKey = firstSong.split("/")[0];
            const secondKey = firstSong.split("/")[1];

            // rewrite it with firstSong->right
            userRef
                .child(firstKey)
                .child(secondKey)
                .child("left")
                .get()
                .then((snapshot) => {
                    userRef.child("firstSong").set(snapshot.val());
                    res.send({ status: 200, message: "success" });
                })
                .catch((error) => {
                    console.log(error);
                    res.send({ status: 500, message: "error encountered" });
                });
        })
        .catch((error) => {
            console.log(error);
            res.send({ status: 500, message: "error encountered" });
        });
});

app.post("/api/next_song", function (req, res) {
    // indicates that we have finished the current song.
    // under the hood, this just shifts things around (delete song from foreground queue if it’s foreground, reassign the “firstSong” pointer) and computes new motions

    const uuid = req.cookies.uuid;

    console.log("uuid", uuid);

    const userRef = usersRef.child(uuid);

    userRef
        .child("firstSong")
        .get()
        .then((snapshot) => {
            const firstSong = snapshot.val();

            const firstKey = firstSong.split("/")[0];
            const secondKey = firstSong.split("/")[1];

            // rewrite it with firstSong->right
            userRef
                .child(firstKey)
                .child(secondKey)
                .child("right")
                .get()
                .then((snapshot) => {
                    userRef.child("firstSong").set(snapshot.val());
                    res.send({ status: 200, message: "success" });
                })
                .catch((error) => {
                    console.log(error);
                    res.send({ status: 500, message: "error encountered" });
                });
        })
        .catch((error) => {
            console.log(error);
            res.send({ status: 500, message: "error encountered" });
        });
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
