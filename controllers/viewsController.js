//My own modules
//const Servico = require('../models/servicoModel');
const Usuario = require('../models/usuarioModel');
const StoreOwner = require('../models/storeOwnerModel');
const Loja = require('../models/storeModel');
const Produto = require('../models/produtoModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
//const Booking = require('../models/bookingModel');

exports.alerts = (req, res, next) => {
   const { alert } = req.query;

   if (alert === 'booking')
      res.locals.alert =
         'Your booking was succesfull, please check your e-mail for a confirmation. If your booking does not show up here please come back later';
   next();
};

/*exports.mostrarOverview = catchAsync(async (req, res, next) => {
  //1. Get servico data from collection
  const servicos = await Servico.find();

  //2. Build template

  //3. Render template

  res.status(200).render('overview', {
    title: 'Todos Serviços',
    servicos,
  });
});*/

/*exports.mostrarServico = catchAsync(async (req, res, next) => {
  const servico = await Servico.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating usuario',
  });

  if (!servico) {
    return next(new AppError('Nao existem serviços com este nome', 404));
  }

  res.status(200).render('servico', {
    title: servico.nome,
    servico,
  });
});*/

exports.criarConta = catchAsync(async (req, res, next) => {
   res.status(200).render('userSignup', {
      title: 'Cria a tua conta',
      url: req.originalUrl
   });
});

exports.storeOwnerCriarConta = catchAsync(async (req, res, next) => {
   res.status(200).render('storeOwnerSignup', {
      title: 'Crie a sua conta',
      url: req.originalUrl
   });
});

exports.donoLojaCriarConta = catchAsync(async (req, res, next) => {
   res.status(200).render('storeOwnerSignup', {
      title: 'Cria a tua conta',
      url: req.originalUrl
   });
});

exports.mostrarContaUsuario = catchAsync(async (req, res, next) => {
   res.status(200).render('userAccount', {
      title: 'Conta',
      url: req.originalUrl
   });
});

exports.mostrarContaDonoloja = catchAsync(async (req, res, next) => {
   res.status(200).render('storeOwnerAccount', {
      title: 'Conta',
      url: req.originalUrl
   });
});

/*exports.mostrarMeusServicos = catchAsync(async (req, res, next) => {
  //Find all bookings
  const bookings = await Booking.find({ usuario: req.usuario.id });

  //Find servicos with returned ID's
  const servicoIDs = bookings.map((el) => el.servico);
  const servicos = await Servico.find({ _id: { $in: servicoIDs } }); //select all servicos which have an '_id' which is '$in' 'servicoIDs' array

  res.status(200).render('overview', {
    title: 'Meus serviços',
    servicos,
  });
});*/

exports.mostrarLojas = catchAsync(async (req, res, next) => {
   const lojas = await Loja.find();
   res.status(200).render('storeOverview', {
      title: 'Lojas',
      url: req.originalUrl,
      lojas
   });
});

exports.mostrarProdutos = catchAsync(async (req, res, next) => {
   let loja = await Loja.find({ _id: req.params.lojaId });
   loja = loja[0];
   const produtos = await Produto.find({ store: { $in: req.params.lojaId } });

   res.status(200).render('storeProducts', {
      title: 'produtos',
      url: req.originalUrl,
      loja,
      produtos
   });
});

exports.getLoginForm = (req, res) => {
   res.status(200).render('userLogin', {
      title: 'Entre na sua conta',
      url: req.originalUrl
   });
};

exports.getStoreOwnerLoginForm = (req, res) => {
   res.status(200).render('storeOwnerLogin', {
      title: 'Entre na sua conta',
      url: req.originalUrl
   });
};

exports.getSignupForm = (req, res) => {
   res.status(200).render('userSignup', {
      title: 'Crie a sua conta',
      url: req.originalUrl
   });
};

exports.getStoreOwnerSignupForm = (req, res) => {
   res.status(200).render('storeOwnerSignup', {
      title: 'Crie a sua conta',
      url: req.originalUrl
   });
};

exports.criarLoja = (req, res) => {
   res.status(200).render('newStore', {
      title: 'Crie a sua loja',
      url: req.originalUrl
   });
};

exports.criarProduto = (req, res) => {
   res.status(200).render('newProduct', {
      title: 'Crie a sua loja',
      url: req.originalUrl
   });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
   const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      {
         nome: req.body.nome,
         nomeUsuario: req.body.nomeUsuario,
         email: req.body.email
      },
      {
         new: true,
         runValidators: true
      }
   );

   res.status(200).render('userAccount', {
      title: 'Conta',
      usuario: usuarioActualizado
   });
});

exports.updateStoreOwnerData = catchAsync(async (req, res, next) => {
   const storeOwnerActualizado = await StoreOwner.findByIdAndUpdate(
      req.storeOwner.id,
      {
         nome: req.body.nome,
         nomeUsuario: req.body.nomeUsuario,
         email: req.body.email
      },
      {
         new: true,
         runValidators: true
      }
   );

   res.status(200).render('storeOwnerAccount', {
      title: 'Conta',
      usuario: storeOwnerActualizado
   });
});
