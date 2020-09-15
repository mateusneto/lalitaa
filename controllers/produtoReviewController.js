//My own modules
//const catchAsync = require('./../utils/catchAsync');
//const AppError = require('./../utils/appError');
const Review = require('../models/produtoReviewModel');
const factory = require('./storeOwnerHandlerFactory');

exports.setProdutoAndUsuarioIds = (req, res, next) => {
   //Allow nested routes
   if (!req.body.produto) req.body.produto = req.params.produtoId;
   if (!req.body.usuario) req.body.usuario = req.usuario.id;
   next();
};

exports.createReview = factory.createOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
