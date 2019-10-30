const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(projectController.getProjects)
  .post(
    authController.protect,
    projectController.uploadProjectFiles,
    projectController.resizeProjectLogos,
    projectController.resizeProjectPictures,
    projectController.createProject
  );

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(
    authController.protect,
    projectController.uploadProjectFiles,
    projectController.resizeProjectLogos,
    projectController.resizeProjectPictures,
    projectController.updateProject
  )
  .delete(
    authController.protect,
    projectController.deleteProjectLogos,
    projectController.deleteProjectPictures,
    projectController.deleteProject
  );

router
  .route('/:id/logo/:logoId')
  .delete(authController.protect, projectController.deleteProjectLogo);

router
  .route('/:id/picture/:picId')
  .delete(authController.protect, projectController.deleteProjectPicture);

module.exports = router;
