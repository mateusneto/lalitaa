function joinRoom(roomName) {
   console.log(`Joining ${roomName}`);
   nsSocket.emit('joinRoom', roomName);
}
