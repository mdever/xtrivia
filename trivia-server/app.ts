import express from 'express';
import path from 'path';
import http from 'http';
import process from 'process';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
import { setConnection } from './entity';

const env = process.env.env || 'local';

const dbpath = "db/trivia.db";
const port = normalizePort(process.env.PORT || '8080');
const debug = require('debug')('trivia-server:server');

var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

createConnection(env).then(conn => {
    setConnection(conn);

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    var indexRouter = require('./routes/index');
    var usersRouter = require('./routes/users');

    app.use('/', indexRouter);
    app.use('/users', usersRouter);

    module.exports = app;

    app.set('port', port);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
})

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
