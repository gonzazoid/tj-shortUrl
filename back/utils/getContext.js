const resolver = require('./resolve');
const log = require('./getLogger');

module.exports = function(mongoClient, redisClient, configs){
    const db = mongoClient.db(configs.mongo.dbName);
    const aliases = db.collection('aliases');

    const resolve = resolver(aliases, redisClient);
    const ctx = { mongoClient, db, aliases, resolve, log }

    return ctx;
};
