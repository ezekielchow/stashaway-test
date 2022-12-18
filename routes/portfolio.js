const express = require('express');

const portfolioController = require('../controllers/portfolio-controller');

const router = express.Router();

router.get('/', portfolioController.list);
router.post('/', portfolioController.validate('create'), portfolioController.create);

module.exports = router;
