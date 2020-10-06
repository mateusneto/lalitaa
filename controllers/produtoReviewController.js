//My own modules
//const catchAsync = require('./../utils/catchAsync');
//const AppError = require('./../utils/appError');
const Review = require('../models/produtoReviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.setProdutoAndUsuarioIds = (req, res, next) => {
   //Allow nested routes
   if (!req.body.produto) req.body.produto = req.params.produtoId;
   if (!req.body.usuario) req.body.usuario = req.usuario.id;
   next();
};

exports.checkUser = catchAsync(async (req, res, next) => {
   const review = await Review.find({ usuario: { $in: res.locals.usuario.id } });

   if (review.produto === req.body.produto) return next(new AppError('Voce ja avaliou este produto', 401));

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
