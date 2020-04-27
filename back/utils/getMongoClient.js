const MongoClient = require('mongodb').MongoClient;
const configs = require('../configs');

const connectionUrl = `mongodb://${configs.mongo.host}:${configs.mongo.port}`;
module.exports = MongoClient.connect(connectionUrl, { useUnifiedTopology: true });
