//My own modules
const StoreOwner = require('../models/storeOwnerModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./storeOwnerHandlerFactory');

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

   req.file.filename = `usuario-${req.storeOwner.id}-${Date.now()}.jpeg`;

   await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/imagens/usuarios/${req.file.filename}`);

   next();
});

//Controller for usuarios
exports.mostrarOwners = factory.getAll(StoreOwner);
exports.mostrarOwner = factory.getOne(StoreOwner);
exports.actualizarOwner = factory.updateOne(StoreOwner); // Do not update password with this
exports.removerOwner = factory.deleteOne(StoreOwner);

exports.getMe = (req, res, next) => {
   req.params.id = req.storeOwner.id;
   next();
};

exports.deleteMe = factory.deleteMe(StoreOwner);

exports.updateMe = factory.updateMe(StoreOwner);

exports.criarOwner = (req, res, next) => {
   res.status(500).json({
      status: 'error',
      message: 'This route is not Implemented, please use SignUp'
   });
};
