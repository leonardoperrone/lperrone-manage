const express = require('express');
const technologyController = require('../controllers/technologyController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(technologyController.getTechologies)
  .post(
    authController.protect,
    technologyController.uploadTechFiles,
    technologyController.resizeTechPictures,
    technologyController.createTechology
  );

router
  .route('/:id')
  .get(technologyController.getTechology)
  .patch(
    authController.protect,
    technologyController.uploadTechFiles,
    technologyController.resizeTechPictures,
    technologyController.updateTechology
  )
  .delete(
    authController.protect,
    technologyController.deleteTechnologyLogos,
    technologyController.deleteTechology
  );

router
  .route('/:id/logo/:logoId')
  .delete(authController.protect, technologyController.deleteTechLogo);

module.exports = router;
