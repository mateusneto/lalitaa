//My own modules
//const catchAsync = require('./../utils/catchAsync');
//const AppError = require('./../utils/appError');
const Review = require('../models/storeReviewModel');
const factory = require('./storeOwnerHandlerFactory');

exports.setStoreAndUsuarioIds = (req, res, next) => {
   //Allow nested routes
   if (!req.body.store) req.body.store = req.params.storeId;
   if (!req.body.usuario) req.body.usuario = req.usuario.id;
   next();
};

exports.createReview = factory.createOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
