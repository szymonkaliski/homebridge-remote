const fs = require("fs");
const path = require("path");
const request = require("request");

const CONFIG_FILE = path.join(
  require("os").homedir(),
  ".homebridge-remote.json"
);

const getConfig = () => {
  if (!fs.existsSync(CONFIG_FILE)) {
    throw new Error("config file doesn't exist");
  }

  const config = require(CONFIG_FILE);

  if (!config.auth) {
    throw new Error("no 'auth' key in config");
  }

  if (!config.url) {
    throw new Error("no 'url' key in config");
  }

  return config;
};

const getHomebridge = (config, path, callback) => {
  request(
    {
      url: `${config.url}/${path}`,
      headers: {
        "Content-Type": "application/json",
        authorization: config.auth,
      },
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

const getAccessories = (config, callback) => {
  getHomebridge(config, "accessories", (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    const accessories = data.accessories
      .map((d) => {
        let name;
        let value;
        let iid;

        // FIXME: this is super ugly!
        d.services.forEach((s) => {
          if (name !== undefined && value !== undefined) {
            return;
          }

          name = s.characteristics.find((c) => c.type === "23");
          value = s.characteristics.find((c) => c.type === "25");

          if (name !== undefined) {
            name = name.value;
          }

          if (value !== undefined) {
            iid = value.iid;
            value = value.value;
          }
        });

        if (name !== undefined && value !== undefined) {
          return { aid: d.aid, iid, name, value };
        }
      })
      .filter((x) => x);

    callback(null, accessories);
  });
};

const getCharacteristics = (config, aid, iid, callback) => {
  getHomebridge(config, `characteristics?id=${aid}.${iid}`, (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, data.characteristics[0]);
  });
};

const setCharacteristics = (config, aid, iid, value, callback) => {
  request(
    {
      method: "PUT",
      url: `${config.url}/characteristics?id=${aid}.${iid}`,
      body: JSON.stringify({
        characteristics: [{ aid, iid, status: value !== 0, value }],
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: config.auth,
      },
    },
    (err, res, body) => {
      if (err) {
        callback(err);
        return;
      }

      let parsed;

      try {
        parsed = JSON.parse(body || "{}");
      } catch (err) {
        callback(err);
        return;
      }

      callback(null, parsed);
    }
  );
};

module.exports = {
  getConfig,
  getAccessories,
  getCharacteristics,
  setCharacteristics,
};
