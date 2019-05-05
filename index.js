let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let users = [];
let usersTyping = [];
let userSocketMap = [];

io.on('connection', (socket) => {
  let nickname = null;

  socket.on('disconnect', () => {
    if (nickname != null) {
      socket.broadcast.emit('system message', nickname + ' has disconnected');
      usersTyping.splice(usersTyping.indexOf(nickname), 1);
      users.splice(users.indexOf(nickname), 1);
      // todo
      delete userSocketMap[nickname];
      io.emit('users online', users);
    }
  });

  socket.on('set nickname', (nick) => {
    if (users.includes(nick) || nick.match(/[^0-9a-z]/i)) {
      socket.emit('nickname validity', false);
      return;
    }
    nickname = nick;
    users.push(nickname);
    userSocketMap[nickname] = socket.id;
    socket.broadcast.emit('system message', nickname + ' has connected');
    io.emit('users online', users);
    socket.emit('nickname validity', true);
  });

  socket.on('chat message', (nickname, message) => {
    if (message.length == 0) return;

    if (message[0] == '/') {
      let tokens = message.split(" ").filter(item => item);
      if (tokens.length > 2) {
        if (tokens[0] == '/w' && users.includes(tokens[1])) {
            let targetSocketId = userSocketMap[tokens[1]];
            let cleanedMsg = message.substring(2).trim();
            cleanedMsg = cleanedMsg.substring(cleanedMsg.indexOf(' '));
            socket.emit('system message', 'Whispered to ' + tokens[1] + ': ' + cleanedMsg);
            socket.broadcast.to(targetSocketId).emit('system message', nickname + ' whispered ' + cleanedMsg);
        }
      }
    } else {
      io.emit('chat message', nickname, message);
    }
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

const port = process.env.PORT || 9000;

http.listen(port, () => {
  console.log('Listening on port ' + port);
});
