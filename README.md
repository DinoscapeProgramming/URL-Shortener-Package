# URL-Shortener Package
A package you can use to create a URL Shorter

## Installation progress
The package itself does not need any external packages, you only need packages when you try to execute the package

## Features
- Simple design
- Advanced error logging

## Documentation
### Setup
```js
const express = require("express"); // this package is express server based
const app = express();
const bodyParser = require("body-parser");
const urlShortener = require('./urlShortener.js')

app.set('trust proxy', true); // required if you enabled "logClicks"
app.use(bodyParser.json()); // required for post requests
```
### Configuration
```js
urlShortener.configURL({
  file: "./urls.json",
  parameter: "id",
  logClicks: true // optional
}).then((result) => {
  console.log("Options were approved to the package");
});
```

### Open URL
```js
app.all("/url/:id", (req, res) => {
  urlShortener.openURL(req, res).then((result) => {});
});
```

### Create URL
```js
app.all("/api/v1/url/create", (req, res) => {
  urlShortener.createURL(req.body).then((result) => {
    res.json(result);
  })
});
```

### Edit URL
```js
app.all("/api/v1/url/edit", (req, res) => {
  urlShortener.editURL(req.body).then((result) => {
    res.json(result);
  })
});
```

### Delete URL
```js
app.all("/api/v1/url/delete", (req, res) => {
  urlShortener.deleteURL(req.body).then((result) => {
    res.json(result);
  })
});
```

### Get URL
```js
app.all("/api/v1/url/get", (req, res) => {
  urlShortener.getURL(req.body).then((result) => {
    res.json(result);
  })
});
```

### Listen to Server
```js
app.listen(3000, () => {
  console.log("Server is ready");
});
```

## Example
```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlShorter = require('./urlShorter.js');

urlShorter.configURL({
  file: "./urls.json",
  parameter: "id"
}).then((result) => {
  console.log("URL Shorter options were approved to the package");
});

app.use(bodyParser.json());

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
```
