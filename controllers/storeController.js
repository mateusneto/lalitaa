//My own modules
const Store = require('./../models/storeModel');
const Produto = require('../models/produtoModel');
const StoreReview = require('../models/storeReviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./storeOwnerHandlerFactory');

//Third-party modules
const multer = require('multer');
const sharp = require('sharp');

/* ------------------------------------- */
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
   if (file.mimetype.startsWith('image')) {
      cb(null, true);
   } else {
      cb(new AppError('Please upload an image', 400), false);
   }
};

const upload = multer({
   storage: multerStorage,
   fileFilter: multerFilter
});

exports.checkStoreNumber = catchAsync(async (req, res, next) => {
   const lojas = await Store.find({ storeOwner: res.locals.storeOwner.id || req.body.storeOwner.id });

   if (lojas.length >= 3) {
      return next(new AppError('Atingiu o limite de 3 Lojas', 401));
   }

   next();
});

exports.uploadStoreImage = upload.single('imagemDeCapa');
exports.uploadProductImage = upload.single('imagemDeCapa');

// upload.single('imagem') => req.file
// upload.array('imagens',5) => req.files

exports.resizeStoreImage = catchAsync(async (req, res, next) => {
   if (!req.file) return next(); //-->> for production
   //if (!req.body.imagemDeCapa) return next(); //for development

   //Process imagem de capa
   //req.body.imagemDeCapa = `store-${req.params.id}-cover.jpeg`;
   req.file.filename = `store-${req.loja.id}.jpeg`;

   await sharp(req.file.buffer)
      .resize(1024, 1024)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/imagens/dev/lojas/${req.file.filename}`);
   next();
});

exports.resizeProductImage = catchAsync(async (req, res, next) => {
   console.log('procurando produto foto');
   console.log(req.file);
   if (!req.file) return next(); //-->> for production
   //if (!req.body.imagemDeCapa) return next(); //for development

   //Process imagem de capa
   //req.body.imagemDeCapa = `store-${req.params.id}-cover.jpeg`;
   req.file.filename = `produto-${req.params.produtoId}-loja${req.params.id}.jpeg`;
   console.log('actualizando produto foto');

   await sharp(req.file.buffer)
      .resize(800, 1066)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/imagens/dev/produtos/${req.file.filename}`);
   next();
});

/* ----------------------------------------------------------------------- */

exports.setStoreOwnerId = (req, res, next) => {
   //Allow nested routes
   if (!req.body.storeOwner) req.body.storeOwner = res.locals.storeOwner;
   next();
};

exports.setStoreId = factory.setStoreId(Store);

exports.nothing = (req, res, next) => {
   res.status(500).json({
      status: 'error',
      message: 'This route is not Implemented, please use SignUp'
   });
};

/* ----------------------Controllers for Store------------------------- */
exports.mostrarStores = factory.getAll(Store);
exports.mostrarStore = factory.getOne(Store, { path: 'storeProducts' });
exports.criarStore = factory.createOne(Store);
exports.verifyOwner = factory.verifyOwner(Store);
exports.verifyStore = factory.verifyStore(Store);
exports.actualizarStore = factory.updateStore(Store);
exports.removerStore = factory.deleteOne(Store);

/* ----------------------Controllers for Store Products------------------------- */
exports.criarProduto = factory.createOne(Produto);
exports.mostrarProdutos = factory.getAllProducts(Produto);
exports.mostrarProduto = factory.getOneProduct(Produto);
exports.actualizarProduto = factory.updateOneProduct(Produto);
exports.removerProduto = factory.deleteProduct(Produto);

/* ----------------------Controllers for Store Avaliações------------------------- */
exports.mostrarLojaAvaliacoes = factory.getAllProducts(StoreReview);

/* ------------------------------------------------------------------------*/
exports.verifyStoreProduct = factory.verifyStoreProduct(Produto);

exports.verificarProduto = (req, res, next) => {
   //console.log(res.locals);
   //console.log(req.params);

   //if (req.body.storeOwner)
   // console.log(req.body);

   // console.log('-----Produto-----');
   // console.log(produto);
   // console.log('-----req.params');
   // console.log(req.params);
   // console.log('-----res.Locals.store---');
   // console.log(res.locals.store);
   // console.log('-----req.body---');
   // console.log(res.locals.store);

   if (produto.store.id !== req.params.id) {
      //console.log(produto.store.id);
      //console.log(res.locals.store.id);

      return next(new AppError('Este produto nao pertence a sua loja', 404));
   }

   if (produto.store.id !== res.locals.store.id) {
      //console.log(produto.store.id);
      //console.log(res.locals.store.id);

      return next(new AppError('Este produto nao pertence a sua loja', 404));
   }

   next();
};

/*exports.aliasTopServicos = (req, res, next) => {
   req.query.limit = '3';
   req.query.sort = 'preco,-mediaDeAvaliacoes,';
   req.query.fields = 'nome,preco,mediaDeAvaliacoes,resumo,tipo ';
   next();
};*/

/*exports.mostrarServicoStats = catchAsync(async (req, res, next) => {
   const stats = await Store.aggregate([
      {
         $match: { mediaDeAvaliacoes: { $gte: 4.5 } }
      },
      {
         $group: {
            _id: '$tipo',
            numServicos: { $sum: 1 },
            numAvaliacoes: { $sum: '$quantidadeDeAvaliacoes' },
            mediaAvaliacoes: { $avg: '$mediaDeAvaliacoes' },
            mediaDesconto: { $avg: '$precoDesconto' },
            minDesconto: { $min: '$precoDesconto' },
            maxDesconto: { $max: '$precoDesconto' },
            mediaPreco: { $avg: '$preco' },
            minPreco: { $min: '$preco' },
            maxPreco: { $max: '$preco' }
         }
      },
      {
         $sort: {
            mediaPreco: -1
         }
      }
      // {
      // //$match: { _id: { $ne: `Q'art` } },
      // },
   ]);

   res.status(200).json({
      status: 'Success',
      data: {
         stats
      }
   });
});*/

/*exports.mostrarPlanoMensal = catchAsync(async (req, res, next) => {
   const ano = req.params.ano * 1;

   const plano = await Store.aggregate([
      {
         $unwind: '$datasIniciais'
      },
      {
         $match: {
            datasIniciais: {
               $gte: new Date(`${ano}-01-01`),
               $lte: new Date(`${ano}-12-31`)
            }
         }
      },
      {
         $group: {
            _id: { $month: '$datasIniciais' },
            numServicosMes: { $sum: 1 },
            servicos: { $push: '$nome' }
         }
      },
      {
         $addFields: { mes: '$_id' }
      },
      {
         $project: {
            _id: 0
         }
      },
      {
         $sort: { numServicosMes: -1 }
      }
      /
        $limit: 2,
      },
   ]);

   res.status(200).json({
      status: 'Success',
      data: {
         plano
      }
   });
});*/

/*exports.getServicosWithin = catchAsync(async (req, res, next) => {
   const { distance, latlng, unit } = req.params;

   const [lat, lng] = latlng.split(',');

   const radius = unit === 'km' ? distance / 6378.1 : distance / 3963.2;

   if (!lat || !lng) {
      next(new AppError('Please specify the latitude and longitude', 400));
   }

   const servicos = await Store.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
   });

   res.status(200).json({
      status: 'Success',
      results: servicos.length,
      data: {
         data: servicos
      }
   });
});*/

/*exports.getDistances = catchAsync(async (req, res, next) => {
   const { latlng, unit } = req.params;
   const [lat, lng] = latlng.split(',');

   const multiplier = unit === 'km' ? 0.001 : 0.000621371;

   if (!lat || !lng) {
      next(new AppError('please specify latitude and longitude', 400));
   }

   const distances = await Store.aggregate([
      {
         $geoNear: {
            near: {
               type: 'Point',
               coordinates: [lng * 1, lat * 1]
            },
            distanceField: 'distance',
            distanceMultiplier: multiplier
         }
      },

      {
         $project: {
            distance: 1,
            nome: 1
         }
      }
   ]);

   res.status(200).json({
      status: 'Success',
      data: {
         data: distances
      }
   });
});*/
