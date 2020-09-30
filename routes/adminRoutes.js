//My own modules
const usuarioController = require('../controllers/usuarioController');
const storeOwnerController = require('../controllers/storeOwnerController');
const storeController = require('./../controllers/storeController');
const produtoController = require('../controllers/produtoController');
const authController = require('./../controllers/authController');
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
      storeController.uploadStoreImages,
      storeController.resizeStoreImages,
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
