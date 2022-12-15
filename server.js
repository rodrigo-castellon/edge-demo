const path = require('node:path');

const express = require("express");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
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

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'www/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

const server = app.listen(3000, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
