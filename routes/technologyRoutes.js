const express = require('express');
const technologyController = require('../controllers/technologyController');

const router = express.Router();

// router.param('id', tourController.checkId);

router
  .route('/')
  .get(technologyController.getTechologies)
  .post(
    technologyController.uploadTechImages,
    technologyController.resizeTechImages,
    technologyController.createTechology
  );

router
  .route('/:id')
  .get(technologyController.getTechology)
  .patch(
    technologyController.uploadTechImages,
    technologyController.resizeTechImages,
    technologyController.updateTechology
  )
  .delete(technologyController.deleteTechology);

module.exports = router;
