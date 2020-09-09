//My own modules
const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
   const message = `Invalid ${err.path}: ${err.value}`;
   return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
   const message = `Duplicate field value: ${value} *** please use another value`;
   return new AppError(message, 404);
};

const handleValidationErrorDB = err => {
   const errors = Object.values(err.errors).map(el => el.message);

   const message = `Invalid input data ${errors.join(' <--> ')}`;
   return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid Token, please log in again', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired, please log in again', 401);

const sendErrorDev = (err, req, res) => {
   // A) API
   if (req.originalUrl.startsWith('/api')) {
      return res.status(err.statusCode).json({
         status: err.status,
         error: err,
         message: err.message,
         stack: err.stack
      });
   }
   // B) RENDERED WEBSITE
   console.error('Error 💥', err);
   return res.status(err.statusCode).render('error', {
      title: 'Something went very wrong',
      msg: err.message
   });
};

const sendErrorProd = (err, req, res) => {
   // A) API
   if (req.originalUrl.startsWith('/api')) {
      // A) Operational, trusted error: send message to client
      if (err.isOperational) {
         return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
         });
      }
      // B) Programming or other unknown error: do not leak details to client
      // 1) Log error to the console
      console.error('Error 💥', err);
      //Send generic message
      return res.status(500).json({
         status: 'error',
         message: 'Something went wrong'
      });
   }
   // B) Rendered website
   //Operational, trusted error: send message to client
   if (err.isOperational) {
      // console.log(err);
      return res.status(err.statusCode).render('error', {
         title: 'Something went very wrong',
         msg: err.message
      });
   }
   //Programming or other unknown error: do not leak details to client
   //Log error to the console
   console.error('Error 💥', err);
   //Send generic message
   return res.status(err.statusCode).render('error', {
      title: 'Something went very wrong',
      msg: 'Please try again later!!!'
   });
};

module.exports = (err, req, res, next) => {
   //console.log(err.stack);

   err.statusCode = err.statusCode || 500; //500 means Internal Server Error
   err.status = err.status || 'Error';

   if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, req, res);
   } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      error.message = err.message;

      if (error.name === 'CastError') error = handleCastErrorDB(error);
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
      if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
      if (error.name === 'JsonWebTokenError') error = handleJWTError();
      if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

      sendErrorProd(error, req, res);
   }
};
