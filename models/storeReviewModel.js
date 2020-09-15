const mongoose = require('mongoose');

const Store = require('./storeModel');
const Usuario = require('./usuarioModel');

const storeReviewSchema = new mongoose.Schema(
   {
      review: { type: String, required: [true, 'Review cannot be empty'] },
      rating: { type: Number, min: 1, max: 10 },
      createdAt: { type: Date, default: Date.now },
      store:
         //Parent referencing
         {
            type: mongoose.Schema.ObjectId,
            ref: Store, //referencing to a model called 'Store', so mongoose will look in that collection
            required: [true, 'Review must belong to a store']
         },
      usuario:
         //Parent referencing
         {
            type: mongoose.Schema.ObjectId,
            ref: Usuario,
            required: [true, 'Review must be written by an user']
         }
   },
   {
      //Show up virtual properties(fields that are not stored in the database) whenever there is an output
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
);

//   Regular expression for all querys that start with 'find':    /^find/

storeReviewSchema.index({ store: 1, usuario: 1 }, { unique: true }); //Not allowing a user to write more than 1 review for a servico

storeReviewSchema.pre(/^find/, function (next) {
   //.pre 'find' query middleware to populate documents with referenced data
   this.populate({
      path: 'store', //This means that the 'store' property in our model is the field to be populated based on model
      select: 'nome'
   });
   this.populate({
      path: 'usuario',
      select: 'nomeUsuario nome fotografia'
   });

   next();
});

storeReviewSchema.statics.calcAverageRatings = async function (storeId) {
   //S11-22 Checar curso
   const stats = await this.aggregate([
      {
         $match: { store: storeId }
      },
      {
         $group: {
            _id: '$store',
            nRating: { $sum: 1 },
            avgRating: { $avg: '$rating' }
         }
      }
   ]);

   //console.log(stats);

   if (stats.length > 0) {
      await Store.findByIdAndUpdate(storeId, {
         quantidadeDeAvaliacoes: stats[0].nRating,
         mediaDeAvaliacoes: stats[0].avgRating
      });
   } else {
      await Store.findByIdAndUpdate(storeId, {
         quantidadeDeAvaliacoes: 0,
         mediaDeAvaliacoes: 5
      });
   }
};

storeReviewSchema.post('save', function () {
   //'this' points to document that currently being saved
   this.constructor.calcAverageRatings(this.store);
});

storeReviewSchema.pre(/^findOneAnd/, async function (next) {
   this.r = await this.findOne();

   next();
});

storeReviewSchema.post(/^findOneAnd/, async function (next) {
   //await this.findOne();  Does not work here because the query has already executed
   await this.r.constructor.calcAverageRatings(this.r.store);
});

const StoreReview = mongoose.model('StoreReview', storeReviewSchema);

module.exports = StoreReview;
