const serverless = require('serverless-http'); // Netlify
const { AwakeHeroku } = require('awake-heroku');

AwakeHeroku.add({
  url: 'https://gmiTEST.herokuapp.com'
});

const mstime = require('mstime');
mstime.plugins([{ plugin: require('mstime/dist/cjs/plugins/msPluginTrimMean') }]);
mstime.start('app-start');

const { port, env, socketEnabled } = require('./config/vars');

const http = require('http');
const fs = require('fs');
const app = require('./config/express');
const socket = require('./api/services/socket');

const mongoose = require('./config/mongoose');

mongoose.connect();

const options = {};

const server = http.createServer(options, app);

if (socketEnabled) {
  socket.setup(server);
}

server.listen(port, () => {
  console.info(`--- 🌟  Started (${env}) --- http://localhost:${port}`);
  console.log(`${mstime.end('app-start').last} ms`);
});

if (env === 'development') {
  require('./api/utils/InitData');
} else if (env === 'production') {
  require('./api/utils/InitData');
}

module.exports = app;

module.exports.handler = serverless(app);
