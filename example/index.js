const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlShortener = require('express-shortener');

urlShortener.configURL({
  file: "./urls.json",
  parameter: "id",
  logClicks: true
}).then((result) => {
  console.log("URL Shorter options were approved to the package");
});

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Dinoscape');
  next();
});

app.all("/url/:id", (req, res) => {
  urlShortener.openURL(req, res).then((result) => {});
});

app.all("/api/v1/url/create", (req, res) => {
  urlShortener.createURL(req.body).then((result) => {
    res.json(result);
  });
});

app.all("/api/v1/url/edit", (req, res) => {
  urlShortener.editURL(req.body).then((result) => {
    res.json(result);
  });
});

app.all("/api/v1/url/delete", (req, res) => {
  urlShortener.deleteURL(req.body).then((result) => {
    res.json(result);
  });
});

app.all("/api/v1/url/get", (req, res) => {
  urlShortener.getURL(req.body).then((result) => {
    res.json(result);
  });
});

const listen = app.listen(3000, () => {
  console.log("Server is ready on port", listen.address().port);
});
