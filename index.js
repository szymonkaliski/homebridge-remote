#!/usr/bin/env node

const yargs = require("yargs");

const {
  getConfig,
  getAccessories,
  getCharacteristics,
  setCharacteristics,
} = require("./lib");

let config;

try {
  config = getConfig();
} catch (e) {
  console.log(e);
  process.exit(1);
}

const argv = yargs
  .usage("Usage: $0")
  .demandCommand(1)
  .command("get [aid] [iid]", "get status for provided aid")
  .command("set [aid] [iid] [value]", "set value for provided aid")
  .command("toggle [aid] [iid]", "toggle value for provided aid")
  .command("list", "list available devices", (yagrs) => {
    yargs.option("json", {
      describe: "format output as JSON",
    });
  }).argv;

const [command] = argv._;
const { aid, iid, value } = argv;

if (command === "get") {
  getCharacteristics(config, aid, iid, (err, parsed) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    console.log(parsed.value === true ? 1 : 0);
    process.exit(0);
  });
}

if (command === "set") {
  setCharacteristics(config, aid, iid, value, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    process.exit(0);
  });
}

if (command === "toggle") {
  getCharacteristics(config, aid, iid, (err, parsed) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    setCharacteristics(config, aid, iid, parsed.value ? 0 : 1, (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      process.exit(0);
    });
  });
}

if (command === "list") {
  getAccessories(config, (err, data) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    if (argv.json) {
      console.log(JSON.stringify(data));
      process.exit(0);
    } else {
      data.forEach((d) => {
        console.log(`${d.name}\t${d.value}\t[aid: ${d.aid}, iid: ${d.iid}]`);
      });
    }
  });
}
