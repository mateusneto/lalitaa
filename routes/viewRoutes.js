//My own modules
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const storeOwnerAuthController = require('../controllers/storeOwnerAuthController');
const storeController = require('../controllers/storeController');
const produtoController = require('../controllers/produtoController');
//const bookingController = require('../controllers/bookingController');

//Third-party modules
const express = require('express');

const router = express.Router({ mergeParams: true });

router.use(viewsController.alerts);
router.use(authController.isLoggedIn);
router.use(storeOwnerAuthController.storeOwnerIsLoggedIn);
router.get('/', (req, res) => {
   res.status(200).render('base');
});

/* --------------------------------------Routes for User Chat----------------------------------------- */
router.get('/chat', authController.protect, viewsController.mostrarChat);
router.get('/chat/private/:nomeUsuario/:nomeLoja', authController.protect, viewsController.mostrarPrivateChat);

/* --------------------------------------Routes for StoreOwner Chat----------------------------------------- */
router.get('/donoloja/chat', storeOwnerAuthController.storeOwnerProtect, viewsController.mostrarDonolojaChat);
router.get('/donoloja/chat/:lojaId', storeOwnerAuthController.storeOwnerProtect, viewsController.mostrarLojaChat);
router.get(
   '/donoloja/chat/private/:nomeUsuario/:nomeLoja',
   storeOwnerAuthController.storeOwnerProtect,
   viewsController.mostrarLojaPrivateChat
);

/* --------------------------------------Routes for Stores----------------------------------------- */
router.get('/lojas', viewsController.mostrarLojas);

/* --------------------------------------Routes for Produto----------------------------------------- */
router.get('/loja/:lojaId/produtos', viewsController.mostrarProdutos);
router.get('/loja/:lojaId/avaliacoes', viewsController.mostrarLojaReviews);
router.get('/loja/:lojaId/avaliar', viewsController.avaliarLoja);
router.get('/loja/:lojaId/editarStoreReview/:reviewId', viewsController.editarStoreReview);

/* --------------------------------------Routes for specific Produto----------------------------------------- */
router.get('/loja/:lojaId/produto/:produtoId', viewsController.mostrarProduto);
router.get('/loja/:lojaId/produto/:produtoId/avaliacoes', viewsController.mostrarProdutoReviews);
router.get('/loja/:lojaId/produto/:produtoId/avaliar', viewsController.avaliarProduto); //should user authController.protect
router.get('/loja/:lojaId/produto/:produtoId/editarProdutoReview/:reviewId', viewsController.editarProdutoReview);

/* --------------------------------------Routes for Usuarios----------------------------------------- */
router.get('/entrar', /*authController.isLoggedIn,*/ viewsController.getLoginForm);
router.get('/sair', /*authController.isLoggedIn,*/ viewsController.getLoginForm);
router.get('/criarconta', /*authController.isLoggedIn,*/ viewsController.getSignupForm);

router.get('/me', authController.protect, viewsController.mostrarContaUsuario);
router.get('/criarconta', viewsController.criarConta);
// router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

/* --------------------------------------Routes for Store Owners----------------------------------------- */
router.get('/donolojaentrar', viewsController.getStoreOwnerLoginForm);
//router.get('/donolojasair', /*authController.isLoggedIn,*/ viewsController.getStoreOwnerLoginForm);
router.get('/donolojacriarconta', viewsController.getStoreOwnerSignupForm);

router.get('/donoloja/me', storeOwnerAuthController.storeOwnerProtect, viewsController.mostrarContaDonoloja);
router.get('/donolojacriarconta', /*authController.protect,*/ viewsController.donoLojaCriarConta);
// router.post(
//    '/submit-storeowner-data',
//    storeOwnerAuthController.storeOwnerProtect,
//    viewsController.updateStoreOwnerData
// );

router.get(
   '/criarloja',
   storeOwnerAuthController.storeOwnerProtect,
   /*authController.isLoggedIn,*/ viewsController.criarLoja
);
router.get('/editarloja/:lojaId', storeOwnerAuthController.storeOwnerProtect, viewsController.editarLoja);
router.get(
   '/criarproduto',
   storeOwnerAuthController.storeOwnerProtect,
   /*authController.isLoggedIn,*/ viewsController.criarProduto
);
router.get('/loja/:id/produto/:produtoId/editarproduto', viewsController.editarProduto);

router.get('/minhaslojas', viewsController.minhasLojas);

//router.get('/usuario', /*authController.protect,*/ viewsController.mostrarContaUsuario);

//router.get('/', authController.isLoggedIn, viewsController.mostrarConta); //trocar

//router.get('/servico/:slug', authController.isLoggedIn, viewsController.mostrarServico);

//router.get('/meus-servicos', authController.protect, viewsController.mostrarMeusServicos);

module.exports = router;
