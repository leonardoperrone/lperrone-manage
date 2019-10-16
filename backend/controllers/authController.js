const { promisify } = require('util');
// const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  console.log(req);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure
  });

  // NOTE: remove password from the output, already hidden in the find functionality but not in the signup/create new user functionality
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// TODO: to be removed eventually
// exports.signup = catchAsync(async (req, res, next) => {
//   // NOTE: This way below is NOT secure, someone could easily add a role to the body when signing up and set themselves as admin
//   // const newUser = await User.create(req.body);
//   // This is better because we only save the requried fields. All users will be just users, they shouldn't be allowed to pick roles
//   const { email, password, passwordConfirm } = req.body;

//   const newUser = await User.create({
//     email,
//     password,
//     passwordConfirm
//   });

//   createSendToken(newUser, 201, req, res);
// });

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if email and password exit
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2. check if user exists and if password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3. if all good, send token to client
  createSendToken(user, 200, req, res);
});

exports.isLoggedIn = async (req, res, next) => {
  // 1. get token and check if it exists

  if (req.cookies.jwt) {
    try {
      // 1. verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2. check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      // There's a logged in user
      res.locals.user = currentUser;
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};

exports.isUserLoggedIn = catchAsync(async (req, res, next) => {
  // 1. get token and check if it exists

  if (req.cookies.jwt) {
    try {
      // 1. verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2. check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      // There's a logged in user
      res.locals.user = currentUser;

      res.status(200).json({ status: 'success', isLoggedIn: true });
    } catch (error) {
      res.status(403).json({ status: 'fail', message: error.message });
    }
  }
  res.status(403).json({ status: 'fail', isLoggedIn: false });
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'logged-out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1. get token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please login to gain access', 401)
    );
  }
  // 2. validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new AppError('User does not longer exists', 401));

  // if code gets here, we grant access to protected routes
  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});
