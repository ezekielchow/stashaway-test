const mongoose = require('mongoose');

const TYPES = {
  ONE_TIME: 'one-time',
  MONTHLY: 'monthly',
};

console.log('eh?');

const depositPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [TYPES.ONE_TIME, TYPES.MONTHLY],
  },
  allocations: [{
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  }],
});

const DepositPlan = mongoose.model('DepositPlan', depositPlanSchema);

module.exports = {
  DepositPlan,
  TYPES,
};
