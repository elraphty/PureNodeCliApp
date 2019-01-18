/**
 * Index file
*/

const server = require('./lib/server');
const cli = require('./lib/cli');

const app = {};

app.init = () => {
  server.init();
}

app.init();

setTimeout(function() {
  cli.init();
}, 50);