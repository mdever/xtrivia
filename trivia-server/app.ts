import express from 'express';
import path from 'path';
import http from 'http';
import process from 'process';
import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';
import ws from 'ws';
import { User } from './entity/User.entity';
import { Answer, Game, Question, Session, setConnection } from './entity';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import sessionsRouter from './routes/sessions';
import gamesRouter from './routes/games';
import answersRouter from './routes/answers';
import questionsRouter from './routes/questions';
import roomsRouter from './routes/rooms';
import ticketsRouter from './routes/tickets';

const debug = require('debug')('trivia-server:server');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const env = process.env.env || 'local';
const port = normalizePort(process.env.PORT || '8080');

var app = express();

export type WsAuthFn = (msg: ws.RawData) => boolean;

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
    const authListener: WsAuthFn = (msg: ws.RawData) => {
      const msgStr = msg.toString();
      const { ticket } = JSON.parse(msgStr);

      return false;
    }
    socket.on('message', msg => {
      const authorized = authListener(msg);
      if (!authorized) {
        socket.send(JSON.stringify({ authorized: false }));
        socket.close();

      }
    });
})

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
getConnectionOptions(env).then(options => {
  createConnection(options).then(conn => {
    setConnection(conn);

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/sessions', sessionsRouter);
    app.use('/games', gamesRouter);
    app.use('/', questionsRouter);
    app.use('/', answersRouter);
    app.use('/', roomsRouter);
    app.use('/', ticketsRouter);

    app.set('port', port);

    server.on('upgrade', (request, socket, head) => {
        wsServer.handleUpgrade(request, socket, head, socket => {
            wsServer.emit('connection', socket, request);
        })
    })

    module.exports = app;

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  })
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
