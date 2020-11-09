//My own modules
const server = require('./server');
const socketio = require('socket.io');

//third party modules
const io = socketio(server);

let namespaces = require('./utils/namespaces');

io.origins('*:*');

/* ------------------------------------Uusuario_Usuario-------------------------------------- */
io.of('/chat/usuario_usuario').on('connection', socket => {
   //build an array to send back with the endpoint for each namespace
   let nsData = namespaces.map(ns => {
      return {
         endpoint: ns.endpoint
      };
   });

   const usuario_usuarioNamespace_endpoint = nsData[0].endpoint;
   socket.emit('nsList', usuario_usuarioNamespace_endpoint);
});

/* ------------------------------------Uusuario_Store-------------------------------------- */
io.of('/chat/usuario_store').on('connection', socket => {
   //build an array to send back with the endpoint for each namespace
   let nsData = namespaces.map(ns => {
      return {
         endpoint: ns.endpoint
      };
   });

   const usuario_storeNamespace_endpoint = nsData[1].endpoint;
   socket.emit('nsList', usuario_storeNamespace_endpoint);
});

/* ------------------------------------Store_Store-------------------------------------- */
io.of('/chat/store_store').on('connection', socket => {
   //build an array to send back with the endpoint for each namespace
   let nsData = namespaces.map(ns => {
      return {
         endpoint: ns.endpoint
      };
   });

   const store_storeNamespace_endpoint = nsData[2].endpoint;
   socket.emit('nsList', store_storeNamespace_endpoint);
});
/* ------------------------------------ END ----------------------------------------------*/

//loop through each namespace and listen for a connection
namespaces.forEach(namespace => {
   io.of(namespace.endpoint).on('connection', nsSocket => {
      // console.log(`${nsSocket.id} has joined the ${namespace.endpoint} namespace`);

      nsSocket.emit('nsRoomLoad', namespaces.rooms);
      nsSocket.on('joinRoom', roomToJoin => {
         nsSocket.join(roomToJoin);
         // console.log(`${nsSocket.id} has joined the ${roomToJoin} room`);

         // io.of(namespace.endpoint)
         //    .in(roomToJoin)
         //    .clients((error, clients) => {
         //       console.log(`this io the namespace.endpoint ---->${namespace.endpoint}`);
         //       console.log(`this is the roomname ----> ${roomToJoin}`);
         //       console.log(`this this is the clients list ----> ${clients}`);
         //    });
      });

      nsSocket.on('newMessageToServer', msg => {
         const roomTitle = Object.keys(nsSocket.rooms)[1];
         io.of(namespace.endpoint)
            .to(roomTitle)
            .emit('messageToClients', { text: msg.text, socketId: nsSocket.id.split('#')[1] });
      });
   });
});
