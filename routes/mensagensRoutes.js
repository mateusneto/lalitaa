//Third-Party modules
const express = require('express');

//My own modules
const mensagensController = require('./../controllers/mensagensController');
const authController = require('./../controllers/authController');
const storeOwnerAuthController = require('../controllers/storeOwnerAuthController');

//routes for usuarios
const router = express.Router();

/* ---------------- Routes for usuario-usuario mensagens -------------------- */

router.get(
   '/usuario_usuario/:usuario1Id/:usuario2Id',
   authController.protect,
   authController.restrictTo('administrador', 'usuario'),
   mensagensController.mostrarMensagensUsuario_Usuario
);
router.post(
   '/usuario_usuario',
   authController.protect,
   authController.restrictTo('administrador', 'usuario'),
   mensagensController.criarMensagensUsuario_Usuario
);
router.delete(
   '/usuario_usuario/:mensagemId',
   authController.protect,
   authController.restrictTo('administrador', 'usuario'),
   mensagensController.removerMensagensUsuario_Usuario
);

/* ---------------- Routes for usuario-store mensagens -------------------- */
router.get(
   '/usuario_store/:usuarioId/:storeId',
   authController.mensagensProtect,
   authController.mensagensRestrictTo('administrador', 'usuario', 'donoLoja'),
   mensagensController.mostrarMensagensUsuario_Store
);
router.post(
   '/usuario_store',
   authController.mensagensProtect,
   authController.mensagensRestrictTo('administrador', 'usuario', 'donoLoja'),
   mensagensController.verifySender,
   mensagensController.criarMensagensUsuario_Store
);
router.delete(
   '/usuario_store/:mensagemId',
   authController.mensagensProtect,
   authController.mensagensRestrictTo('administrador', 'usuario', 'donoLoja'),
   mensagensController.removerMensagensUsuario_Store
);

/* ---------------- Routes for store-store mensagens -------------------- */
router.get(
   '/store_store/:store1Id/:store2Id',
   storeOwnerAuthController.storeOwnerProtect,
   storeOwnerAuthController.restrictTo('administrador', 'donoLoja'),
   mensagensController.mostrarMensagensStore_Store
);
router.post(
   '/store_store',
   storeOwnerAuthController.storeOwnerProtect,
   storeOwnerAuthController.restrictTo('administrador', 'donoLoja'),
   mensagensController.criarMensagensStore_Store
);
router.delete(
   '/store_store/:mensagemId',
   storeOwnerAuthController.storeOwnerProtect,
   storeOwnerAuthController.restrictTo('administrador', 'donoLoja'),
   mensagensController.removerMensagensStore_Store
);

//exporting router for usuarios
module.exports = router;
