const express = require('express');
const authController = require('../controllers/authController');
// const {getUser, getUsers,  ....} = require('./../controllers/userController.js')

const router = express.Router();

// TODO: to be removed eventually
// router.post('/signup', authController.signup);

router.get('/isLoggedIn', authController.isUserLoggedIn);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
