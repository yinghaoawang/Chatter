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
    if (nickname == null) return;
      socket.broadcast.emit('system message', nickname + ' has disconnected');
      usersTyping.splice(usersTyping.indexOf(nickname), 1);
      users.splice(users.indexOf(nickname), 1);
      delete userSocketMap[nickname];
      io.emit('users online', users);
      nickname = null;
  });

  socket.on('set nickname', (n) => {
    if (nickname != null) return;

    if (users.includes(n) || n.match(/[^0-9a-z]/i)) {
      socket.emit('nickname validity', false);
      return;
    }
    nickname = n;
    users.push(nickname);
    userSocketMap[nickname] = socket.id;
    socket.broadcast.emit('system message', nickname + ' has connected');
    io.emit('users online', users);
    socket.emit('nickname validity', true);
  });

  socket.on('chat message', (message) => {
    if (nickname == null) return;
    if (message.length == 0) return;

    if (message[0] == '/') {
      let tokens = message.split(" ").filter(item => item);
      if (tokens.length > 2) {
        let targetNickname = tokens[1];
        if (tokens[0] == '/w' && users.includes(targetNickname)) {
            let targetSocketId = userSocketMap[targetNickname];
            let messageContent = message.substring(2).trim();
            messageContent = messageContent.substring(messageContent.indexOf(' '));
            socket.emit('system message', 'Whispered to ' + targetNickname + ': ' + messageContent);
            let resultMessage = nickname + ' whispered ' + messageContent;
            socket.broadcast.to(targetSocketId).emit('system message', resultMessage);
        }
      }
    } else {
      io.emit('chat message', nickname, message);
    }
  });

  socket.on('typing', (nickname) => {
    if (nickname == null) return;
    if (!usersTyping.includes(nickname)) {
      usersTyping.push(nickname);
      socket.broadcast.emit('typing', usersTyping);
    }
  });

  socket.on('stoptyping', () => {
    if (nickname == null) return;
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
