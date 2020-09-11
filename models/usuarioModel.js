const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
   nome: {
      type: String,
      required: [true, 'please tell us your name']
   },
   nomeUsuario: {
      type: String,
      required: [true, 'Please Provide a username'],
      unique: true,
      minlength: 3,
      maxlength: 20,
      trim: true
   },
   email: {
      type: String,
      required: [true, 'please insert your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please insert a valid email']
   },
   numeroTelemovel: {
      type: String,
      unique: true,
      trim: true
   },
   fotografia: { type: String, default: 'default.jpg' },
   role: {
      type: String,
      enum: ['usuario', 'moderador', 'administrador'],
      default: 'usuario'
   },
   password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false
   },
   passwordConfirmacao: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
         //This only works on 'create()' and 'save()'
         validator: function (el) {
            return el === this.password;
         },
         message: 'Passwords are not the same'
      }
   },
   passwordChangedAt: Date,
   passwordResetToken: String,
   passwordResetExpires: Date,
   active: {
      type: Boolean,
      default: true,
      select: false
   },
   estado: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline'
   }
});

usuarioSchema.pre('save', async function (next) {
   //Only run if password was modified
   if (!this.isModified('password')) return next();

   //hash password with cost of 12
   this.password = await bcrypt.hash(this.password, 12);

   //delete passwordConfirmacao field
   this.passwordConfirmacao = undefined;
   next();
});

usuarioSchema.pre('save', function (next) {
   if (!this.isModified('password') || this.isNew) return next();

   this.passwordChangedAt = Date.now() - 1000;

   next();
});

usuarioSchema.pre(/^find/, function (next) {
   //this points to the current query
   this.find({ active: { $ne: false } });
   next();
});

//Compare input password with existing password
usuarioSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
   return await bcrypt.compare(candidatePassword, userPassword);
};

usuarioSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
   if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

      return JWTTimestamp < changedTimestamp;
   }

   //False means Password was not changed
   return false;
};

usuarioSchema.methods.createPasswordResetToken = function () {
   const resetToken = crypto.randomBytes(32).toString('hex');

   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

   // console.log({ resetToken }, this.passwordResetToken);

   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

   return resetToken;
};

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
