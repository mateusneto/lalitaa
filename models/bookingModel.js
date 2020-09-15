const mongoose = require('mongoose');

const Store = require('./storeModel');
const Produto = require('./produtoModel');
const Usuario = require('./usuarioModel');

const bookingSchema = new mongoose.Schema({
   produto: {
      type: mongoose.Schema.ObjectId,
      ref: 'Produto',
      required: [true, 'Booking must belong to a produto']
   },
   store: {
      type: mongoose.Schema.ObjectId,
      ref: 'Store',
      required: [true, 'Booking must belong to a store']
   },

   usuario: {
      type: mongoose.Schema.ObjectId,
      ref: 'Usuario',
      required: [true, 'Booking must belong to a user']
   },
   preco: {
      type: Number,
      required: [true, 'Booking must have a price']
   },
   createdAt: {
      type: Date,
      default: Date.now()
   },
   paid: {
      type: Boolean,
      default: true
   }
});

bookingSchema.pre(/^find/, function (next) {
   this.populate({ path: 'produto', select: 'nome' })
      .populate({ path: 'usuario', select: 'nomeUsuario' })
      .populate({ path: 'store', select: 'nomeLoja' });

   next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
