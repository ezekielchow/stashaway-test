const mongoose = require('mongoose');

const depositPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['one-time', 'monthly'],
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

module.exports = mongoose.model('DepositPlan', depositPlanSchema);
