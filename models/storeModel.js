const mongoose = require('mongoose');
const slugify = require('slugify');

//My OWN MODULES
const Usuario = require('./usuarioModel'); //Not needed for Child referencing @"moderadores"
const StoreOwner = require('./storeOwnerModel');
//Third-party modules
const validator = require('validator');

const storeSchema = new mongoose.Schema(
   {
      nome: {
         type: String,
         required: [true, 'Nome em falta'],
         maxlength: [30, 'O nome do servico tem de ter 40 digitos ou menos'],
         minlength: [3, 'O nome do servico tem de ter 3 ou mais digitos']
         //validate: [validator.isAlpha, 'Apenas letras no nome'],
      },
      nomeLoja: {
         type: String,
         required: [true, 'Por favor adicione um nome unico para a loja'],
         unique: true,
         trim: true,
         maxlength: [15, 'O nome da loja tem de ter 15 digitos ou menos'],
         minlength: [3, 'O nome da loja tem de ter 3 ou mais digitos'],
         validate: [validator.isAlpha, 'Apenas letras no nome']
      },
      //Parent referencing
      storeOwner: {
         type: mongoose.Schema.ObjectId,
         ref: 'StoreOwner',
         required: [true, 'Loja deve pertencer a um dono']
      },
      storeProducts: [
         {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
         }
      ],
      estado: {
         type: String,
         enum: ['online', 'offline'],
         default: 'offline'
      },
      slug: String,
      mediaDeAvaliacoes: {
         type: Number,
         default: 5.0,
         min: [1.0, '1.0 é o minimo valor para uma classificação'],
         max: [10.0, '10.0 é o maximo valor para uma classificação'],
         set: val => Math.round(val * 10) / 10
      },
      quantidadeDeAvaliacoes: {
         type: Number,
         default: 0
      },
      tipo: {
         type: String,
         required: [true, 'Tipo de loja em falta'],
         default: 'Boutique',
         enum: {
            values: ['Boutique', 'Atelier', 'Zunga', 'Negocio particular'],
            message: 'Tipo de loja não válido'
         }
      },
      descricao: {
         type: String,
         trim: true
      },
      imagemDeCapa: {
         type: String,
         required: [true, 'Imagem em falta'],
         default: 'store.jpg'
      },
      criadoEm: {
         type: Date,
         default: Date.now(),
         select: false
      },
      // moderadores: Array, Embedding
      /*moderadores:
         //Child Referencing
         [
            {
               type: mongoose.Schema.ObjectId,
               ref: 'Usuario' //creating a reference to usuarioModel
            }
         ],*/
      lojaSecreta: {
         type: Boolean,
         default: false
      }
   },
   {
      //Show up virtual properties(fields that are not stored in the database) whenever there is an output
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
);

//Indexes
//storeSchema.index({ preco: 1 }); //single field index
//storeSchema.index({ preco: 1, mediaDeAvaliacoes: -1 }); //Compound index
storeSchema.index({ slug: 1 });

//Virtual populate: virtual populating 'servicoModel' with data from 'ReviewModel'
storeSchema.virtual(/*Field to be created on the model*/ 'reviews', {
   ref: 'StoreReview', //name of the referenced model
   foreignField: 'store', //name of the field where the reference to the current model is stored
   localField: '_id'
});

//Document Middleware: runs before the .save() and .create() *------* does not work for .insertMany()*------*
storeSchema.pre('save', function (next) {
   this.slug = slugify(this.nomeLoja, { lower: true });
   next();
});

//QUERY MIDDLEWARE
storeSchema.pre(/^find/, function (next) {
   this.find({ lojaSecreta: { $ne: true } });
   this.start = Date.now();

   next();
});

/* ----- */
storeSchema.index({ storeOwner: 1 }); //Not allowing a store to have more than 1 owner
storeSchema.pre(/^find/, function (next) {
   //.pre 'find' query middleware to populate documents with referenced data
   this.populate({
      path: 'storeOwner', //This means that the 'storeOwner' property in our model is the field to be populated based on model
      select: 'nome'
   });

   next();
});
/* ----- */

/*storeSchema.pre(/^find/, function (next) {
   //query middleware to populate documents with referenced data
   this.populate({
      path: 'moderadores',
      select: '-__v -passwordChangedAt'
   });

   next();
});*/

// storeSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   next();
// });

//Aggregation Middleware
/*storeSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { lojaSecreta: { $ne: true } } });
  next();
});*/

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
