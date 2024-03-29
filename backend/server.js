const mongoose = require('mongoose');
const dotenv = require('dotenv');
const wakeUpDyno = require('./utils/wakeUpDyno');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION, shutting down....');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB Connection successful!');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log('App running on port ', port);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION, shutting down....');
  console.log(err.name, err.message);
  // NOTE: always try to close the server before killing the process
  server.close(() => {
    process.exit(1);
  });
});

// NOTE: HEROKU specific, to prevent abrupt termination during daily restart
// process.on("SIGTERM", () => {
//   console.log("SIGTERM RECEIVED, shutting down....");
//   // NOTE: always try to close the server before killing the process
//   server.close(() => {
//     console.log("Process terminated!");
//   });
// });
