const server = require('./server');
const socketio = require('socket.io');

const io = socketio(server);

io.origins('*:*');

// io.on('connection', socket => {
//    socket.emit('messageFromServer', { data: 'You are connected' });

//    socket.on('messageToServer', dataFromClient => {
//       console.log(dataFromClient);
//    });

//    socket.on('newMessageToServer', msg => {
//       console.log(msg);
//       io.emit('messageToClients', { text: msg.text, socketId: socket.id });
//    });
// });

io.of('/chat').on('connection', socket => {
   socket.emit('messageFromServer', { data: 'You are connected to chat namespace' });

   socket.on('messageToServer', dataFromClient => {
      console.log(dataFromClient);
   });

   socket.on('newMessageToServer', msg => {
      console.log(msg);
      io.of('/chat').emit('messageToClients', { text: msg.text, socketId: socket.id.split('#')[1] });
   });
});
