const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name']
  },
  description: {
    type: String,
    required: [true, 'Please enter a description'],
    maxLength: 520
  },
  expColor: {
    type: String,
    required: [true, 'Please a hex color']
  },
  logos: {
    type: [String],
    required: [true, 'Please upload at least a photo']
  },
  experience: {
    type: String,
    min: 0,
    max: 100
  },
  orderIndex: {
    type: Number,
    require
  }
});

technologySchema.pre('save', function(next) {
  console.log(this.expColor);
  next();
});

const Technology = mongoose.model('Technology', technologySchema);

module.exports = Technology;
