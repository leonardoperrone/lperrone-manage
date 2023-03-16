const Technology = require('../models/technologyModel');
const factory = require('./handlerFactory');

exports.uploadTechFiles = factory.setFields([
  { name: 'logos', minCount: 1, maxCount: 4 }
]);

// NOTE: can do 1 img vs array vs many arrays
// upload.single('image') -> req.file
// upload.array(;'images', 5) -> req.files
exports.resizeTechPictures = factory.resizeImages(Technology, {
  name: 'tech',
  format: 'png',
  fileType: 'logos',
  sizes: [150]
});

exports.deleteTechLogo = factory.deleteLogo(Technology, {
  fileType: 'logos',
  paramId: 'logoId'
});

exports.deleteTechnologyLogos = factory.deleteStorageFiles(Technology, {
  fileType: 'logos'
});

// ROUTE HANDLERS
exports.getTechologies = factory.getAll(Technology);
exports.getTechology = factory.getOne(Technology);
exports.createTechology = factory.createOne(Technology);
exports.updateTechology = factory.updateOne(Technology);
exports.deleteTechology = factory.deleteOne(Technology);
