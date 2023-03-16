const Project = require('../models/projectModel');
const factory = require('./handlerFactory');

exports.uploadProjectFiles = factory.setFields([
  { name: 'logos', minCount: 1, maxCount: 4 },
  { name: 'pictures', minCount: 0, maxCount: 4 }
]);

// NOTE: can do 1 img vs array vs many arrays
// upload.single('image') -> req.file
// upload.array(;'images', 5) -> req.files

exports.resizeProjectLogos = factory.resizeImages(Project, {
  name: 'project',
  format: 'png',
  fileType: 'logos',
  sizes: [150]
});

exports.resizeProjectPictures = factory.resizeImages(Project, {
  name: 'project',
  format: 'jpg',
  fileType: 'pictures',
  sizes: [390, 260]
});

exports.deleteProjectLogos = factory.deleteStorageFiles(Project, {
  fileType: 'logos'
});

exports.deleteProjectPictures = factory.deleteStorageFiles(Project, {
  fileType: 'pictures'
});

exports.deleteProjectLogo = factory.deleteLogo(Project, {
  fileType: 'logos',
  paramId: 'logoId'
});
exports.deleteProjectPicture = factory.deleteLogo(Project, {
  fileType: 'pictures',
  paramId: 'picId'
});

// ROUTE HANDLERS
exports.getProjects = factory.getAll(Project);
exports.getProject = factory.getOne(Project);
exports.createProject = factory.createOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);
