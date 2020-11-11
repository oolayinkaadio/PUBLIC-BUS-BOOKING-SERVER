const express = require('express');
const auth = require('../controllers/authController')

const {
    Router
} = express;

const router = Router();
router.post('/signup', auth.createUser);
router.post('/signin', auth.login);
router.patch('/update/:type', auth.protect, auth.updateUserToAdminorAdminToUser);

module.exports = router;