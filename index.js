let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let usersTyping = [];

io.on('connection', (socket) => {
  let nickname = null;
  socket.on('disconnect', () => {
    if (nickname != null) {
      io.emit('system message', nickname + ' has disconnected');
    }
  });

  socket.on('set nickname', (nick) => {
    nickname = nick;
    io.emit('system message', nickname + ' has connected');
  });

  socket.on('chat message', (nickname, message) => {
    io.emit('chat message', nickname, message);
  });

  socket.on('typing', (nickname) => {
    if (!usersTyping.includes(nickname)) {
      usersTyping.push(nickname);
      io.emit('typing', usersTyping);
    }
  });

  socket.on('stoptyping', (nickname) => {
    if (usersTyping.includes(nickname)) {
      usersTyping.splice(usersTyping.indexOf(nickname), 1);
      io.emit('typing', usersTyping);
    }
  });
});

http.listen(3000, () => {
  console.log('Listening on port 3000');
});