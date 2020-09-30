//Criar para:{type:String,enum:['Jovem adulta','Criança','Mulher adulta']}

const mongoose = require('mongoose');
const slugify = require('slugify');

//My OWN MODULES
//const Usuario = require('./usuarioModel'); //Not needed for Child referencing @"moderadores"
const Store = require('./storeModel');
const validator = require('validator');

const produtoSchema = new mongoose.Schema(
   {
      //Parent referencing
      store: {
         type: mongoose.Schema.ObjectId,
         ref: 'Store',
         required: [true, 'Produto deve pertencer a uma loja']
      },
      nome: {
         type: String,
         required: [true, 'Nome em falta'],
         maxlength: [35, 'O nome do produto tem de ter 40 digitos ou menos'],
         minlength: [1, 'O nome do produto tem de ter 1 ou mais digitos']
         //validate: [validator.isAlpha, 'Apenas letras no nome']
      },
      produtoReferencia: {
         type: String,
         trim: true,
         unique: true
      },
      tipo: {
         type: String,
         require: [true, 'Adicione um tipo'],
         lowercase: true,
         enum: ['calçado', 'calça', 'calca', 'saia', 'bijouteria', 'peruca', 'camisa', 'vestido', 'pasta', 'acessorio']
      },
      preco: {
         type: Number,
         required: [true, 'Adicione o preço']
      },
      precoDesconto: {
         type: Number,
         validate: {
            validator: function (val) {
               //Only points to current document when creating a new document
               return val < this.preco;
            },
            message: 'Valor ({VALUE}) do desconto deve ser menor que o preço'
         }
      },
      tamanho: {
         type: String,
         required: [true, 'Adicione um tamanho'],
         uppercase: true
      },
      estado: {
         type: String,
         enum: ['Disponivel', 'Esgotado'],
         default: 'Disponivel'
      },
      slug: String,
      cor: {
         type: String
      },
      marca: { type: String },
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
      genero: {
         type: String,
         default: 'Jovem'
         /*enum: {
            values: ['Bebê', 'Criança', 'Jovem', 'Jovem adulta', 'Adulta'],
            message: 'Por favor adicione um genero'
         }*/
      },
      textura: { type: String },
      tecido: { type: String },
      descricao: {
         type: String,
         trim: true
      },
      resumo: {
         type: String,
         trim: true
         //required: [true, 'Servico deve ter um resumo'],
      },
      imagemDeCapa: {
         type: String
         //required: [true, 'Imagem em falta'],
      },
      imagens: [String],
      criadoEm: {
         type: Date,
         default: Date.now(),
         select: false
      },
      produtoSecreto: {
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
//produtoSchema.index({ preco: 1 }); //single field index
produtoSchema.index({ preco: 1, mediaDeAvaliacoes: -1 }); //Compound index
//produtoSchema.index({ slug: 1 });
produtoSchema.index({ store: 1 }); //Not allowing a product to have more than 1 store

//Virtual populate: virtual populating 'servicoModel' with data from 'ReviewModel'
/*produtoSchema.virtual(Field to be created on the model 'reviews', {
   ref: 'Review', //name of the referenced model
   foreignField: 'produto', //name of the field where the reference to the current model is stored
   localField: '_id'
});*/

//Document Middleware: runs before the .save() and .create() *------* does not work for .insertMany()*------*
produtoSchema.pre('save', function (next) {
   this.slug = slugify(this.nome, { lower: true });
   next();
});

produtoSchema.pre('save', function (next) {
   this.produtoReferencia = slugify(`${this.nome}-${this.store.id}-${Date.now()}`, { lower: true });
   this.imagemDeCapa = `${this.produtoReferencia}.jpg`;
   next();
});

//QUERY MIDDLEWARE
produtoSchema.pre(/^find/, function (next) {
   this.find({ produtoSecreto: { $ne: true } });
   this.start = Date.now();

   next();
});

produtoSchema.pre(/^find/, function (next) {
   //query middleware to populate documents with referenced data
   this.populate({
      path: 'store',
      select: 'nomeLoja'
   });
   next();
});

// produtoSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   next();
// });

//Aggregation Middleware
/*produtoSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { servicoSecreto: { $ne: true } } });
  next();
});*/

const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;
