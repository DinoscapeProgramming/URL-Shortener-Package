const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const device = require('express-device');
const urlShorter = require('./urlShorter.js');

urlShorter.configURL({
  file: "./urls.json",
  parameter: "id"
}).then((result) => {
  console.log("URL Shorter options were approved to the package");
});

app.use(bodyParser.json());
app.use(device.capture());

app.all("/url/:id", (req, res) => {
  urlShorter.openURL(req, res).then((result) => {});
});

app.all("/api/v1/url/create", (req, res) => {
  urlShorter.createURL(req.body).then((result) => {
    res.json(result);
  })
});

app.all("/api/v1/url/edit", (req, res) => {
  urlShorter.editURL(req.body).then((result) => {
    res.json(result);
  })
});

app.all("/api/v1/url/delete", (req, res) => {
  urlShorter.deleteURL(req.body).then((result) => {
    res.json(result);
  })
});

app.all("/api/v1/url/get", (req, res) => {
  urlShorter.getURL(req.body).then((result) => {
    res.json(result);
  })
});

const listen = app.listen(3000, () => {
  console.log("Server is ready on port", listen.address().port);
});