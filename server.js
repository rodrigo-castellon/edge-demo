const path = require('node:path');

const express = require("express");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const app = express();

const url = require('url');

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

    const video_id = link.split("v=")[1];

    // make request to youtube api to get the video title

    

    res.send("Hello World");
});

const server = app.listen(3000, function() {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
