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

/* --------------------------------------Routes for Store----------------------------------------- */
router.get('/lojas', viewsController.mostrarLojas);

/* --------------------------------------Routes for Produto----------------------------------------- */
router.get('/loja/:lojaId/produtos', viewsController.mostrarProdutos);
/* --------------------------------------Routes for specific Produto----------------------------------------- */
router.get('/loja/:lojaId/produto/:produtoId', viewsController.mostrarProduto);

/* --------------------------------------Routes for Usuarios----------------------------------------- */
router.get('/entrar', /*authController.isLoggedIn,*/ viewsController.getLoginForm);
router.get('/sair', /*authController.isLoggedIn,*/ viewsController.getLoginForm);
router.get('/criarconta', /*authController.isLoggedIn,*/ viewsController.getSignupForm);

router.get('/me', authController.protect, viewsController.mostrarContaUsuario);
router.get('/criarconta', viewsController.criarConta);
router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

/* --------------------------------------Routes for Store Owners----------------------------------------- */
router.get('/donolojaentrar', viewsController.getStoreOwnerLoginForm);
router.get('/donolojasair', /*authController.isLoggedIn,*/ viewsController.getStoreOwnerLoginForm);
router.get('/donolojacriarconta', viewsController.getStoreOwnerSignupForm);

router.get('/donoloja/me', storeOwnerAuthController.storeOwnerProtect, viewsController.mostrarContaDonoloja);
router.get('/donolojacriarconta', /*authController.protect,*/ viewsController.donoLojaCriarConta);
router.post(
   '/submit-storeowner-data',
   storeOwnerAuthController.storeOwnerProtect,
   viewsController.updateStoreOwnerData
);

router.get('/criarloja', /*authController.isLoggedIn,*/ viewsController.criarLoja);
router.get('/editarloja', viewsController.editarLoja);
router.get('/criarproduto', /*authController.isLoggedIn,*/ viewsController.criarProduto);
router.get('/loja/:id/produto/:produtoId/editarproduto', viewsController.editarProduto);

router.get('/minhaslojas', viewsController.minhasLojas);

//router.get('/usuario', /*authController.protect,*/ viewsController.mostrarContaUsuario);

//router.get('/', authController.isLoggedIn, viewsController.mostrarConta); //trocar

//router.get('/servico/:slug', authController.isLoggedIn, viewsController.mostrarServico);

//router.get('/meus-servicos', authController.protect, viewsController.mostrarMeusServicos);

module.exports = router;
