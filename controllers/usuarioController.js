//My own modules
const Usuario = require('../models/usuarioModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const Usuario_UsuarioMensagens = require('../models/mensagemUsuario_UsuarioModel');
const Usuario_StoreMensagens = require('../models/mensagemUsuario_StoreModel');

//Third-party modules
const multer = require('multer');
const sharp = require('sharp');

/* ------------------------------------- */
//Multer
/*const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imagens/usuarios');
  },
  filename: (req, file, cb) => {
    //user-d8s76vc7xz5v8xv789dcxz-223455113
    const ext = file.mimetype.split('/')[1];
    cb(null, `usuario-${req.usuario.id}-${Date.now()}.${ext}`);
  },
});*/

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
   if (file.mimetype.startsWith('image')) {
      cb(null, true);
   } else {
      cb(new AppError('Please upload an image', 400), false);
   }
};

const upload = multer({
   storage: multerStorage,
   fileFilter: multerFilter
});
/* ------------------------------------- */

exports.uploadUserPhoto = upload.single('fotografia');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
   if (!req.file) return next();

   req.file.filename = `usuario-${req.usuario.id}.jpeg`;
   await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/imagens/dev/usuarios/${req.file.filename}`);

   next();
});

exports.nothing = (req, res, next) => {
   res.status(500).json({
      status: 'error',
      message: 'This route is not Implemented, please use SignUp'
   });
};

//Controller for usuarios
exports.mostrarUsuarios = factory.getAll(Usuario);
exports.mostrarUsuario = factory.getOne(Usuario);
exports.actualizarUsuario = factory.updateOne(Usuario); // Do not update password with this
exports.removerUsuario = factory.deleteOne(Usuario);

exports.getMe = (req, res, next) => {
   req.params.id = req.usuario.id;
   next();
};

exports.deleteMe = factory.deleteMe(Usuario);

exports.updateMe = factory.updateMe(Usuario);

exports.criarUsuario = (req, res, next) => {
   res.status(500).json({
      status: 'error',
      message: 'This route is not Implemented, please use SignUp'
   });
};

/* *************************************** Mensagens **************************************** */

/* ---------------- usuario_usuario --------------------- */
exports.mostrarMensagensUsuario_Usuario = catchAsync(async (req, res, next) => {
   //req.params.senderId
   //req.params.receiverId

   const mensagens = await Usuario_UsuarioMensagens.find;

   res.status(200).json({
      status: 'success',
      mensagens
   });
});

exports.criarMensagensUsuario_Usuario = catchAsync(async (req, res, next) => {
   //req.body.mensagem
   //req.body.usuario_sender
   //req.body.usuario_receiver

   const mensagem = await Usuario_UsuarioMensagens.create(req.body);

   res.status(201).json({
      status: 'success',
      data: {
         data: mensagem
      }
   });
});

exports.removerMensagensUsuario_Usuario = catchAsync(async (req, res, next) => {
   //req.params.mensagemId

   res.status(500).json({
      status: 'error',
      message: 'This route is not Implemented, please use SignUp'
   });
});

/* ---------------- usuario_store --------------------- */

exports.mostrarMensagensUsuario_Store = catchAsync(async (req, res, next) => {
   //req.params.usuarioId
   //req.params.lojaId

   res.status(500).json({
      status: 'error',
      message: 'This route is not Implemented, please use SignUp'
   });
});

exports.criarMensagensUsuario_Store = catchAsync(async (req, res, next) => {
   //req.body.mensagem
   //req.body.usuario
   //req.body.store

   res.status(500).json({
      status: 'error',
      message: 'This route is not Implemented, please use SignUp'
   });
});

exports.removerMensagensUsuario_Store = catchAsync(async (req, res, next) => {
   //req.params.mensagemId

   res.status(500).json({
      status: 'error',
      message: 'This route is not Implemented, please use SignUp'
   });
});
