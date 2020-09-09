//Core Modules
const crypto = require('crypto');
const { promisify } = require('util');

//Third-Party modules
const jwt = require('jsonwebtoken');

//My own Modules
const Usuario = require('../models/usuarioModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

const signToken = id => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
   });
};

const createSendToken = (usuario, status, req, res) => {
   const token = signToken(usuario._id);

   res.cookie('jwt', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      //secure: true,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
   });

   //Remove password from the output
   usuario.password = undefined;

   res.status(status).json({
      status: 'success',
      token,
      data: {
         usuario
      }
   });
};

/*exports.storeOwnerSignup = catchasync(async (req, res, next) => {


   const newStoreOwner = await StoreOwner.create({
      role: req.body.role,
      nome: req.body.nome,
      nomeUsuario: req.body.nomeUsuario,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmacao: req.body.passwordConfirmacao
   });




});*/

exports.signup = catchAsync(async (req, res, next) => {
   //const novoUsuario = await Usuario.create(req.body); //Big security flaw in this line of code

   const novoUsuario = await Usuario.create({
      role: req.body.role,
      nome: req.body.nome,
      nomeUsuario: req.body.nomeUsuario,
      email: req.body.email,
      numeroTelemovel: req.body.numeroTelemovel,
      password: req.body.password,
      passwordConfirmacao: req.body.passwordConfirmacao
   });

   const url = `${req.protocol}://${req.get('host')}/me`;
   // console.log(url);

   //await new Email(novoUsuario, url).sendWelcome();  //enable after implementing PUG TEMPLATES

   createSendToken(novoUsuario, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
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
   const usuario = await Usuario.findOne({
      $or: [{ nomeUsuario: userData }, { email: userData }]
   }).select('+password');

   if (!usuario || !(await usuario.correctPassword(password, usuario.password))) {
      return next(new AppError('Invalid username/e-mail or Password', 401));
   }

   // console.log(usuario);

   //If everything is ok send token to client
   //token Variable done by me
   createSendToken(usuario, 200, req, res);
});

exports.logOut = (req, res) => {
   res.cookie('jwt', 'loggedOut', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
   });

   res.status(200).json({
      status: 'success'
   });
};

exports.protect = catchAsync(async (req, res, next) => {
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
   const currentUser = await Usuario.findById(decoded.id);
   if (!currentUser) {
      return next(new AppError('Token User no longer exists', 401));
   }

   // Check if user changed passwords after JWT was assigned
   if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('Password was chenged recently, Please log in again', 401));
   }

   //Grant access to protected route
   req.usuario = currentUser;
   res.locals.usuario = currentUser;
   next();
});

//Only for rendered pages, will produce no errors
exports.isLoggedIn = async (req, res, next) => {
   // Get token and check if it exists
   if (req.cookies.jwt) {
      try {
         // Verify token
         const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

         // Check if user still exists
         const currentUser = await Usuario.findById(decoded.id);
         if (!currentUser) {
            return next();
         }

         // Check if user changed passwords after JWT was assigned
         if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next();
         }

         //There is a logged in user
         res.locals.usuario = currentUser;
         return next();
      } catch (err) {
         return next();
      }
   }
   next();
};

exports.restrictTo = (...roles) => {
   //Function to restrict 'delete' Route to administrador e moderador
   return (req, res, next) => {
      if (!roles.includes(req.usuario.role)) {
         return next(new AppError('You do not have permission for this action', 403));
      }
      next();
   };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
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
   const usuario = await Usuario.findOne({
      $or: [{ nomeUsuario: userData }, { email: userData }]
   });

   // console.log(usuario);

   if (!usuario) {
      next(new AppError('Não existem usuarios com este nome ou email', 404));
   }

   //Generate random reset token
   const resetToken = usuario.createPasswordResetToken();
   await usuario.save({ validateBeforeSave: false }); //Turn validation off before saving

   /* ------delete CODE BELLOW after IMPLEMENTING PUG TEMPLATES */

   const resetURL = `${req.protocol}://${req.get('host')}/api/v1/usuarios/resetPassword/${resetToken}`;

   const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

   try {
      await Email({
         email: usuario.email,
         subject: 'Your password reset token (valid for 10 min)',
         message
      });

      res.status(200).json({
         status: 'success',
         message: 'Token sent to email!'
      });
   } catch (err) {
      usuario.passwordResetToken = undefined;
      usuario.passwordResetExpires = undefined;
      await usuario.save({ validateBeforeSave: false });

      return next(new AppError('There was an error sending the email. Try again later!'), 500);
   }

   //send it back to user's e-mail
   /*-----------AFTER IMPLEMENTING PUG TEMPLATES---------------------
   
   try {
      const resetURL = `${req.protocol}://${req.get('host')}/api/v1/usuarios/resetPassword/${resetToken}`;
      await new Email(usuario, resetURL).sendPasswordReset();

      res.status(200).json({
         status: 'success',
         message: 'Token sent to e-mail'
      });
   } catch (err) {
      usuario.passwordResetToken = undefined;
      usuario.passwordResetExpires = undefined;
      await usuario.save({ validateBeforeSave: false }); //Turn validation off before saving

      return next(new AppError('There was an error sending the e-mail, please try again', 500));
   }*/
});

exports.resetPassword = catchAsync(async (req, res, next) => {
   //get user based on token
   const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

   //find user that has the token sent via email
   const usuario = await Usuario.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
   });

   //set new password if token has not expired and user exists
   if (!usuario) {
      return next(new AppError('Your token is invalid or has expired', 400));
   }

   //update changedPasswordAt property for the current user
   usuario.password = req.body.password;
   usuario.passwordConfirmacao = req.body.passwordConfirmacao;
   usuario.passwordResetToken = undefined;
   usuario.passwordResetExpires = undefined;

   await usuario.save();

   //log user in, send jwt to client
   createSendToken(usuario, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
   //Get user from collection
   const usuario = await Usuario.findById(req.usuario.id).select('+password');

   //Check if current password is not correct else continue
   if (!(await usuario.correctPassword(req.body.passwordCurrent, usuario.password))) {
      return next(new AppError('Your password is not correct', 401));
   }

   //Check if current password is different from candidate password
   if (await usuario.correctPassword(req.body.password, usuario.password)) {
      return next(new AppError('New password must be different of current password', 400));
   }

   //If current password is correct then Update the password and different
   usuario.password = req.body.password;
   usuario.passwordConfirmacao = req.body.passwordConfirmacao;
   await usuario.save();

   //Log user in with new password, send jwt
   createSendToken(usuario, 200, req, res);
});
