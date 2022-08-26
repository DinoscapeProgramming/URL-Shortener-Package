const fs = require('fs');
const crypto = require('crypto');
const { nanoid } = require('nanoid');

function configURL(options) {
  return new Promise(function (resolve, reject) {
    if (!options || typeof options !== "object") return resolve({ action: "config", err: "No options were given" });
    module.exports = {
      options
    }
    return resolve({ action: "config", options });
  });
}

function clickURL(request) {
  return new Promise(function (resolve, reject) {
    if (!Object.keys(module.exports).includes("options") || !module.exports.options) return resolve({ action: "click", err: "No options were given" });
    if (!Object.keys(module.exports.options).includes("file") || !module.exports.options.file) return resolve({ action: "click", err: "No file was given" });
    if (!Object.keys(request).includes("device") || !request.device) return resolve({ action: "click", err: "Package Express Device not found" });
    if (!Object.keys(request).includes("ip") || !request.ip) return resolve({ action: "click", err: "Enable trust proxy" });
    var buffer = JSON.parse(fs.readFileSync(module.exports.options.file, "utf8"));
    buffer[request?.params?.id].clicks.push({ date: Date.now(), device: request?.device.type, ip: request.ip });
    fs.writeFileSync("./urls.json", JSON.stringify(buffer), "utf8");
    return resolve({ action: "click", device: request.device.type, ip: request.ip });
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
      clickURL(request).then((result) => {
        if (result.err) {
          return resolve(result);
        }
      });
      return resolve({ action: "open", url: JSON.parse(fs.readFileSync(module.exports.options.file, "utf8"))[request.params[module.exports.options.parameter]].url });
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
    if (Object.keys(body).includes("id") && body.id) {
      if (Object.keys(JSON.parse(fs.readFileSync(module.exports.options.file, "utf8"))).includes(body.id)) return resolve({ action: "create", err: "Id already exists" });
      var token = nanoid();
      fs.writeFileSync(module.exports.options.file, JSON.stringify({
        ...JSON.parse(fs.readFileSync(module.exports.options.file, "utf8")),
        ...{
          [body.id]: {
            token: token,
            url: body.url,
            clicks: []
          }
        }
      }), 'utf8');
      return resolve({ action: "create", id: body.id, url: body.url, token, disclaimer: "The token you got is used to edit or delete the url from the database" });
    } else {
      crypto.randomBytes(4, function (err, resp) {
        var id = resp.toString('hex');
        var token = nanoid();
        if (err) return resolve({ err: err.message });
        fs.writeFileSync(module.exports.options.file, JSON.stringify({
          ...JSON.parse(fs.readFileSync(module.exports.options.file, "utf8")),
          ...{
            [id]: {
              token: token,
              url: body.url,
              clicks: []
            }
          }
        }), 'utf8');
        return resolve({ action: "create", id, url: body.url, token, disclaimer: "The token you got is used to edit or delete the url from the database" });
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
