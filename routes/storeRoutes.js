//My own modules
const storeController = require('./../controllers/storeController');
const authController = require('./../controllers/storeOwnerAuthController');
//const reviewRouter = require('./reviewsRoutes');
//const reviewController = require('./../controllers/reviewController');

//Third-Party modules
const express = require('express');

//routes for 'servicos'
const router = express.Router();

//router.param('id', storeController.checkID);

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
//router.use('/:storeId/reviews', reviewRouter); //Route for stores with 'id/reviews'

//router.route('/top-3-cheap').get(storeController.aliasTopServicos, storeController.mostrarServicos);

//router.route('/servico-stats').get(storeController.mostrarServicoStats);
/*router.route('/plano-mensal/:ano')
   .get(
      authController.protect,
      authController.restrictTo('moderador', 'administrador'),
      storeController.mostrarPlanoMensal
   );
*/
//Geo Routes
/*router.route('/servicos-within/:distance/center/:latlng/unit/:unit').get(storeController.getServicosWithin);

router.route('/distances/:latlng/unit/:unit').get(storeController.getDistances);
*/

/*------------------------------------------------------*/

router
   .route('/')
   .get(storeController.mostrarStores)
   .post(
      authController.storeOwnerProtect,
      authController.restrictTo('administrador', 'donoLoja'),
      storeController.setStoreOwnerId,
      storeController.criarStore
   );

router
   .route('/:id')
   .get(storeController.mostrarStore)
   .patch(
      authController.storeOwnerProtect,
      authController.restrictTo('moderador', 'administrador', 'donoLoja'),
      storeController.uploadStoreImages,
      storeController.resizeStoreImages,
      storeController.verifyOwner,
      storeController.actualizarStore
   )
   .delete(
      authController.storeOwnerProtect,
      authController.restrictTo('moderador', 'administrador', 'donoLoja'),
      storeController.verifyOwner,
      storeController.removerStore
   );

//exporting router for stores
module.exports = router;
