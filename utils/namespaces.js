const Namespace = require('./Namespace');
const Room = require('./Room');

// Set up the namespaces
let namespaces = [];
let usuario_usuarioNS = new Namespace(0, 'Usuario_Usuario', '/chat/usuario_usuario');
let usuario_storeNS = new Namespace(1, 'Usuario_Store', '/chat/usuario_store');
let store_storeNS = new Namespace(2, 'Store_Store', '/chat/store_store');

usuario_usuarioNS.addRoom(new Room(0, 'private_usuario_usuario', 'chat/usuario_usuario', true));
usuario_storeNS.addRoom(new Room(0, 'private_usuario_store', 'chat/usuario_store', true));
store_storeNS.addRoom(new Room(0, 'private_store_store', 'chat/store_store', true));

namespaces.push(usuario_usuarioNS, usuario_storeNS, store_storeNS);

module.exports = namespaces;
