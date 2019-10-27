'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use( (req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log('Listening on ${ PORT }') );

const io = socketIO(server);

var clients = [];

io.on('connection', (socket) => {
  clients.push(socket);
  console.log('Client connected ' + clients.length);

  socket.on('chatMessage', (message) => {
    clients.forEach((client) => {
      if (socket !== client) {
        client.emit('chatMessage', message);
      }
    });
  });

  socket.on('close', () => console.log('Client disconnected'));
});
