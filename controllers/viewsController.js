//My own modules
//const Servico = require('../models/servicoModel');
const Usuario = require('../models/usuarioModel');
const StoreOwner = require('../models/storeOwnerModel');
const Loja = require('../models/storeModel');
const Produto = require('../models/produtoModel');
const StoreReview = require('../models/storeReviewModel');
const ProductReview = require('../models/produtoReviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
//const Booking = require('../models/bookingModel');

const shuffle = function (arra1) {
   var ctr = arra1.length,
      temp,
      index;

   // While there are elements in the array
   while (ctr > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * ctr);
      // Decrease ctr by 1
      ctr--;
      // And swap the last element with it
      temp = arra1[ctr];
      arra1[ctr] = arra1[index];
      arra1[index] = temp;
   }
   return arra1;
};

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

exports.mostrarChat = catchAsync(async (req, res, next) => {
   res.status(200).render('chat', {});
});

exports.mostrarPrivateChat = catchAsync(async (req, res, next) => {
   res.status(200).render('privateChat', {});
});

exports.mostrarDonolojaChat = catchAsync(async (req, res, next) => {
   const lojas = await Loja.find({ storeOwner: { $in: res.locals.storeOwner.id } });

   const numLojas = lojas.length;

   res.status(200).render('donoLojaChat', {
      title: 'Chat',
      url: req.originalUrl,
      lojas,
      numLojas
   });
});

exports.mostrarLojas = catchAsync(async (req, res, next) => {
   const lojas = await Loja.find();
   shuffle(lojas);
   res.status(200).render('storeOverview', {
      title: 'Lojas',
      url: req.originalUrl,
      lojas
   });
});

exports.minhasLojas = catchAsync(async (req, res, next) => {
   const lojas = await Loja.find({ storeOwner: { $in: res.locals.storeOwner.id } });

   const numLojas = lojas.length;

   res.status(200).render('storeOwnerStores', {
      title: 'Minhas lojas',
      url: req.originalUrl,
      lojas,
      numLojas
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

exports.avaliarLoja = catchAsync(async (req, res, next) => {
   let loja = await Loja.find({ _id: req.params.lojaId });
   loja = loja[0];
   res.status(200).render('avaliarLoja', {
      title: 'Avaliar Loja',
      loja,
      url: req.originalUrl,
      previousURL: req.headers.referer
   });
});

exports.editarStoreReview = catchAsync(async (req, res, next) => {
   let loja = await Loja.find({ _id: req.params.lojaId });
   loja = loja[0];

   reviewId = req.originalUrl.split('/')[4];
   const review = await StoreReview.findById(reviewId);
   console.log(review);

   res.status(200).render('editarStoreReview', {
      title: 'Avaliar Loja',
      loja,
      url: req.originalUrl,
      previousURL: req.headers.referer,
      review
   });
});

exports.mostrarLojaReviews = catchAsync(async (req, res, next) => {
   let loja = await Loja.find({ _id: req.params.lojaId });
   loja = loja[0];

   const reviews = await StoreReview.find({ store: req.params.lojaId });

   if (res.locals.usuario) {
      const userReviewFind = reviews.filter(el => el.usuario._id.toString() === res.locals.usuario._id.toString());

      if (userReviewFind.length === 0) {
         return res.status(200).render('storeReviews', {
            title: 'Avaliações',
            url: req.originalUrl,
            loja,
            reviews
         });
      }

      const userReview = userReviewFind[0];

      const userReviewPosition = reviews.indexOf(userReview);

      reviews.splice(userReviewPosition, 1);
      reviews.unshift(userReview);

      return res.status(200).render('storeReviews', {
         title: 'Avaliações',
         url: req.originalUrl,
         loja,
         reviews,
         userReview
      });
   }

   res.status(200).render('storeReviews', {
      title: 'Avaliações',
      url: req.originalUrl,
      loja,
      reviews
   });
});

exports.mostrarProduto = catchAsync(async (req, res, next) => {
   let produto = await Produto.find({ _id: req.params.produtoId });
   produto = produto[0];

   res.status(200).render('productPage', {
      title: 'produtos',
      url: req.originalUrl,
      produto
   });
});

exports.mostrarProdutoReviews = catchAsync(async (req, res, next) => {
   let produto = await Produto.find({ _id: req.params.produtoId });
   produto = produto[0];

   const storeId = req.originalUrl.split('/')[2];
   console.log(storeId);

   const reviews = await ProductReview.find({ produto: req.params.produtoId });

   if (res.locals.usuario) {
      const userReviewFind = reviews.filter(el => el.usuario._id.toString() === res.locals.usuario._id.toString());

      if (userReviewFind.length === 0) {
         return res.status(200).render('productReviews', {
            title: 'Avaliações',
            url: req.originalUrl,
            storeId,
            produto,
            reviews
         });
      }

      const userReview = userReviewFind[0];

      const userReviewPosition = reviews.indexOf(userReview);

      reviews.splice(userReviewPosition, 1);
      reviews.unshift(userReview);

      return res.status(200).render('productReviews', {
         title: 'Avaliações',
         url: req.originalUrl,
         storeId,
         produto,
         reviews,
         userReview
      });
   }

   res.status(200).render('productReviews', {
      title: 'Avaliações',
      url: req.originalUrl,
      storeId,
      produto,
      reviews
   });
});

exports.editarProdutoReview = catchAsync(async (req, res, next) => {
   let produto = await Produto.find({ _id: req.params.produtoId });
   produto = produto[0];

   const storeId = req.originalUrl.split('/')[2];

   reviewId = req.originalUrl.split('/')[6];
   console.log(reviewId);
   const review = await ProductReview.findById(reviewId);
   console.log(review);

   res.status(200).render('editarProdutoReview', {
      title: 'Avaliar Produto',
      storeId,
      produto,
      url: req.originalUrl,
      previousURL: req.headers.referer,
      review
   });
});

exports.avaliarProduto = catchAsync(async (req, res, next) => {
   let produto = await Produto.find({ _id: req.params.produtoId });
   produto = produto[0];
   const storeId = req.originalUrl.split('/')[2];
   res.status(200).render('avaliarProduto', {
      title: 'Avaliar Produto',
      storeId,
      produto,
      url: req.originalUrl,
      previousURL: req.headers.referer
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
      url: req.originalUrl,
      previousURL: req.headers.referer
   });
};

exports.editarLoja = catchAsync(async (req, res) => {
   const storeId = req.headers.referer.split('/')[4];

   const loja = await Loja.findById(storeId);

   res.status(200).render('storeOwnerUpdatestore', {
      title: 'Crie a sua loja',
      url: req.originalUrl,
      storeId: req.headers.referer.split('/')[4],
      loja
   });
});

exports.criarProduto = catchAsync(async (req, res) => {
   const storeId = req.headers.referer.split('/')[4];

   const loja = await Loja.findById(storeId);

   res.status(200).render('newProduct', {
      title: 'Crie a sua loja',
      url: req.originalUrl,
      storeId: req.headers.referer.split('/')[4],
      loja
   });
});

exports.editarProduto = catchAsync(async (req, res) => {
   //const storeId = req.headers.referer.split('/')[4];
   const produtoId = req.headers.referer.split('/')[6];

   const produto = await Produto.findById(produtoId);
   res.status(200).render('storeOwnerUpdateproduct', {
      title: 'Crie a sua loja',
      url: req.originalUrl,
      storeId: req.headers.referer.split('/')[4],
      produtoId: req.headers.referer.split('/')[6],
      produto
   });
});

// Should do this on the backend
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
