const mongoose = require('mongoose');

const Usuario = require('./usuarioModel');

const Usuario_UsuarioMensagemSchema = new mongoose.Schema(
   {
      mensagem: { type: String, required: [true, 'A mensagem não pode estar vazia'] },
      createdAt: { type: Date, default: Date.now },
      usuario_sender:
         //Parent referencing
         {
            type: mongoose.Schema.ObjectId,
            ref: Usuario,
            required: [true, 'Um usuario deve enviar a mensagem']
         },
      usuario_receiver:
         //Parent referencing
         {
            type: mongoose.Schema.ObjectId,
            ref: Usuario, //referencing to a model called 'Store', so mongoose will look in that collection
            required: [true, 'A mensagem deve ser enviada a um usuario']
         }
   },
   {
      //Show up virtual properties(fields that are not stored in the database) whenever there is an output
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
);

//   Regular expression for all querys that start with 'find':    /^find/

Usuario_UsuarioMensagemSchema.index({ usuario_sender: 1 }); //Não permitir que uma mensagem seja enviada por mais de uma loja
Usuario_UsuarioMensagemSchema.index({ usuario_receiver: 1 }); //Não permitir que uma mensagem vá para mais de uma loja

Usuario_UsuarioMensagemSchema.pre('save', function (next) {
   this.createdAt = Date.now();

   next();
});

Usuario_UsuarioMensagemSchema.pre(/^find/, function (next) {
   //.pre 'find' query middleware to populate documents with referenced data
   this.populate({
      path: 'usuario_sender', //This means that the 'store' property in our model is the field to be populated based on model
      select: 'id nomeUsuario nome fotografia'
   });
   this.populate({
      path: 'usuario_receiver',
      select: 'id nomeUsuario nome fotografia'
   });

   next();
});

const Usuario_UsuarioMensagens = mongoose.model('Usuario_UsuarioMensagens', Usuario_UsuarioMensagemSchema);

module.exports = Usuario_UsuarioMensagens;
