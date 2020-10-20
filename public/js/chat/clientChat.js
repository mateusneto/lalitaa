//const username = prompt('Please insert your username:');
//const mainSocket = io('http://localhost:3000/');
const chatSocket = io('http://localhost:3000/chat');

chatSocket.on('messageFromServer', dataFromServer => {
   console.log(dataFromServer);
   chatSocket.emit('messageToServer', { data: 'This is from the client' });
});

document.querySelector('.message__input').addEventListener('submit', event => {
   event.preventDefault();
   const newMessage = document.querySelector('.message__input--box').value;

   chatSocket.emit('newMessageToServer', { text: newMessage });
   document.querySelector('.message__input').reset();
});

chatSocket.on('messageToClients', msg => {
   console.log(msg);
   let msgType;

   console.log(chatSocket.id, msg.socketId);

   if (chatSocket.id === msg.socketId) {
      msgType = 'sent';
   } else {
      msgType = 'received';
   }

   document.querySelector('.messages__list').innerHTML += `<li class="messages__list--${msgType}">${msg.text}</li>`;
   window.scrollTo(0, document.body.scrollHeight);
});
