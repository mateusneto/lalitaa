//My own modules
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const storeController = require('../controllers/storeController');
const produtoController = require('../controllers/produtoController');
//const bookingController = require('../controllers/bookingController');

//Third-party modules
const express = require('express');

const router = express.Router();

router.use(viewsController.alerts);
router.use(authController.isLoggedIn);
router.get('/', (req, res) => {
   res.status(200).render('base');
});

/* --------------------------------------Routes for Usuarios----------------------------------------- */
router.get('/entrar', /*authController.isLoggedIn,*/ viewsController.getLoginForm);
router.get('/sair', /*authController.isLoggedIn,*/ viewsController.getLoginForm);
router.get('/criarconta', /*authController.isLoggedIn,*/ viewsController.getSignupForm);

router.get('/me', authController.protect, viewsController.mostrarContaUsuario);
router.get('/criarconta', viewsController.criarConta);
router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

/* --------------------------------------Routes for Store Owners----------------------------------------- */
router.get('/criarloja', /*authController.isLoggedIn,*/ viewsController.criarLoja);
router.get('/criarproduto', /*authController.isLoggedIn,*/ viewsController.criarProduto);
router.get('/donoloja', /*authController.protect,*/ viewsController.mostrarContaDonoloja);
router.get('/usuario', /*authController.protect,*/ viewsController.mostrarContaUsuario);

/* --------------------------------------Routes for Store----------------------------------------- */
router.get('/lojas', viewsController.mostrarLojas);

/* --------------------------------------Routes for Produto----------------------------------------- */
router.get('/loja/:lojaId/produtos', viewsController.mostrarProdutos);

//router.get('/', authController.isLoggedIn, viewsController.mostrarConta); //trocar

//router.get('/servico/:slug', authController.isLoggedIn, viewsController.mostrarServico);

//router.get('/meus-servicos', authController.protect, viewsController.mostrarMeusServicos);

module.exports = router;
