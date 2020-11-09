class Namespace {
   constructor(id, nsTitle, endpoint) {
      this.id = id;
      this.nsTitle = nsTitle;
      this.endpoint = endpoint;
      this.rooms = [];
   }

   addRoom(roomObj) {
      this.rooms.push(roomObj);
   }
}

module.exports = Namespace;
