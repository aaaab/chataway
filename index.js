const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  // Generate a random chat room id and redirect.
  const chatId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15);
  res.redirect('/' + chatId);
});

app.use(express.static(__dirname));

app.get('/:chatId', (req, res) => {
  // Send the index file for the app.
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message', (event) => {
    console.log(event);
    io.emit('message', event);
  });
  socket.on('disconnect', () => console.log('disconnected'));
});

const PORT = process.env.PORT;
http.listen(PORT, () => {
  console.log(`Listening on :${PORT}`);
});