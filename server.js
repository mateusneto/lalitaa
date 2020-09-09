const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
   console.log('uncaught Exception, 💥 SHUTTING DOWN...');
   console.log(err.name, err.message);

   process.exit(1);
});

dotenv.config({ path: './config.env' });

//CLOUD DATABASE
const DB_CLOUD = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

//LOCAL DATABASE
const DB_LOCAL = process.env.DATABASE_LOCAL;

//Cloud DATABASE Connection
mongoose
   .connect(DB_CLOUD, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
   })
   .then(() => console.log('Database connection successful'));

//My own modules
const app = require('./app');

//console.log(process.env);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
   console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
   console.log('Unhandled Rejection, 💥 SHUTTING DOWN...');
   console.log(err.name, err.message);

   //Give server time to handle all pending requests before shutting down
   server.close(() => {
      process.exit(1);
   });
});

//Receives SIGTERM signal from STRIPE
process.on('SIGTERM', () => {
   console.log('👍🏽 SIGTERM RECEIVED. SHUTTING DOWN gracefully');

   server.close(() => {
      console.log('💥 Process terminated!');
   });
});
