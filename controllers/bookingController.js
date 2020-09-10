//My own modules
const Servico = require('../models/servicoModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Booking = require('../models/bookingModel');
const Usuario = require('../models/usuarioModel');

//Third-party modules
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //Get currently booked servico
  const servico = await Servico.findById(req.params.servicoId);

  //Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/?servico=${
    //   req.params.servicoId
    // }&usuario=${req.usuario.id}&preco=${servico.preco}`,
    success_url: `${req.protocol}://${req.get(
      'host'
    )}/meus-servicos?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/servico/${servico.slug}`,
    customer_email: req.usuario.email,
    client_reference_id: req.params.servicoId,
    line_items: [
      {
        name: servico.nome,
        description: servico.resumo,
        images: [
          `${req.protocol}://${req.get('host')}/imagens/servicos/${
            servico.imagemDeCapa
          }`,
        ],
        amount: servico.preco * 100,
        currency: 'aoa',
        quantity: 1,
      },
    ],
  });

  //Create session and send it to client as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   //temporary solution
//   const { servico, usuario, preco } = req.query;

//   if (!servico && !usuario && !preco) return next();

//   await Booking.create({ servico, usuario, preco });

//   //res.redirect(req.originalUrl.split('?')[0]); //creating a new request to root url '/'
//   res.redirect('/meus-servicos');
// });

const createBookingCheckout = catchAsync(async (session) => {
  const servico = session.client_reference_id;
  const usuario = (await Usuario.findOne({ email: session.customer_email })).id;
  const preco = session.display_items[0].amount / 100;

  await Booking.create({ servico, usuario, preco });
});

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({
    received: true,
  });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
