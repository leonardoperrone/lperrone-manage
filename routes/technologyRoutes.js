const express = require('express');
const technologyController = require('../controllers/technologyController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkId);

router
  .route('/')
  .get(technologyController.getTechologies)
  .post(
    authController.protect,
    technologyController.uploadTechImages,
    technologyController.resizeTechImages,
    technologyController.createTechology
  );

router
  .route('/:id')
  .get(technologyController.getTechology)
  .patch(
    authController.protect,
    technologyController.uploadTechImages,
    technologyController.resizeTechImages,
    technologyController.updateTechology
  )
  .delete(authController.protect, technologyController.deleteTechology);

module.exports = router;
