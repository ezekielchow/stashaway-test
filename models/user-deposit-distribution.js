const mongoose = require('mongoose');

const userDepositDistributionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  allocations:
  {
    type: [{
      portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Portfolio',
        required: true,
      },
      distributedAmount: {
        type: Number,
        default: 0,
      },
    }],
    default: [],
  },
});

module.exports.UserDepositDistribution = mongoose.model('UserDepositDistribution', userDepositDistributionSchema);
