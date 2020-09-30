//My own modules
const Produto = require('./../models/produtoModel');
const Store = require('../models/storeModel');
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

exports.uploadProdutoImages = upload.fields([
   { name: 'imagemDeCapa', maxCount: 1 },
   { name: 'imagens', maxCount: 5 }
]);

// upload.single('imagem') => req.file
// upload.array('imagens',5) => req.files

exports.resizeProdutoImages = catchAsync(async (req, res, next) => {
   //if (!req.files.imagemDeCapa || !req.files.imagens) return next(); -->> for production
   if (!req.body.imagemDeCapa || !req.body.imagens) return next(); //for development

   //Process imagem de capa

   req.body.imagemDeCapa = `produto-${req.params.id}-${Date.now()}-cover.jpeg`;

   await sharp(req.files.imagemDeCapa[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/imagens/produtos/${req.body.imagemDeCapa}`);

   //process imagens
   req.body.imagens = [];

   await Promise.all(
      req.files.imagens.map(async (file, i) => {
         const filename = `produto-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

         await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/imagens/produtos/${filename}`);

         req.body.imagens.push(filename);
      })
   );

   next();
});

/* ------------------------------------- */

exports.setStoreOwnerId = (req, res, next) => {
   //Allow nested routes
   if (!req.body.storeOwner) req.body.storeOwnerId = res.locals.storeOwner._id;
   next();
};

exports.verifyProductStore = catchAsync(async (req, res, next) => {
   const loja = await Store.findById(req.params.id);

   if (!loja) {
      return next(new AppError('Nenhum documento encontrado com este ID', 404));
   }

   if (!req.body.store) req.body.store = loja;
   next();
});

/* ----------------------Controllers for servicos------------------------- */
exports.mostrarProdutos = factory.getAll(Produto);
exports.mostrarProduto = factory.getOne(Produto, { path: 'reviews' });
exports.criarProduto = factory.createOne(Produto);
exports.actualizarProduto = factory.updateOne(Produto);
exports.removerProduto = factory.deleteOne(Produto);
/* ------------------------------------------------------------------------*/
exports.nothing = (req, res, next) => {
   res.status(500).json({
      status: 'error',
      message: 'This route is not Implemented, please use SignUp'
   });
};

/* -----------------------------IMPLEMENTAR------------------------------- */
/*
exports.aliasTopServicos = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = 'preco,-mediaDeAvaliacoes,';
  req.query.fields = 'nome,preco,mediaDeAvaliacoes,resumo,tipo ';
  next();
};

exports.mostrarServicoStats = catchAsync(async (req, res, next) => {
  const stats = await Servico.aggregate([
    {
      $match: { mediaDeAvaliacoes: { $gte: 4.5 } },
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
        maxPreco: { $max: '$preco' },
      },
    },
    {
      $sort: {
        mediaPreco: -1,
      },
    },
    // {
    //   //$match: { _id: { $ne: `Q'art` } },
    //   },
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      stats,
    },
  });
});

exports.mostrarPlanoMensal = catchAsync(async (req, res, next) => {
  const ano = req.params.ano * 1;

  const plano = await Servico.aggregate([
    {
      $unwind: '$datasIniciais',
    },
    {
      $match: {
        datasIniciais: {
          $gte: new Date(`${ano}-01-01`),
          $lte: new Date(`${ano}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$datasIniciais' },
        numServicosMes: { $sum: 1 },
        servicos: { $push: '$nome' },
      },
    },
    {
      $addFields: { mes: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numServicosMes: -1 },
    },
    // {
    //     $limit: 2,
    //   },
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      plano,
    },
  });
});

exports.getServicosWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  const [lat, lng] = latlng.split(',');

  const radius = unit === 'km' ? distance / 6378.1 : distance / 3963.2;

  if (!lat || !lng) {
    next(new AppError('Please specify the latitude and longitude', 400));
  }

  const servicos = await Servico.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'Success',
    results: servicos.length,
    data: {
      data: servicos,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'km' ? 0.001 : 0.000621371;

  if (!lat || !lng) {
    next(new AppError('please specify latitude and longitude', 400));
  }

  const distances = await Servico.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },

    {
      $project: {
        distance: 1,
        nome: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      data: distances,
    },
  });
});
*/
