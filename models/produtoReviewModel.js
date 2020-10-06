const mongoose = require('mongoose');

const Produto = require('./produtoModel');
const Usuario = require('./usuarioModel');

const produtoReviewSchema = new mongoose.Schema(
   {
      review: { type: String, required: [true, 'Review cannot be empty'] },
      rating: { type: Number, min: 1, max: 10 },
      createdAt: { type: Date, default: Date.now },
      produto:
         //Parent referencing
         {
            type: mongoose.Schema.ObjectId,
            ref: Produto, //referencing to a model called 'Produto', so mongoose will look in that collection
            required: [true, 'Review must belong to a produto']
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

produtoReviewSchema.index({ produto: 1, usuario: 1 }, { unique: true }); //Not allowing a user to write more than 1 review for a servico

produtoReviewSchema.pre(/^find/, function (next) {
   //.pre 'find' query middleware to populate documents with referenced data
   this.populate({
      path: 'produto', //This means that the 'produto' property in our model is the field to be populated based on model
      select: 'nome imagemDeCapa'
   });
   this.populate({
      path: 'usuario',
      select: 'id nomeUsuario nome fotografia'
   });

   next();
});

produtoReviewSchema.statics.calcAverageRatings = async function (produtoId) {
   //S11-22 Checar curso
   const stats = await this.aggregate([
      {
         $match: { produto: produtoId }
      },
      {
         $group: {
            _id: '$produto',
            nRating: { $sum: 1 },
            avgRating: { $avg: '$rating' }
         }
      }
   ]);

   //console.log(stats);

   if (stats.length > 0) {
      await Produto.findByIdAndUpdate(produtoId, {
         quantidadeDeAvaliacoes: stats[0].nRating,
         mediaDeAvaliacoes: stats[0].avgRating
      });
   } else {
      await Produto.findByIdAndUpdate(produtoId, {
         quantidadeDeAvaliacoes: 0,
         mediaDeAvaliacoes: 5
      });
   }
};

produtoReviewSchema.post('save', function () {
   //'this' points to document that currently being saved
   this.constructor.calcAverageRatings(this.produto);
});

produtoReviewSchema.pre(/^findOneAnd/, async function (next) {
   this.r = await this.findOne();

   next();
});

produtoReviewSchema.post(/^findOneAnd/, async function (next) {
   //await this.findOne();  Does not work here because the query has already executed
   await this.r.constructor.calcAverageRatings(this.r.produto);
});

const ProdutoReview = mongoose.model('ProdutoReview', produtoReviewSchema);

module.exports = ProdutoReview;
