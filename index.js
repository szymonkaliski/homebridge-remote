#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const request = require("request");
const yargs = require("yargs");

const CONFIG_FILE = path.join(
  require("os").homedir(),
  ".homebridge-remote.json"
);

if (!fs.existsSync(CONFIG_FILE)) {
  console.log(`
    ${CONFIG_FILE} not found, please create it:

    {
      "auth": HOMEBRIDGE_AUTH,
      "url": HOMEBRIDGE_URL
    }
`);

  process.exit(1);
}

const CONFIG = require(CONFIG_FILE);

if (!CONFIG.auth) {
  console.log(`
    "auth" key not found in ${CONFIG_FILE}, please add it
`);

  process.exit(1);
}

if (!CONFIG.url) {
  console.log(`
    "url" key not found in ${CONFIG_FILE}, please add it
`);

  process.exit(1);
}

const AUTHORIZATION_CODE = CONFIG.auth;
const HOMEBRIDGE_HOST = CONFIG.url;

const argv = yargs
  .usage("Usage: $0")
  .demandCommand(1)
  .command("get [aid] [iid]", "get status for provided aid and iid")
  .command("set [aid] [iid] [value]", "set value for provided aid and iid")
  .command("toggle [aid] [iid]", "toggle value for provided aid and iid").argv;

const [command] = argv._;
const { aid, iid, value } = argv;

const getCharacteristics = (aid, iid, callback) => {
  request(
    {
      url: `${HOMEBRIDGE_HOST}/characteristics?id=${aid}.${iid}`,
      headers: {
        "Content-Type": "application/json",
        authorization: AUTHORIZATION_CODE
      }
    },
    (err, res, body) => {
      if (err) {
        callback(err);
        return;
      }

      let parsed;

      try {
        parsed = JSON.parse(body);
      } catch (err) {
        callback(err);
        return;
      }

      callback(null, parsed.characteristics[0]);
    }
  );
};

const setCharacteristics = (aid, iid, value, callback) => {
  request(
    {
      method: "PUT",
      url: `${HOMEBRIDGE_HOST}/characteristics?id=${aid}.${iid}`,
      body: JSON.stringify({
        characteristics: [
          { aid, iid, status: value === 0 ? false : true, value }
        ]
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: AUTHORIZATION_CODE
      }
    },
    (err, res, body) => {
      if (err) {
        callback(err);
        return;
      }

      let parsed;

      try {
        parsed = JSON.parse(body);
      } catch (err) {
        callback(err);
        return;
      }

      callback(null, parsed);
    }
  );
};

if (command === "get") {
  getCharacteristics(aid, iid, (err, parsed) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log(parsed.value === true ? 1 : 0);
    process.exit(0);
  });
}

if (command === "set") {
  setCharacteristics(aid, iid, value, err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    process.exit(0);
  });
}

if (command === "toggle") {
  getCharacteristics(aid, iid, (err, parsed) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    setCharacteristics(aid, iid, parsed.value ? 0 : 1, err => {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      process.exit(0);
    });
  });
}
