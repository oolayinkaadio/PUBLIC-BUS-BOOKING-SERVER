const express = require('express');
const booking = require('../controllers/bookingController')
const bookMiddleware = require('../Middlewares/bookingMiddleware')
const auth = require('../controllers/authController')

const {
    Router
} = express;

const router = Router();
router.post('/createbooking', auth.isLoggedIn, booking.createBookingMiddleware, booking.createBooking);
router.get('/all', auth.protect, booking.getAllBooking);
router.get('/:status', auth.protect, booking.getBookingStatus);
router.get('/', auth.isLoggedIn, booking.getMyBooking);
router.patch('/change-seat/:booking_id/:seat_number', auth.isLoggedIn, bookMiddleware.changeSeatMiddleware, booking.changeSeat)
router.patch('/cancel/:id', auth.isLoggedIn, booking.cancelBookings)

module.exports = router;