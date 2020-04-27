const redis = require("redis");
const configs = require('../configs');
const log = require('./getLogger');

const client = redis.createClient(configs.redis);
client.on("error", function(error) {
  log("err", error);
});

module.exports = client;
