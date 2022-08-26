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
const urlShortener = require('./urlShortener.js')
```
### Configuration
```js
urlShortener.configURL({
  file: "./urls.json",
  parameter: "id",
  logClicks: true // optional
});
```
