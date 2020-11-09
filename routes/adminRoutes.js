//My own modules
const usuarioController = require('../controllers/usuarioController');
const storeOwnerController = require('../controllers/storeOwnerController');
const storeController = require('./../controllers/storeController');
const produtoController = require('../controllers/produtoController');
const authController = require('./../controllers/authController');
const mensagensController = require('../controllers/mensagensController');
//const reviewRouter = require('./reviewsRoutes');
//const reviewController = require('./../controllers/reviewController');

//Third-Party modules
const express = require('express');

//routes for 'servicos'
const router = express.Router();
router.use(authController.protect, authController.restrictTo('administrador'));

/*----------------------------Usuarios------------------------*/
router.route('/usuarios').get(usuarioController.mostrarUsuarios).post(usuarioController.criarUsuario);

router
   .route('/usuarios/:id')
   .get(usuarioController.mostrarUsuario)
   .patch(usuarioController.actualizarUsuario)
   .delete(usuarioController.removerUsuario);
/*-------------------------Store Owners------------------------*/
router.route('/donosdeloja').get(storeOwnerController.mostrarOwners).post(storeOwnerController.criarOwner);

router
   .route('/donosdeloja/:id')
   .get(storeOwnerController.mostrarOwner)
   .patch(storeOwnerController.actualizarOwner)
   .delete(storeOwnerController.removerOwner);
/*--------------------------STORES-----------------------------*/

router.route('/lojas').get(storeController.mostrarStores).post(storeController.criarStore);

router
   .route('/lojas/:id')
   .get(storeController.mostrarStore)
   .patch(
      authController.restrictTo('administrador'),
      storeController.uploadStoreImage,
      storeController.resizeStoreImage,
      storeController.actualizarStore
   )
   .delete(storeController.removerStore);

/*--------------------------PRODUTOS----------------------------*/

router.route('/produtos').get(produtoController.mostrarProdutos).post(produtoController.criarProduto);

router
   .route('/produtos/:id')
   .get(produtoController.mostrarProduto)
   .patch(
      produtoController.uploadProdutoImages,
      produtoController.resizeProdutoImages,
      produtoController.actualizarProduto
   )
   .delete(produtoController.removerProduto);

/*

/*************************************************** MENSAGENS *********************************************/

/* ---------------- Routes for usuario-usuario mensagens -------------------- */
router.get('/mensagens/usuario_usuario/:usuario1Id/:usuario2Id', mensagensController.mostrarMensagensUsuario_Usuario);
router.post('/mensagens/usuario_usuario', mensagensController.criarMensagensUsuario_Usuario);
router.delete('/mensagens/usuario_usuario/:mensagemId', mensagensController.removerMensagensUsuario_Usuario);

/* ---------------- Routes for usuario-store mensagens -------------------- */
router.get('/mensagens/usuario_store/:usuarioId/:storeId', mensagensController.mostrarMensagensUsuario_Store);
router.post('/mensagens/usuario_store', mensagensController.criarMensagensUsuario_Store);
router.delete('/mensagens/usuario_store/:mensagemId', mensagensController.removerMensagensUsuario_Store);

/* ---------------- Routes for store-store mensagens -------------------- */
router.get('/mensagens/store_store/:store1Id/:store2Id', mensagensController.mostrarMensagensStore_Store);
router.post('/mensagens/store_store', mensagensController.criarMensagensStore_Store);
router.delete('/mensagens/store_store/:mensagemId', mensagensController.removerMensagensStore_Store);

/*************************************************** ------------ *********************************************/

/*
router.route('/:id/produtos').get(storeController.mostrarProdutos).post(
   authController.storeOwnerProtect,
   //res.locals.storeOwner = owner
   storeController.verifyOwner,
   storeController.setStoreOwnerId,
   //req.body.storeOwner
   authController.restrictTo('moderador', 'administrador', 'donoLoja'), //Added after
   storeController.setStoreId,
   storeController.criarProduto
);

router
   .route('/:id/produtos/:produtoId')
   .get(storeController.mostrarProduto)
   .patch(
      authController.storeOwnerProtect,
      //res.locals.storeOwner = owner
      storeController.verifyOwner,
      storeController.setStoreOwnerId,
      //req.body.storeOwner
      storeController.setStoreId,
      storeController.verifyStore,
      storeController.verifyStoreProduct,
      storeController.actualizarProduto
   )
   .delete(
      authController.storeOwnerProtect,
      //res.locals.storeOwner = owner
      storeController.verifyOwner,
      storeController.setStoreOwnerId,
      //req.body.storeOwner
      storeController.setStoreId,
      storeController.verifyStore,
      storeController.verifyStoreProduct,
      storeController.removerProduto
   );

   */

//exporting router for stores
module.exports = router;
