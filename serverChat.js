const io = require('./server');

io.on('connection', socket => {
   socket.emit('messageFromServer', { data: 'Welcome to the server' });
   socket.on('messageToServer', dataFromClient => {
      console.log(dataFromClient);
   });
});
