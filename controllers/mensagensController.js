//My own modules
const Usuario = require('../models/usuarioModel');
const Store = require('../models/storeModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const Usuario_UsuarioMensagens = require('../models/mensagemUsuario_UsuarioModel');
const Usuario_StoreMensagens = require('../models/mensagemUsuario_StoreModel');
const Store_StoreMensagens = require('../models/mensagemStore_StoreModel');

/* *************************************** Mensagens **************************************** */

exports.verifySender = catchAsync(async (req, res, next) => {
   if (req.usuario) {
      if (req.usuario.id !== req.body.usuario || req.usuario.id !== req.body.sender) {
         return next(new AppError('Não podes enviar mensages como outro usuario', 401));
      }
      next();
   }

   if (req.storeOwner) {
      const store = await Store.findById(req.body.store);
      if (store.storeOwner.id !== req.storeOwner.id || store.id !== req.body.sender || store.id !== req.body.store) {
         return next(new AppError('Não podes enviar mensages como outra loja', 401));
      }
      next();
   }
});

/* ---------------- Usuario_Usuario --------------------- */
exports.mostrarMensagensUsuario_Usuario = catchAsync(async (req, res, next) => {
   //req.params.usuario1Id
   //req.params.usuario2Id

   const usuario1Id = req.params.usuario1Id;
   const usuario2Id = req.params.usuario2Id;

   const mensagens = await Usuario_UsuarioMensagens.find({
      $or: [
         { $and: [{ usuario_sender: usuario1Id }, { usuario_receiver: usuario2Id }] },
         { $and: [{ usuario_sender: usuario2Id }, { usuario_receiver: usuario1Id }] }
      ]
   });

   const mensagem = mensagens[0];

   if (!mensagem) {
      return res.status(200).json({
         status: 'success'
      });
   }

   if (req.usuario.id !== mensagem.usuario_sender.id && req.usuario.id !== mensagem.usuario_receiver.id) {
      return next(new AppError('Não podes ver as mensagens de outro usuario', 403));
   }

   res.status(200).json({
      status: 'success',
      mensagens
   });
});

exports.criarMensagensUsuario_Usuario = catchAsync(async (req, res, next) => {
   //req.body.mensagem
   //req.body.usuario_sender
   //req.body.usuario_receiver

   if (req.usuario.id !== req.body.usuario_sender) {
      return next(new AppError('Não podes enviar mensages como outro usuario', 401));
   }

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

   const mensagem = await Usuario_UsuarioMensagens.findById(req.params.mensagemId);

   if (!mensagem) {
      return next(new AppError('No documents with this id', 404));
   }

   if (req.usuario.id !== mensagem.usuario_sender.id) {
      return next(new AppError('Não podes remover uma mensagem que nao enviastes', 403));
   }

   const mensagemDeletada = await Usuario_UsuarioMensagens.findByIdAndDelete(req.params.mensagemId);

   res.status(200).json({
      status: 'success',
      data: null
   });
});

/* ---------------- Usuario_Store --------------------- */

exports.mostrarMensagensUsuario_Store = catchAsync(async (req, res, next) => {
   //req.params.usuarioId
   //req.params.storeId
   const usuarioId = req.params.usuarioId;
   const storeId = req.params.storeId;
   const mensagens = await Usuario_StoreMensagens.find({
      $and: [{ usuario: usuarioId }, { store: storeId }]
   });
   const mensagem = mensagens[0];
   if (!mensagem) {
      return res.status(200).json({
         status: 'success'
      });
   }

   if (req.usuario && mensagem) {
      //console.log(req.usuario.id);
      //console.log(mensagem.usuario.id);
      if (req.usuario.id === mensagem.usuario.id) {
         res.status(200).json({
            status: 'success',
            mensagens
         });
      } else {
         return next(new AppError('Não tens permissão para tal U', 404));
      }
   }
   if (req.storeOwner && mensagem) {
      if (req.storeOwner.id === mensagem.store.storeOwner.id) {
         res.status(200).json({
            status: 'success',
            mensagens
         });
      } else {
         return next(new AppError('Não tens permissão para tal S', 404));
      }
   }
});

exports.criarMensagensUsuario_Store = catchAsync(async (req, res, next) => {
   //req.body.mensagem
   //req.body.usuario
   //req.body.store
   //req.body.sender
   //req.body.receiver

   const mensagem = await Usuario_StoreMensagens.create(req.body);

   res.status(201).json({
      status: 'success',
      data: {
         data: mensagem
      }
   });
});

exports.removerMensagensUsuario_Store = catchAsync(async (req, res, next) => {
   //req.params.mensagemId
   const mensagem = await Usuario_StoreMensagens.findById(req.params.mensagemId);

   if (!mensagem) {
      return next(new AppError('No documents with this id', 404));
   }

   if (req.usuario) {
      if (req.usuario.id !== mensagem.usuario.id) {
         return next(new AppError('Não podes remover a mensagem de outro usuario', 403));
      }
   }

   if (req.storeOwner) {
      if (req.storeOwner.id !== mensagem.store.storeOwner.id) {
         return next(new AppError('Não podes remover a mensagem de uma loja que não lhe pertence', 403));
      }
   }

   const mensagemDeletada = await Usuario_StoreMensagens.findByIdAndDelete(req.params.mensagemId);

   res.status(200).json({
      status: 'success',
      data: null
   });
});

/* ---------------- Store_Store --------------------- */
exports.mostrarMensagensStore_Store = catchAsync(async (req, res, next) => {
   //req.params.store1Id
   //req.params.store2Id

   const store1Id = req.params.store1Id;
   const store2Id = req.params.store2Id;

   const mensagens = await Store_StoreMensagens.find({
      $or: [
         { $and: [{ store_sender: store1Id }, { store_receiver: store2Id }] },
         { $and: [{ store_sender: store2Id }, { store_receiver: store1Id }] }
      ]
   });

   const mensagem = mensagens[0];

   if (!mensagem) {
      return res.status(200).json({
         status: 'success'
      });
   }

   //console.log(req.storeOwner.id);
   //console.log(mensagem.store_receiver.storeOwner.id);
   if (
      req.storeOwner.id !== mensagem.store_sender.storeOwner.id &&
      req.storeOwner.id !== mensagem.store_receiver.storeOwner.id
   ) {
      return next(new AppError('Não podes ver as mensagens de outra loja', 403));
   }

   res.status(200).json({
      status: 'success',
      mensagens
   });
});

exports.criarMensagensStore_Store = catchAsync(async (req, res, next) => {
   //req.body.mensagem
   //req.body.usuario_sender
   //req.body.usuario_receiver

   const store = await Store.findById(req.body.store_sender);
   //console.log(store);

   if (req.storeOwner.id !== store.storeOwner.id) {
      return next(new AppError('Não podes enviar mensages por uma loja que não lhe pertence', 401));
   }

   const mensagem = await Store_StoreMensagens.create(req.body);

   res.status(201).json({
      status: 'success',
      data: {
         data: mensagem
      }
   });
});

exports.removerMensagensStore_Store = catchAsync(async (req, res, next) => {
   //req.params.mensagemId

   const mensagem = await Store_StoreMensagens.findById(req.params.mensagemId);

   if (!mensagem) {
      return next(new AppError('No documents with this id', 404));
   }

   //console.log(req.storeOwner.id);
   //console.log(mensagem.store_sender.storeOwner.id);

   if (req.storeOwner.id !== mensagem.store_sender.storeOwner.id) {
      return next(new AppError('Não podes remover uma mensagem que nao enviastes', 403));
   }

   const mensagemDeletada = await Store_StoreMensagens.findByIdAndDelete(req.params.mensagemId);

   res.status(200).json({
      status: 'success',
      data: null
   });
});
