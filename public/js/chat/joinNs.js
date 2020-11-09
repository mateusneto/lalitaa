/* eslint-disable */
//my own modules
import { submitMessage } from './submitMessage.js';

nsSocket = io(`http://localhost:3000/chat/usuario_store`);
nsSocket.on('nsRoomLoad', nsRooms => {
   const att = document.querySelector('.message__input');

   const nomeLoja = att.getAttribute('nomeloja');
   const nomeUsuario = att.getAttribute('nomeusuario');

   const roomName = `${nomeUsuario}_${nomeLoja}`;

   joinRoom(roomName);
   window.scrollTo(0, document.body.scrollHeight);
});

/* -------------------------------------------------------------------------- */
const msgInput = document.querySelector('.message__input');
if (msgInput)
   msgInput.addEventListener('submit', event => {
      event.preventDefault();
      const usuario = msgInput.getAttribute('usuarioid');
      const store = msgInput.getAttribute('lojaid');
      const mensagem = document.querySelector('.message__input--box').value;
      const sender = msgInput.getAttribute('sender');
      const receiver = msgInput.getAttribute('receiver');

      console.log(usuario, store, mensagem, sender, receiver);

      submitMessage(usuario, store, mensagem, sender, receiver);

      nsSocket.emit('newMessageToServer', { text: mensagem });
      document.querySelector('.message__input').reset();
   });
//}

/*--------------------------------------------------------------------------------------------*/

nsSocket.on('messageToClients', msg => {
   console.log(msg);
   let msgType;

   console.log(nsSocket.id, msg.socketId);

   if (nsSocket.id === msg.socketId) {
      msgType = 'sent';
   } else {
      msgType = 'received';
   }

   document.querySelector('.messages__list').innerHTML += `<li class="messages__list--${msgType}">${msg.text}</li>`;
   window.scrollTo(0, document.body.scrollHeight);
});

function joinRoom(roomName) {
   console.log(`Joining ${roomName}`);
   nsSocket.emit('joinRoom', roomName);
}
