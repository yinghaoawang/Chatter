let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let users = [];
let usersTyping = [];

io.on('connection', (socket) => {
  let nickname = null;
  socket.on('disconnect', () => {
    if (nickname != null) {
      socket.broadcast.emit('system message', nickname + ' has disconnected');
      usersTyping.splice(usersTyping.indexOf(nickname), 1);
    }
  });

  socket.on('set nickname', (nick) => {
    if (users.includes(nick)) {
      socket.emit('nickname validity', false);
      return;
    }
    nickname = nick;
    users.push(nickname);
    socket.broadcast.emit('system message', nickname + ' has connected');
    socket.emit('nickname validity', true);
  });

  socket.on('chat message', (nickname, message) => {
    io.emit('chat message', nickname, message);
  });

  socket.on('typing', (nickname) => {
    if (!usersTyping.includes(nickname)) {
      usersTyping.push(nickname);
      socket.broadcast.emit('typing', usersTyping);
    }
  });

  socket.on('stoptyping', (nickname) => {
    if (usersTyping.includes(nickname)) {
      usersTyping.splice(usersTyping.indexOf(nickname), 1);
      socket.broadcast.emit('typing', usersTyping);
    }
  });
});

http.listen(3000, () => {
  console.log('Listening on port 3000');
});
