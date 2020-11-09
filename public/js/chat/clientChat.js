//const username = prompt('Please insert your username:');
//const mainSocket = io('http://localhost:3000/');

//namespaces
//const usuario_usuarioChatSocket = io('http://localhost:3000/chat/usuario_usuario');
const usuario_storeChatSocket = io('http://localhost:3000/chat/usuario_store');
//const store_storeChatSocket = io('http://localhost:3000/chat/store_store');

//const galleryChatSocket = io.of('http://localhost:3000/chat/gallery');

let nsSocket = '';

/* ---------------------------------------Usuario_Usuario------------------------------------- */
// usuario_usuarioChatSocket.on('connect', () => {
//    console.log(usuario_usuarioChatSocket.id);
// });

/* ---------------------------------------Usuario_Store------------------------------------- */
//listen for nsList which contain a list of all available namespaces
usuario_storeChatSocket.on('nsList', nsEndpoint => {
   console.log('list of namespaces', nsEndpoint);
   //joinUsuario_StoreNs(nsEndpoint);
});

/* ---------------------------------------Store_Store------------------------------------- */
// store_storeChatSocket.on('connect', () => {
//    console.log(store_storeChatSocket.id);
// });
