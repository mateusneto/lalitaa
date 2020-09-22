//My own modules
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

//Third Party Modules
const express = require('express');

//Router variable
const router = express.Router();

router.use(authController.protect);

//router.get('/checkout-session/:storeId/:produtoId', bookingController.getCheckoutSession);

router.use(authController.restrictTo('administrador', 'moderador'));

router.route('/').get(bookingController.getAllBookings).post(bookingController.createBooking);

router
   .route('/:id')
   .get(bookingController.getBooking)
   .patch(bookingController.updateBooking)
   .delete(bookingController.deleteBooking);

module.exports = router;
