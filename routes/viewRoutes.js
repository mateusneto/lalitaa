//My own modules
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
//const bookingController = require('../controllers/bookingController');

//Third-party modules
const express = require('express');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.mostrarConta);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
//router.get('/servico/:slug', authController.isLoggedIn, viewsController.mostrarServico);

router.get('/me', authController.protect, viewsController.mostrarConta);
//router.get('/meus-servicos', authController.protect, viewsController.mostrarMeusServicos);

router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

module.exports = router;
