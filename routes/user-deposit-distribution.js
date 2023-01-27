const express = require('express');

const userDepositDistributionController = require('../controllers/user-deposit-distribution-controller');

const router = express.Router();

router.get('/distributions/:userId', userDepositDistributionController.distributions);

module.exports = router;
