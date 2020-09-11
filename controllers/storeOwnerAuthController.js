//Core Modules
const crypto = require('crypto');
const { promisify } = require('util');

//Third-Party modules
const jwt = require('jsonwebtoken');

//My own Modules
const StoreOwner = require('../models/storeOwnerModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

const signToken = id => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
   });
};

const createSendToken = (storeOwner, status, req, res) => {
   const token = signToken(storeOwner._id);

   res.cookie('jwt', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      //secure: true,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
   });

   //Remove password from the output
   storeOwner.password = undefined;

   res.status(status).json({
      status: 'success',
      token,
      data: {
         storeOwner
      }
   });
};

//Store Owner signup
exports.storeOwnerSignup = catchAsync(async (req, res, next) => {
   //const novoUsuario = await Usuario.create(req.body); //Big security flaw in this line of code

   const newStoreOwner = await StoreOwner.create({
      role: req.body.role,
      nome: req.body.nome,
      nomeUsuario: req.body.nomeUsuario,
      email: req.body.email,
      numeroTelemovel: req.body.numeroTelemovel,
      password: req.body.password,
      passwordConfirmacao: req.body.passwordConfirmacao
   });

   const url = `${req.protocol}://${req.get('host')}/me`; //Change for PUG Store owner dashboard
   // console.log(url);

   await new Email(newStoreOwner, url).sendWelcome(); //enable after implementing PUG TEMPLATES

   createSendToken(newStoreOwner, 201, req, res);
});

exports.storeOwnerLogin = catchAsync(async (req, res, next) => {
   const { userData, password } = req.body;

   //Check if email and password exist

   if (req.body.userData === undefined) {
      return next(new AppError('Please provide username/e-mail and password', 400));
   }

   if (!req.body.userData || !req.body.password) {
      return next(new AppError('Please provide username/e-mail and password', 400));
   }

   if (!userData || !password) {
      return next(new AppError('Please provide username/e-mail and password', 400));
   }

   //Check if user exists and if password if correct
   const storeOwner = await StoreOwner.findOne({
      $or: [{ nomeUsuario: userData }, { email: userData }]
   }).select('+password');

   if (!storeOwner || !(await storeOwner.correctPassword(password, storeOwner.password))) {
      return next(new AppError('Invalid username/e-mail or Password', 401));
   }

   // console.log(storeOwner);

   //If everything is ok send token to client
   //token Variable done by me
   createSendToken(storeOwner, 200, req, res);
});

exports.storeOwnerLogOut = (req, res) => {
   res.cookie('jwt', 'loggedOut', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
   });

   res.status(200).json({
      status: 'success'
   });
};

exports.storeOwnerProtect = catchAsync(async (req, res, next) => {
   // Get token and check if it exists
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
   } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
   }

   if (!token) {
      return next(new AppError('You are not logged in, please log in to get access', 401));
   }

   // Verify token
   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

   // Check if user still exists
   const currentOwner = await StoreOwner.findById(decoded.id);
   if (!currentOwner) {
      return next(new AppError('Token User no longer exists', 401));
   }

   // Check if user changed passwords after JWT was assigned
   if (currentOwner.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('Password was chenged recently, Please log in again', 401));
   }

   //Grant access to protected route
   req.storeOwner = currentOwner;
   res.locals.storeOwner = currentOwner;
   next();
});

exports.storeOwnerIsLoggedIn = async (req, res, next) => {
   // Get token and check if it exists
   if (req.cookies.jwt) {
      try {
         // Verify token
         const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

         // Check if user still exists
         const currentOwner = await StoreOwner.findById(decoded.id);
         if (!currentOwner) {
            return next();
         }

         // Check if user changed passwords after JWT was assigned
         if (currentOwner.changedPasswordAfter(decoded.iat)) {
            return next();
         }

         //There is a logged in user
         res.locals.storeOwner = currentOwner;
         return next();
      } catch (err) {
         return next();
      }
   }
   next();
};

exports.restrictTo = (...roles) => {
   //Function to restrict certain Routes to certain types 'roles' of users
   return (req, res, next) => {
      if (!roles.includes(req.storeOwner.role)) {
         return next(new AppError('You do not have permission for this action', 403));
      }
      next();
   };
};

exports.storeOwnerForgotPassword = catchAsync(async (req, res, next) => {
   const { userData } = req.body;

   if (req.body.userData === undefined) {
      return next(new AppError('Please provide username or e-mail', 400));
   }

   if (!req.body.userData) {
      return next(new AppError('Please provide username or e-mail', 400));
   }

   if (!userData) {
      return next(new AppError('Please provide username or e-mail', 400));
   }

   //Get user e-mail based on posted username or email
   const storeOwner = await StoreOwner.findOne({
      $or: [{ nomeUsuario: userData }, { email: userData }]
   });

   // console.log(usuario);

   if (!storeOwner) {
      next(new AppError('Não existem donos de loja com este nome ou email', 404));
   }

   //Generate random reset token
   const resetToken = storeOwner.createPasswordResetToken();
   await storeOwner.save({ validateBeforeSave: false }); //Turn validation off before saving

   /* ------delete CODE BELLOW after IMPLEMENTING PUG TEMPLATES */

   /*const resetURL = `${req.protocol}://${req.get('host')}/api/v1/usuarios/resetPassword/${resetToken}`;

   const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

   try {
      await Email({
         email: storeOwner.email,
         subject: 'Your password reset token (valid for 10 min)',
         message
      });

      res.status(200).json({
         status: 'success',
         message: 'Token sent to email!'
      });
   } catch (err) {
      storeOwner.passwordResetToken = undefined;
      storeOwner.passwordResetExpires = undefined;
      await storeOwner.save({ validateBeforeSave: false });

      return next(new AppError('There was an error sending the email. Try again later!'), 500);
   }*/

   //send it back to user's e-mail
   /*-----------AFTER IMPLEMENTING PUG TEMPLATES---------------------*/

   try {
      const resetURL = `${req.protocol}://${req.get('host')}/api/v1/donosdeloja/resetPassword/${resetToken}`;
      await new Email(storeOwner, resetURL).sendPasswordReset();

      res.status(200).json({
         status: 'success',
         message: 'Token sent to e-mail'
      });
   } catch (err) {
      storeOwner.passwordResetToken = undefined;
      storeOwner.passwordResetExpires = undefined;
      await storeOwner.save({ validateBeforeSave: false }); //Turn validation off before saving

      return next(new AppError('There was an error sending the e-mail, please try again', 500));
   }
});

exports.storeOwnerResetPassword = catchAsync(async (req, res, next) => {
   //get user based on token
   const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

   //find user that has the token sent via email
   const storeOwner = await StoreOwner.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
   });

   //set new password if token has not expired and user exists
   if (!storeOwner) {
      return next(new AppError('Your token is invalid or has expired', 400));
   }

   //update changedPasswordAt property for the current user
   storeOwner.password = req.body.password;
   storeOwner.passwordConfirmacao = req.body.passwordConfirmacao;
   storeOwner.passwordResetToken = undefined;
   storeOwner.passwordResetExpires = undefined;

   await storeOwner.save();

   //log user in, send jwt to client
   createSendToken(storeOwner, 200, req, res);
});

exports.storeOwnerUpdatePassword = catchAsync(async (req, res, next) => {
   //Get user from collection
   const storeOwner = await StoreOwner.findById(req.storeOwner.id).select('+password');

   //Check if current password is not correct else continue
   if (!(await storeOwner.correctPassword(req.body.passwordCurrent, storeOwner.password))) {
      return next(new AppError('Your password is not correct', 401));
   }

   //Check if current password is different from candidate password
   if (await storeOwner.correctPassword(req.body.password, storeOwner.password)) {
      return next(new AppError('New password must be different of current password', 400));
   }

   //If current password is correct then Update the password and different
   storeOwner.password = req.body.password;
   storeOwner.passwordConfirmacao = req.body.passwordConfirmacao;
   await storeOwner.save();

   //Log user in with new password, send jwt
   createSendToken(storeOwner, 200, req, res);
});
