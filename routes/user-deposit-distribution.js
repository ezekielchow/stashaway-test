const express = require('express');

const userDepositDistributionController = require('../controllers/user-deposit-distribution-controller');

const router = express.Router();

router.post('/distributions/:userId', userDepositDistributionController.distributions);

module.exports = router;
