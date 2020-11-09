const mongoose = require('mongoose');

const Store = require('./storeModel');
const Usuario = require('./usuarioModel');

const Usuario_StoreMensagemSchema = new mongoose.Schema(
   {
      mensagem: { type: String, required: [true, 'A mensagem não pode estar vazia'] },
      createdAt: { type: Date, default: Date.now },
      usuario:
         //Parent referencing
         {
            type: mongoose.Schema.ObjectId,
            ref: Usuario,
            required: [true, 'Um usuario deve enviar a mensagem']
         },
      store:
         //Parent referencing
         {
            type: mongoose.Schema.ObjectId,
            ref: Store, //referencing to a model called 'Store', so mongoose will look in that collection
            required: [true, 'A mensagem deve ser enviada a uma loja']
         },
      sender: {
         type: String
      },
      receiver: {
         type: String
      }
   },
   {
      //Show up virtual properties(fields that are not stored in the database) whenever there is an output
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
);

//   Regular expression for all querys that start with 'find':    /^find/

Usuario_StoreMensagemSchema.index({ usuario: 1 }); //Não permitir que uma mensagem vá para mais de um usuario
Usuario_StoreMensagemSchema.index({ store: 1 }); //Não permitir que uma mensagem vá para mais de uma loja

Usuario_StoreMensagemSchema.pre('save', function (next) {
   this.createdAt = Date.now();

   next();
});

Usuario_StoreMensagemSchema.pre(/^find/, function (next) {
   //.pre 'find' query middleware to populate documents with referenced data

   this.populate({
      path: 'usuario',
      select: 'id nomeUsuario nome fotografia'
   });

   this.populate({
      path: 'store', //This means that the 'store' property in our model is the field to be populated based on model
      select: 'nome nomeLoja imagemDeCapa'
   });

   next();
});

const Usuario_StoreMensagens = mongoose.model('Usuario_StoreMensagens', Usuario_StoreMensagemSchema);

module.exports = Usuario_StoreMensagens;
