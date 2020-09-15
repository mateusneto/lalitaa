//Core modules
const fs = require('fs');
const path = require('path');

//My own modules
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const usuariosRouter = require('./routes/usuariosRoutes');
const storeOwnerRouter = require('./routes/storeOwnerRoutes');
const viewRouter = require('./routes/viewRoutes');
const storeRouter = require('./routes/storeRoutes');
const produtoRouter = require('./routes/produtoRoutes');
const storeReviewsRouter = require('./routes/storeReviewRoutes');
const produtoReviewsRouter = require('./routes/produtoReviewRoutes');

//Third Party Modules
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

//App variable, start express app
const app = express();
// console.log(process.env.NODE_ENV);

app.enable('trust proxy');

// Pug settings
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/* ---------------------------- CORS ------------------------------ */
//Global Middlewares
//Implement CORS
app.use(cors());
// app.use(
//   cors({
//     origin: 'www.lalitaa.com',
//   })
// );
app.options('*', cors());
// app.options('/api/v1/servicos/:id', cors());
/* ----------------------------------------------------------------- */

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Setting secure http headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
   //development logging
   app.use(morgan('dev'));
}

//Allowing only 100 requests from the same IP in 1 hour
const limiter = rateLimit({
   max: 100,
   windowMs: 60 * 60 * 1000,
   message: 'Too many requests from this IP please tryagain in 1 hour'
});
app.use('/api', limiter); //Limiting access to our 'api' route

//
//app.post('/webhook-checkout', express.raw({ type: 'application/json' }), bookingController.webhookCheckout);

//Body parser, reading data from the body into 'req.body'
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//Cookie parser, reading data from cookie
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss()); //Ver Aula

//Prevent parameter pollution
/*app.use(
   hpp({
      whitelist: ['duracao', 'quantidadeDeAvaliacoes', 'mediaDeAvaliacoes', 'preco', 'precoDesconto', 'duracaoSemanas']
   })
);*/ app.use(
   compression()
);

//My own Middlewares
//test middleware
app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   next();
});

//ROUTES
app.use('/', viewRouter);
app.use('/api/v1/usuarios', usuariosRouter); //Route for usuarios
app.use('/api/v1/donosdeloja', storeOwnerRouter); //Route for store Owners
app.use('/api/v1/lojas', storeRouter); //Route for stores
app.use('/api/v1/lojas/:id/produtos', storeRouter); //Route for estore owners deal with products on their stores
app.use('/api/v1/produtos', produtoRouter); //Route for admin dealing with products
app.use('/api/v1/storereviews', storeReviewsRouter); //Route for reviews
app.use('/api/v1/produtoreviews', produtoReviewsRouter); //Route for reviews

app.all('*', (req, res, next) => {
   next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

//Error handling middleware
app.use(globalErrorHandler);

//Exporting app variabled
module.exports = app;
