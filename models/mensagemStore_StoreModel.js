const mongoose = require('mongoose');

const Store = require('./storeModel');

const Store_StoreMensagemSchema = new mongoose.Schema(
   {
      mensagem: { type: String, required: [true, 'A mensagem não pode estar vazia'] },
      createdAt: { type: Date, default: Date.now },
      store_sender:
         //Parent referencing
         {
            type: mongoose.Schema.ObjectId,
            ref: Store,
            required: [true, 'Uma loja deve enviar a mensagem']
         },
      store_receiver:
         //Parent referencing
         {
            type: mongoose.Schema.ObjectId,
            ref: Store, //referencing to a model called 'Store', so mongoose will look in that collection
            required: [true, 'A mensagem deve ser enviada a uma loja']
         }
   },
   {
      //Show up virtual properties(fields that are not stored in the database) whenever there is an output
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
);

//   Regular expression for all querys that start with 'find':    /^find/

Store_StoreMensagemSchema.index({ store_sender: 1 }); //Não permitir que uma mensagem seja enviada por mais de uma loja
Store_StoreMensagemSchema.index({ store_receiver: 1 }); //Não permitir que uma mensagem vá para mais de uma loja

Store_StoreMensagemSchema.pre('save', function (next) {
   this.createdAt = Date.now();

   next();
});

Store_StoreMensagemSchema.pre(/^find/, function (next) {
   //.pre 'find' query middleware to populate documents with referenced data
   this.populate({
      path: 'store_sender', //This means that the 'store' property in our model is the field to be populated based on model
      select: 'nome imagemDeCapa'
   });
   this.populate({
      path: 'store_receiver',
      select: 'nome imagemDeCapa'
   });

   next();
});

const Store_StoreMensagens = mongoose.model('Store_StoreMensagens', Store_StoreMensagemSchema);

module.exports = Store_StoreMensagens;
