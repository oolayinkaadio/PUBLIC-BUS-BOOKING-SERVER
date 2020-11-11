const express = require('express');
const trip = require('../controllers/tripController')
const validationMiddleware = require('../Middlewares/tripMiddleware')
const auth = require('../controllers/authController')

const {
    Router
} = express;

const router = Router();
router.post('/', auth.protect, validationMiddleware.tripMiddleware, trip.createTrip)
router.patch('/cancel/:id', auth.protect, trip.cancelTrip)
router.patch('/activate/:id', auth.protect, trip.activateTrip)
router.get('/getall', auth.protect, trip.getAllTrip);
router.get('/active', auth.isLoggedIn, trip.getAllActiveTrip);
router.get('/inactive', auth.protect, trip.getAllInactiveTrip);
router.get('/:originDestination', auth.isLoggedIn, trip.getTripOriginDestination);
router.get('/bus-stop/:busstop', auth.isLoggedIn, trip.getTripBusstop);

module.exports = router;