const username = prompt('Please insert your username:');
const socket = io('http://localhost:3000');

socket.on('messageFromServer', dataFromServer => {
   console.log(dataFromServer);
   socket.emit('messageToServer', { data: 'this is from the client' });
});

console.log('hello');
