const path = require('path');

const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
// const admin = require('firebase-admin');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const technologyRouter = require('./routes/technologyRoutes');
const userRouter = require('./routes/userRoutes');
const projectRouter = require('./routes/projectRoutes');

const app = express();

app.enable('trust proxy');

// GLOBAL MIDDLEWARE
// Implement cors, Access-Control-Allow-Origin *
app.use(cors());

// NOTE: with this below we would allow our frontend to access our api on the server

const whitelist = process.env.FRONTEND_PROD_URL.split(',');

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? process.env.FRONTEND_LOCAL_URL
        : whitelist
  })
);

// To allow cors on a specific path do the following
// app.options('/api/v1/tours/:id', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.all('/', (req, res, next) => {
  res.status(200).json({
    status: 'success'
  });
});
app.use('/api/v1/users', userRouter);
app.use('/api/v1/technologies', technologyRouter);
app.use('/api/v1/projects', projectRouter);

app.all('*', (req, res, next) => {
  // NOTE: whenever we pass anything into next express knows it's an error
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// NOTE: express knows this one is an error handler middleware
app.use(globalErrorHandler);

module.exports = app;
