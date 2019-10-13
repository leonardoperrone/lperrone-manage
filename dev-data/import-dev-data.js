const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Technology = require('../models/technologyModel');

dotenv.config({ path: '../config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB Connection successful!');
  });

// Read JSON file
const technologies = JSON.parse(
  fs.readFileSync(`${__dirname}/technologies.json`, 'utf-8')
);

console.log('TECHNOLOGIES', technologies.technologies);

// Import data into DB
const importData = async () => {
  try {
    await Technology.create(technologies.technologies);
    console.log('data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data in collection
const deleteData = async () => {
  try {
    await Technology.deleteMany();
    console.log('data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
