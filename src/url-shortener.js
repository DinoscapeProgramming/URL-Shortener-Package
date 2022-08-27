const fs = require('fs');
const crypto = require('crypto');

function isURL(url) {
  try {
    new URL(url)
  } catch (err) {
    return false;
  }
  return true;
}

function configURL(options) {
  return new Promise(function (resolve, reject) {
    if (!options || typeof options !== "object") return resolve({ action: "config", err: "No options were given" });
    module.exports = {
      options
    }
    return resolve({ action: "config", options });
  });
}

function device(request) {
  return new Promise(function (resolve, reject) {
    var useragent = request.headers['user-agent'];
    if (!useragent || useragent === "") {
      if (request.headers['cloudfront-is-mobile-viewer'] === 'true') return resolve({ action: "device", device: "Phone" });
      if (request.headers['cloudfront-is-tablet-viewer'] === 'true') return resolve({ action: "device", device: "Tablet" });
      if (request.headers['cloudfront-is-desktop-viewer'] === 'true') return resolve({ action: "device", device: "Desktop" });
      return resolve({ action: "device", device: "Unavailable" });
    } else {
      if (useragent.match(/iP(a|ro)d/i) || (useragent.match(/tablet/i) && !useragent.match(/RX-34/i)) || useragent.match(/FOLIO/i)) {
        return resolve({ action: "device", device: "Tablet" });
      } else if (useragent.match(/Linux/i) && useragent.match(/Android/i) && !useragent.match(/Fennec|mobi|HTC Magic|HTCX06HT|Nexus One|SC-02B|fone 945/i)) {
        return resolve({ action: "device", device: "Android Tablet" });
      } else if (useragent.match(/Kindle/i) || (useragent.match(/Mac OS/i) && useragent.match(/Silk/i)) || (useragent.match(/AppleWebKit/i) && useragent.match(/Silk/i) && !useragent.match(/Playstation Vita/i))) {
        return resolve({ action: "device", device: "Kindle Tablet" });
      } else if (useragent.match(/GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC( Flyer|_Flyer)|Sprint ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos S7|Dell Streak 7|Advent Vega|A101IT|A70BHT|MID7015|Next2|nook/i) || (useragent.match(/MB511/i) && useragent.match(/RUTEM/i))) {
        return resolve({ action: "device", device: "Android Tablet" });
      } else if (useragent.match(/BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google Wireless Transcoder/i) && !useragent.match(/AdsBot-Google-Mobile/i)) {
        return resolve({ action: "device", device: "Phone" });
      } else if (useragent.match(/Opera/i) && ua.match(/Windows NT 5/i) && ua.match(/HTC|Xda|Mini|Vario|SAMSUNG\-GT\-i8000|SAMSUNG\-SGH\-i9/i)) {
        return resolve({ action: "device", device: "Opera Phone" });
      } else if ((useragent.match(/Windows( )?(NT|XP|ME|9)/) && !useragent.match(/Phone/i)) && !useragent.match(/Bot|Spider|ia_archiver|NewsGator/i) || useragent.match(/Win( ?9|NT)/i) || useragent.match(/Go-http-client/i)) {
        return resolve({ action: "device", device: "Windows Desktop" });
      } else if (useragent.match(/Macintosh|PowerPC/i) && !useragent.match(/Silk|moatbot/i)) {
        return resolve({ action: "device", device: "Mac Desktop" });
      } else if (useragent.match(/Linux/i) && useragent.match(/X11/i) && !useragent.match(/Charlotte|JobBot/i)) {
        return resolve({ action: "device", device: "Linux Desktop" });
      } else if (useragent.match(/CrOS/)) {
        return resolve({ action: "device", device: "Chromebook" });
      } else if (useragent.match(/Solaris|SunOS|BSD/i)) {
        return resolve({ action: "device", device: "Solaris, SunOS, BSD Desktop" });
      } else {
        return resolve({ action: "device", device: "Unavailable" });
      }
    }
  });
}

function clickURL(request) {
  return new Promise(function (resolve, reject) {
    if (!Object.keys(module.exports).includes("options") || !module.exports.options) return resolve({ action: "click", err: "No options were given" });
    if (!Object.keys(module.exports.options).includes("file") || !module.exports.options.file) return resolve({ action: "click", err: "No file was given" });
    if (!request?.ip) return resolve({ action: "click", err: "Enable trust proxy" });
    device(request).then((result) => {
      var buffer = JSON.parse(fs.readFileSync(module.exports.options.file, "utf8"));
      buffer[request.params.id].clicks.push({ date: Date.now(), device: result.device, ip: request.ip });
      fs.writeFileSync(module.exports.options.file, JSON.stringify(buffer), "utf8");
      return resolve({ action: "click", device: result.device, ip: request.ip });
    });
  });
}

function openURL(request, result) {
  if (!Object.keys(module.exports).includes("options") || !module.exports.options) return resolve({ action: "open", err: "No options were given" });
  if (!Object.keys(module.exports.options).includes("file") || !module.exports.options.file) return resolve({ action: "open", err: "No file was given" });
  if (!Object.keys(module.exports.options).includes("parameter") || !module.exports.options.parameter) return resolve({ action: "open", err: "No parameter was given" });
  return new Promise(function (resolve, reject) {
    if (!Object.keys(request).includes("params") || !request.params) return resolve({ action: "open", err: "No parameters were given" });
    if (!Object.keys(request.params).includes(module.exports.options.parameter) || !request.params[module.exports.options.parameter]) return resolve({ action: "open", err: "No parameter was given" });
    if (Object.keys(JSON.parse(fs.readFileSync(module.exports.options.file, "utf8"))).includes(request.params[module.exports.options.parameter])) {
      try {
        result.redirect(JSON.parse(fs.readFileSync(module.exports.options.file, "utf8"))[request.params[module.exports.options.parameter]].url);
      } catch (err) {
        return resolve({ action: "open", err: err.message });
      }
      if (module.exports.options.logClicks === true) {
        clickURL(request).then((result) => {
          if (result.err) {
            return resolve(result);
          }
          return resolve({ action: "open", url: JSON.parse(fs.readFileSync(module.exports.options.file, "utf8"))[request.params[module.exports.options.parameter]].url });
        });
      } else {
        return resolve({ action: "open", url: JSON.parse(fs.readFileSync(module.exports.options.file, "utf8"))[request.params[module.exports.options.parameter]].url });
      }
    } else {
      return resolve({ action: "open", err: "Id does not exist" });
    }
  });
}

function createURL(body) {
  return new Promise(function (resolve, reject) {
    if (!Object.keys(module.exports).includes("options") || !module.exports.options) return resolve({ action: "create", err: "No options were given" });
    if (!Object.keys(module.exports.options).includes("file") || !module.exports.options.file) return resolve({ action: "create", err: "No file was given" });
    if (!body || Object.keys(body).length === 0) return resolve({ action: "create", err: "No body was given" });
    if (!Object.keys(body).includes("url") || !body.url) return resolve({ action: "create", err: "No url was given" });
    if (!isURL(body.url)) return resolve({ action: "create", err: "Invalid url" });
    if (Object.keys(body).includes("id") && body.id) {
      if (Object.keys(JSON.parse(fs.readFileSync(module.exports.options.file, "utf8"))).includes(body.id)) return resolve({ action: "create", err: "Id already exists" });
      crypto.randomBytes(10, function (err, token) {
        if (err) return resolve({ err: err.message });
        fs.writeFileSync(module.exports.options.file, JSON.stringify({
          ...JSON.parse(fs.readFileSync(module.exports.options.file, "utf8")),
          ...{
            [body.id]: {
              token: token.toString('hex'),
              url: body.url,
              clicks: []
            }
          }
        }), 'utf8');
        return resolve({ action: "create", id: body.id, url: body.url, token: token.toString('hex'), disclaimer: "The token you got is used to edit or delete the url from the database" });
      });
    } else {
      crypto.randomBytes(4, function (err, id) {
        if (err) return resolve({ err: err.message });
        crypto.randomBytes(10, function (err, token) {
          if (err) return resolve({ err: err.message });
          fs.writeFileSync(module.exports.options.file, JSON.stringify({
            ...JSON.parse(fs.readFileSync(module.exports.options.file, "utf8")),
            ...{
              [id.toString('hex')]: {
                token: token.toString('hex'),
                url: body.url,
                clicks: []
              }
            }
          }), 'utf8');
          return resolve({ action: "create", id: id.toString('hex'), url: body.url, token: token.toString('hex'), disclaimer: "The token you got is used to edit or delete the url from the database" });
        });
      });
    }
  });
}

function editURL(body) {
  return new Promise(function (resolve, reject) {
    if (!Object.keys(module.exports).includes("options") || !module.exports.options) return resolve({ action: "edit", err: "No options were given" });
    if (!Object.keys(module.exports.options).includes("file") || !module.exports.options.file) return resolve({ action: "edit", err: "No file was given" });
    if (!body || Object.keys(body).length === 0) return resolve({ action: "edit", err: "No body was given" });
    if (!Object.keys(body).includes("id") || !body.id) return resolve({ action: "edit", err: "No id was given" });
    if (!Object.keys(body).includes("url") || !body.url) return resolve({ action: "edit", err: "No url was given" });
    if (!Object.keys(body).includes("token") || !body.token) return resolve({ action: "edit", err: "No token was given" });
    if (!Object.keys(JSON.parse(fs.readFileSync(module.exports.options.file, "utf8"))).includes(body.id)) return resolve({ action: "edit", err: "Id does not exists" });
    if (JSON.parse(fs.readFileSync(module.exports.options.file, "utf8"))[body.id].token !== body.token) return resolve({ action: "edit", err: "Invalid token" });
    if (!isURL(body.url)) return resolve({ action: "create", err: "Invalid url" });
    fs.writeFileSync(module.exports.options.file, JSON.stringify({
      ...JSON.parse(fs.readFileSync(module.exports.options.file, 'utf8')),
      ...{
        [body.id]: {
          token: body.token,
          url: body.url
        }
      }
    }), 'utf8');
    return resolve({ action: "edit", id: body.id, url: body.url, token: body.token });
  });
}

function deleteURL(body) {
  return new Promise(function (resolve, reject) {
    if (!Object.keys(module.exports).includes("options") || !module.exports.options) return resolve({ action: "delete", err: "No options were given" });
    if (!Object.keys(module.exports.options).includes("file") || !module.exports.options.file) return resolve({ action: "delete", err: "No file was given" });
    if (!body || Object.keys(body).length === 0) return resolve({ action: "delete", err: "No body was given" });
    if (!Object.keys(body).includes("id") || !body.id) return resolve({ action: "delete", err: "No id was given" });
    if (!Object.keys(body).includes("token") || !body.token) return resolve({ action: "delete", err: "No token was given" });
    if (!Object.keys(JSON.parse(fs.readFileSync(module.exports.options.file, 'utf8'))).includes(body.id)) return resolve({ action: "delete", err: "Id does not exists" });
    if (JSON.parse(fs.readFileSync(module.exports.options.file, 'utf8'))[body.id].token !== body.token) return resolve({ action: "delete", err: "Invalid token" });
    var buffer = JSON.parse(fs.readFileSync(module.exports.options.file, 'utf8'));
    delete buffer[body.id];
    fs.writeFileSync(module.exports.options.file, JSON.stringify(buffer), 'utf8');
    return resolve({ action: "delete", id: body.id, token: body.token });
  });
}

function getURL(body) {
  return new Promise(function (resolve, reject) {
    if (!Object.keys(module.exports).includes("options") || !module.exports.options) return resolve({ action: "get", err: "No options were given" });
    if (!Object.keys(module.exports.options).includes("file") || !module.exports.options.file) return resolve({ action: "get", err: "No file was given" });
    if (!body || Object.keys(body).length === 0) return resolve({ action: "get", err: "No body was given" });
    if (!Object.keys(body).includes("id") || !body.id) return resolve({ action: "get", err: "No id was given" });
    if (!Object.keys(body).includes("token") || !body.token) return resolve({ action: "get", err: "No token was given" });
    if (!Object.keys(JSON.parse(fs.readFileSync(module.exports.options.file, 'utf8'))).includes(body.id)) return resolve({ action: "get", err: "Id does not exists" });
    if (JSON.parse(fs.readFileSync(module.exports.options.file, 'utf8'))[body.id].token !== body.token) return resolve({ action: "get", err: "Invalid token" });
    return resolve({ action: "get", id: body.id, token: body.token, url: JSON.parse(fs.readFileSync(module.exports.options.file, 'utf8'))[body.id].url, clicks: JSON.parse(fs.readFileSync(module.exports.options.file, 'utf8'))[body.id].clicks })
  });
}

module.exports = {
  configURL,
  openURL,
  createURL,
  editURL,
  deleteURL
}
