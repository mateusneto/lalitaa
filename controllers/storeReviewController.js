//My own modules
//const catchAsync = require('./../utils/catchAsync');
//const AppError = require('./../utils/appError');
const Review = require('../models/storeReviewModel');
const Store = require('../models/storeModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.setStoreAndUsuarioIds = (req, res, next) => {
   //Allow nested routes
   if (!req.body.store) req.body.store = req.params.storeId;
   if (!req.body.usuario) req.body.usuario = req.usuario.id;
   next();
};

exports.checkUser = catchAsync(async (req, res, next) => {
   const review = await Review.find({ usuario: { $in: res.locals.usuario.id } });

   if (review.store === req.body.store) return next(new AppError('Voce ja avaliou esta loja', 401));

   next();
});

exports.checkReviewOwner = catchAsync(async (req, res, next) => {
   const review = await Review.findById(req.params.id);

   const reviewUser = review.usuario._id.toString();
   const loggedUser = res.locals.usuario._id.toString();

   if (reviewUser !== loggedUser) {
      return next(new AppError('Esta review não lhe pertence', 401));
   }

   next();
});

exports.createReview = factory.createOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
