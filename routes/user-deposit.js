const express = require('express');

const userDepositController = require('../controllers/user-deposit-controller');

const router = express.Router();

router.post('/deposit', userDepositController.validate('deposit'), userDepositController.deposit);

module.exports = router;
