#!/usr/bin/env node

const request = require("request");
const yargs = require("yargs");

const argv = yargs
  .usage("Usage: $0 --host HOMEBRIDGE_URL --auth HOMEBRIDGE_AUTH")
  .demandOption(["host", "auth"])
  .demandCommand(1)
  .command("get [aid] [iid]", "get status for provided aid and iid")
  .command("set [aid] [iid] [value]", "set value for provided aid and iid")
  .command("toggle [aid] [iid]", "toggle value for provided aid and iid").argv;

const AUTHORIZATION_CODE = argv.auth;
const HOMEBRIDGE_HOST = argv.host;

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

    console.log(parsed.status);
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
