var fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require("socket.io");
var request = require('request-promise');
var _ = require('lodash');
var healthcheck = require('express-healthcheck');

// Global Config
let config = getConfig();

console.log(`Config is:`);
console.log(config);

// Express
var app = express();

// Socket.io
var io = socket_io();
app.io = io;

// Routes
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/healthcheck', healthcheck());
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// socket.io events
io.on("connection", function (socket) {
  console.log("A user connected");
});

setInterval(function () {

  // Get nodes and emit to socket.io
  getNodes().then(nodes => {
    io.volatile.emit('nodes', nodes);

    // Log object if in debug mode
    if (config.debug) {
      console.log(nodes);
    }
  });

}, config.refresh_rate);


function getConfig() {

  // Attempt to retrieve secrets, else fallback to env variables
  return {
    token: null,
    ucp_fqdn: getSecret('ucp_fqdn') || process.env.ucp_fqdn,
    ucp_username: getSecret('ucp_username') || process.env.ucp_username,
    ucp_password: getSecret('ucp_password') || process.env.ucp_password,
    refresh_rate: process.env.refresh_rate || 3000,
    debug: process.env.debug || false
  };

}

function getSecret(secretName) {

  const secretPath = `/run/secrets/visualizeer.${secretName}`;

  if (fs.existsSync(secretPath)) {
    console.log(`Docker Secret detected for ${secretName}`);
    return fs.readFileSync(secretPath, 'utf8');
  } else {
    console.log(`No Docker Secret detected for ${secretName}`);
    return false;
  };
}

async function getToken() {

  // Get a token if undefined
  if (config.token) {

    return config.token;

  } else {

    console.info('Retrieving a token');

    // Setup Request options
    const options = {
      method: 'POST',
      uri: `https://${config.ucp_fqdn}/auth/login`,
      body: {
        username: config.ucp_username,
        password: config.ucp_password
      },
      json: true,
      rejectUnauthorized: false
    };

    // Select session token from the response body
    const response = await request(options);

    // Store token 
    config.token = response.auth_token;

    // Return session token
    return config.token;

  }
}

async function getNodes() {

  // Get an authentication token
  const token = await getToken();

  // Setup Request options for nodes
  const nodeOptions = {
    method: 'GET',
    uri: `https://${config.ucp_fqdn}/nodes`,
    headers: {
      authorization: `Bearer ${token}`
    },
    json: true,
    rejectUnauthorized: false
  };

  // Get node data
  nodes = await request(nodeOptions);

  // Setup Request options for containers
  const containerOptions = {
    method: 'GET',
    uri: `https://${config.ucp_fqdn}/containers/json?all=true&filters={"status":["created","restarting","running","removing","paused"]}`,
    headers: {
      authorization: `Bearer ${token}`
    },
    json: true,
    rejectUnauthorized: false
  };

  // Get container data
  containers = await request(containerOptions);

  // Define a new array to hold the combined node and container data
  let compiledNodes = nodes.map((node) => {

    // Extend the node object with an array for its containers
    node.Containers = [];

    containers.forEach((container) => {

      // Parse the container's name to determine its node
      const containerNode = container.Names[0].split('/')[1];

      // Check if the current container resides on the current node
      if (containerNode == node.Description.Hostname) {

        // Add container to the node object
        node.Containers.push(container);

      }

    })

    return node;

  });

  // Sort nodes
  return _.sortBy(compiledNodes, ['Spec.Role', 'Description.Hostname']);

}

module.exports = app;