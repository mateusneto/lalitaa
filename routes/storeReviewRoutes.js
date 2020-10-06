//Third-party modules
const express = require('express');
//My own modules
const reviewController = require('../controllers/storeReviewController');
const authController = require('../controllers/authController');
//const storeOwnerAuthController = require('../controllers/storeOwnerAuthController');

const router = express.Router({ mergeParams: true }); // Using mergeParams to get access to id available on previous router

/* ------------------------------------ */
router.use(authController.protect); //Protecting all routes after this middleware
//router.use(storeOwnerAuthController.storeOwnerProtect);

router
   .route('/')
   .get(reviewController.getAllReviews)
   .post(
      authController.restrictTo('usuario', 'administrador'),
      reviewController.setStoreAndUsuarioIds,
      reviewController.checkUser,
      reviewController.createReview
   );

router
   .route('/:id')
   .get(reviewController.getReview)
   .patch(
      authController.restrictTo('usuario', 'administrador'),
      authController.isLoggedIn,
      reviewController.checkReviewOwner,
      reviewController.updateReview
   )
   .delete(
      authController.restrictTo('usuario', 'administrador'),
      authController.isLoggedIn,
      reviewController.checkReviewOwner,
      reviewController.deleteReview
   );

//exporting router for reviews
module.exports = router;
