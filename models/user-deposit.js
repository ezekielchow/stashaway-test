const mongoose = require('mongoose');

const userDepositSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  depositedAt: {
    type: Date,
    required: true,
  },
});

module.exports.UserDeposit = mongoose.model('UserDeposit', userDepositSchema);
