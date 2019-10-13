const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name']
  },
  description: {
    type: String,
    required: [true, 'Please enter a description'],
    maxLength: [520, 'Please enter 520 or less characters']
  },
  expColor: {
    type: String,
    validate: {
      validator: function(v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      }
    }
  },
  logos: {
    type: [String],
    required: [true, 'Please upload at least a photo']
  },
  experience: {
    type: String,
    required: [true, 'Please provide an experience number'],
    min: 0,
    max: 100
  },
  orderIndex: {
    type: Number,
    require
  }
});

const getExpColor = function(experience) {
  let hexColor = '#FFFFFFF';
  if (experience < 20) {
    hexColor = '#49FFD6';
  } else if (experience > 21 && experience < 40) {
    hexColor = '#6EFF6F';
  } else if (experience > 41 && experience < 60) {
    hexColor = '#FFC54C';
  } else if (experience > 61 && experience < 80) {
    hexColor = '#FF9574';
  } else if (experience > 81 && experience <= 100) {
    hexColor = '#ED5351';
  }
  return hexColor;
};

technologySchema.pre('save', function(next) {
  this.expColor = getExpColor(this.experience);
  next();
});

const Technology = mongoose.model('Technology', technologySchema);

module.exports = Technology;
