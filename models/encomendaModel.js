const mongoose = require('mongoose');

const Produto = require('./produtoModel');
const Usuario = require('./usuarioModel');
const Store = require('./storeModel');

const encomendaSchema = new mongoose.Schema(
   {
      mensagem: {
         type: String,
         default: 'Olá, gostaria de encomendar este produto',
         required: [true, 'encomenda tem de ter uma mensagem']
      },
      quantidade: {
         type: Number,
         default: 1,
         min: [1, 'Ecomenda no minimo 1 produto'],
         max: [10, 'Só podes encomendar até 10 itens do mesmo produto']
      },
      usuario:
         //Parent referencing
         {
            type: mongoose.Schema.ObjectId,
            ref: Usuario,
            required: [true, 'Encomenda deve pertencer a um usuario']
         },
      produto:
         //Parent referencing
         {
            type: mongoose.Schema.ObjectId,
            ref: Produto, //referencing to a model called 'Produto', so mongoose will look in that collection
            required: [true, 'Encomenda tem de ser feita a um produto']
         },
      store:
         //Parent referencing
         {
            type: mongoose.Schema.ObjectId,
            ref: Store,
            required: [true, 'Encomenda tem de ser feita em uma loja']
         },
      referencia: {
         type: String
      },
      pago: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
   },
   {
      //Show up virtual properties(fields that are not stored in the database) whenever there is an output
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
);

//   Regular expression for all querys that start with 'find':    /^find/

//encomendaSchema.index({ produto: 1, usuario: 1 }, { unique: true }); //Not allowing a user to write more than 1 review for a servico

encomendaSchema.pre('save', function (next) {
   this.createdAt = Date.now();

   next();
});

encomendaSchema.pre(/^find/, function (next) {
   //.pre 'find' query middleware to populate documents with referenced data
   this.populate({
      path: 'produto', //This means that the 'produto' property in our model is the field to be populated based on model
      select: 'nome imagemDeCapa'
   });
   this.populate({
      path: 'usuario',
      select: 'id nomeUsuario nome fotografia'
   });
   this.populate({
      path: 'store',
      select: 'id nomeLoja imagemDeCapa'
   });

   next();
});

encomendaSchema.pre(/^findOneAnd/, async function (next) {
   this.r = await this.findOne();

   next();
});

const Encomenda = mongoose.model('Encomenda', encomendaSchema);

module.exports = Encomenda;
