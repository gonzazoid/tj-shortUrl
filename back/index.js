const https = require('https')
const fs = require('fs');
const express = require('express');
const cors = require('cors')
const session = require('express-session')

const MongoStore = require('connect-mongo')(session);

const mongoClient = require('./utils/getMongoClient');
const redisClient = require('./utils/getRedisClient');

const addHandlers = require('./handlers');
const getContext = require('./utils/getContext');

const configs = require('./configs');
console.log(configs);

const app = express();

app.use(express.json())

const corsOptions = {
  origin: function (origin, callback) {
      callback(null, true)
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)) 

const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

app.use(express.static('public', options))


// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'barbarykikirbudur',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, sameSite: 'none' },
  store: new MongoStore({clientPromise: mongoClient, dbName: configs.mongo.dbName })
}))

const start = async (connectionPromise, redisClient) => {
    const mongoClient = await connectionPromise;
    const ctx = await getContext(mongoClient, redisClient, configs);
    try{
        addHandlers(app, ctx);
        const privateKey = fs.readFileSync('./sslcert/server.key');
        const certificate = fs.readFileSync('./sslcert/server.cert');
        const credentials = {key: privateKey, cert: certificate};
        https.createServer(credentials, app).listen(configs.back.port, function () {
          console.log(`Short urls service listening on port ${configs.back.port}!`);
        });
    }catch(e){
        ctx.log('start', 'err', e);
    }
};

start(mongoClient, redisClient);
