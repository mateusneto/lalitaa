//My own modules
const storeController = require('./../controllers/storeController');
const produtoController = require('./../controllers/produtoController');
const authController = require('./../controllers/authController');
//const reviewRouter = require('./reviewsRoutes');
//const reviewController = require('./../controllers/reviewController');

//Third-Party modules
const express = require('express');

//routes for 'servicos'
const router = express.Router();

//router.param('id', servicoController.checkID);

/*
router
  .route('/:servicoId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('usuario'),
    reviewController.createReview
  );
*/

//Using a nested route on reviewRouter
//router.use('/:servicoId/reviews', reviewRouter); //Route for servicos with 'id/reviews'

/* ------------------------IMPLEMENTAR------------------------ */
/*router.route('/top-3-cheap').get(servicoController.aliasTopServicos, servicoController.mostrarServicos);

router.route('/servico-stats').get(servicoController.mostrarServicoStats);
router
   .route('/plano-mensal/:ano')
   .get(
      authController.protect,
      authController.restrictTo('moderador', 'administrador'),
      servicoController.mostrarPlanoMensal
   );

//Geo Routes
router.route('/servicos-within/:distance/center/:latlng/unit/:unit').get(servicoController.getServicosWithin);

router.route('/distances/:latlng/unit/:unit').get(servicoController.getDistances);
*/
/*------------------------------------------------------*/

router.route('/').get(produtoController.mostrarProdutos);

router
   .route('/:id')
   .post(
      authController.protect,
      authController.restrictTo('administrador'),
      produtoController.verifyProductStore,
      produtoController.criarProduto
   );

router
   .route('/:id')
   .get(produtoController.mostrarProduto)
   .patch(
      authController.protect,
      authController.restrictTo('moderador', 'administrador'),
      produtoController.uploadProdutoImages,
      produtoController.resizeProdutoImages,
      produtoController.actualizarProduto
   )
   .delete(
      authController.protect,
      authController.restrictTo('moderador', 'administrador'),
      produtoController.removerProduto
   );

//exporting router for produtos
module.exports = router;
