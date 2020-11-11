const express = require('express');
const bus = require('../controllers/busController')
const busMiddleware = require('../Middlewares/busMiddleware')
const auth = require('../controllers/authController')

const {
    Router
} = express;

const router = Router();
router.post('/create', auth.protect, busMiddleware.createBusMiddleware, bus.createBus);
router.get('/', auth.protect, bus.getAllBus);
router.get('/number/:number_plate', auth.protect, bus.getBusWithNumberPlate);
router.get('/scheduled', auth.protect, bus.getScheduledBuses);
router.get('/unscheduled', auth.protect, bus.getUnscheduledBuses);
router.get('/:originDestination', auth.protect, bus.getBuswithTripOriginDestination);
router.delete('/:numberPlate', auth.protect, bus.deleteBus);

module.exports = router;

///write endpoint for deleting a bus