//Third-Party modules
const express = require('express');

//My own modules
const usuarioController = require('./../controllers/usuarioController');
const authController = require('./../controllers/authController');

//routes for usuarios
const router = express.Router();

/*router.param('id', usuarioController.checkID)*/

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logOut);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

/* ------------------------------------ */
router.use(authController.protect); //Protecting all routes after this middleware
router.patch('/updatePassword', authController.updatePassword);

router.get('/me', usuarioController.getMe, usuarioController.mostrarUsuario);

router.patch(
   '/updateMe',
   usuarioController.uploadUserPhoto,
   usuarioController.resizeUserPhoto,
   usuarioController.updateMe
);
router.delete('/deleteMe', usuarioController.deleteMe);

//exporting router for usuarios
module.exports = router;
