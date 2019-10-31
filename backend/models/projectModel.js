const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name']
  },
  description: {
    type: String,
    required: [true, 'Please enter a description'],
    maxLength: [1050, 'Please enter 1000 or less characters']
  },
  city: {
    type: String,
    required: [true, 'Please enter a city']
  },
  country: {
    type: String,
    required: [true, 'Please enter a country']
  },
  year: {
    type: Number,
    required: [true, 'Please enter a year']
  },
  logos: {
    type: [String],
    required: [true, 'Please upload at least a logo']
  },
  orderIndex: {
    type: Number,
    required: [true, 'Please provide an index']
  },
  pictures: {
    type: [String]
  }
});

projectSchema.index({ orderIndex: 1 });


const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
