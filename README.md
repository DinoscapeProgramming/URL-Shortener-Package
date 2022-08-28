# URL Shortener Package
A package you can use to create a URL Shortener with express

## Installation progress
The package itself does not need any external packages, you only need packages when you try to execute the package

## Features
- Simple design
- Advanced error logging

## Create a database
Create a JSON File with an empty object
```json
{}
```

## Documentation
### Setup
```js
const express = require("express"); // this package is express server based
const app = express();
const bodyParser = require("body-parser");
const urlShortener = require('express-shortener');

app.set('trust proxy', true); // required if you enabled "logClicks"
app.use(bodyParser.json()); // required for post requests
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Dinoscape');
  next();
});
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
  });
});
```

### Edit URL
```js
app.all("/api/v1/url/edit", (req, res) => {
  urlShortener.editURL(req.body).then((result) => {
    res.json(result);
  });
});
```

### Delete URL
```js
app.all("/api/v1/url/delete", (req, res) => {
  urlShortener.deleteURL(req.body).then((result) => {
    res.json(result);
  });
});
```

### Get URL
```js
app.all("/api/v1/url/get", (req, res) => {
  urlShortener.getURL(req.body).then((result) => {
    res.json(result);
  });
});
```

### Listen to Server
```js
app.listen(3000, () => {
  console.log("Server is ready");
});
```

### Example
```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlShortener = require('./urlShortener.js');

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

app.listen(3000, () => {
  console.log("Server is ready");
});
```

## Class Documentation
### Setup
```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlShortener = require('express-shortener');
const Shortener = new urlShortener.Shortener({
  file: "./urls.json",
  parameter: "id",
  logClicks: true // optional
});

app.set('trust proxy', true); // required if you enabled "logClicks"
app.use(bodyParser.json()); // required for post requests
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Dinoscape');
  next();
});
```

### Open URL
```js
app.all("/url/:id", Shortener.open);
```

### Create URL
```js
app.all("/api/v1/url/create", Shortener.create);
```

### Edit URL
```js
app.all("/api/v1/url/edit", Shortener.edit);
```

### Delete URL
```js
app.all("/api/v1/url/delete", Shortener.delete);
```

### Get URL
```js
app.all("/api/v1/url/get", Shortener.get);
```

### Listen to Server
```js
app.listen(3000, () => {
  console.log("Server is ready");
});
```

### Example
```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlShortener = require('express-shortener');
const Shortener = new urlShortener.Shortener({
  file: "./urls.json",
  parameter: "id",
  logClicks: true
});

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Dinoscape');
  next();
});

app.all("/url/:id", Shortener.open);

app.all("/api/v1/url/create", Shortener.create);

app.all("/api/v1/url/edit", Shortener.edit);

app.all("/api/v1/url/delete", Shortener.delete);

app.all("/api/v1/url/get", Shortener.get);

app.listen(3000, () => {
  console.log("Server is ready");
});
```

## Middleware Documentation
### Setup
```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlShortener = require('express-shortener');

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(urlShortener.shortener({
  file: "./urls.json",
  parameter: "id",
  logClicks: true
}));

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Dinoscape');
  next();
});
```

### Open URL
```js
app.all("/url/:id", (req, res) => {
  res.openURL();
});
```

### Create URL
```js
app.all("/api/v1/url/create", (req, res) => {
  res.createURL();
});
```

### Edit URL
```js
app.all("/api/v1/url/edit", (req, res) => {
  res.editURL();
});
```

### Delete URL
```js
app.all("/api/v1/url/delete", (req, res) => {
  res.deleteURL();
});
```

### Get URL
```js
app.all("/api/v1/url/get", (req, res) => {
  res.getURL();
});
```

### Listen to Server
```js
app.listen(3000, () => {
  console.log("Server is ready");
});
```

### Documentation
```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlShortener = require('express-shortener');

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(urlShortener.shortener({
  file: "./urls.json",
  parameter: "id",
  logClicks: true
}));

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Dinoscape');
  next();
});

app.all("/url/:id", (req, res) => {
  res.openURL();
});

app.post('/api/v1/url/create', (req, res) => {
  res.createURL();
});

app.post('/api/v1/url/edit', (req, res) => {
  res.editURL();
});

app.post('/api/v1/url/delete', (req, res) => {
  res.deleteURL();
});

app.post('/api/v1/url/get', (req, res) => {
  res.getURL();
});

app.listen(3000, () => {
  console.log("Server is ready");
});
```


## Error Handling
### Invalid options
The options you have given or not defined or not an object

### No options were given
You have not executed the ConfigURL method before executing this method

### No file was given
Your options do not contain a file

### Enable Trust Proxy
You set logClicks in the options to true but you have not enabled trust proxy
```js
app.set('trust proxy', true);
```

### No parameter was given
Your options do not contain a but you have executed the openURL function so the package does not know what id it should open

### Invalid parameter
The parameter does not exist in the request or is not defined

### Id does not exist
The given id is not available in the database

### No body was given
The body item was not given in the function

### No url was given
The url item does not exist in the body

### Invalid url
The url is not a valid

### Id already exists
The custom id already exists in the database

### No id was given
The id item does not exist in the body

### No token was given
The token item does not exist in the body

### Invalid token
The token is not valid

### Other Errors
Other errors are from the node internal packages fs and crypto (mostly fs when you enter a not existing file)
