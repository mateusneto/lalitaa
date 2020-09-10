//Third-Party modules
const express = require('express');

//My own modules
const storeOwnerController = require('./../controllers/storeOwnerController');
const authController = require('./../controllers/storeOwnerAuthController');

//routes for store owners
const router = express.Router();

/*router.param('id', usuarioController.checkID)*/

router.post('/signup', authController.storeOwnerSignup);
router.post('/login', authController.storeOwnerLogin);
router.get('/logout', authController.storeOwnerLogOut);

router.post('/forgotPassword', authController.storeOwnerForgotPassword);
router.patch('/resetPassword/:token', authController.storeOwnerResetPassword);

/* ------------------------------------ */
router.use(authController.storeOwnerProtect); //Protecting all routes after this middleware
router.patch('/updatePassword', authController.storeOwnerUpdatePassword);

router.get('/me', storeOwnerController.getMe, storeOwnerController.mostrarOwner);

router.patch(
   '/updateMe',
   storeOwnerController.uploadUserPhoto,
   storeOwnerController.resizeUserPhoto,
   storeOwnerController.updateMe
);
router.delete('/deleteMe', storeOwnerController.deleteMe);

router.use(authController.restrictTo('administrador'));

router.route('/').get(storeOwnerController.mostrarOwners).post(storeOwnerController.criarOwner);

router
   .route('/:id')
   .get(storeOwnerController.mostrarOwner)
   .patch(storeOwnerController.actualizarOwner)
   .delete(storeOwnerController.removerOwner);

//exporting router for store owners
module.exports = router;
