const express = require('express');
const user = require('../controllers/userController')
const auth = require('../controllers/authController')

const { Router } = express;

const router = Router();
router.get('/', auth.protect, user.getAllUser);
router.get('/active-booking', auth.protect, user.getUsersWithActiveTripBookings);
router.get('/active-users', auth.protect, user.getAllActiveUsers);
router.get('/inactive-users', auth.protect, user.getAllInActiveUsers);
router.get('/me', auth.isLoggedIn, user.getUser);
module.exports = router;