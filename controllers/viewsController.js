//My own modules
//const Servico = require('../models/servicoModel');
const Usuario = require('../models/usuarioModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
//const Booking = require('../models/bookingModel');

exports.alerts = (req, res, next) => {
   const { alert } = req.query;

   if (alert === 'booking')
      res.locals.alert =
         'Your booking was succesfull, please check your e-mail for a confirmation. If your booking does not show up here please come back later';
   next();
};

/*exports.mostrarOverview = catchAsync(async (req, res, next) => {
  //1. Get servico data from collection
  const servicos = await Servico.find();

  //2. Build template

  //3. Render template

  res.status(200).render('overview', {
    title: 'Todos Serviços',
    servicos,
  });
});*/

/*exports.mostrarServico = catchAsync(async (req, res, next) => {
  const servico = await Servico.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating usuario',
  });

  if (!servico) {
    return next(new AppError('Nao existem serviços com este nome', 404));
  }

  res.status(200).render('servico', {
    title: servico.nome,
    servico,
  });
});*/

exports.mostrarConta = catchAsync(async (req, res, next) => {
   res.status(200).render('account', {
      title: 'Conta'
   });
});

/*exports.mostrarMeusServicos = catchAsync(async (req, res, next) => {
  //Find all bookings
  const bookings = await Booking.find({ usuario: req.usuario.id });

  //Find servicos with returned ID's
  const servicoIDs = bookings.map((el) => el.servico);
  const servicos = await Servico.find({ _id: { $in: servicoIDs } }); //select all servicos which have an '_id' which is '$in' 'servicoIDs' array

  res.status(200).render('overview', {
    title: 'Meus serviços',
    servicos,
  });
});*/

exports.getLoginForm = (req, res) => {
   res.status(200).render('login', {
      title: 'log into your page'
   });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
   const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      {
         nome: req.body.nome,
         nomeUsuario: req.body.nomeUsuario,
         email: req.body.email
      },
      {
         new: true,
         runValidators: true
      }
   );

   res.status(200).render('account', {
      title: 'Conta',
      usuario: usuarioActualizado
   });
});
