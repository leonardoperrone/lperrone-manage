
const catchAsync = require('./../utils/catchAsync');
const createSendToken = require('../controllers/authController');
const User = require('./../models/userModel');

// TODO: to be removed eventually

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    email,
    password,
    passwordConfirm
  });

  createSendToken(newUser, 201, req, res);
});
