import { Schema, Types, model } from 'mongoose';

const TYPES = {
  ONE_TIME: 'one-time',
  MONTHLY: 'monthly',
};

interface IDepositPlan {
  user: Types.ObjectId,
  type: string,
  allocations: Array<Object>
}

const depositPlanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [TYPES.ONE_TIME, TYPES.MONTHLY],
  },
  allocations: [{
    portfolio: {
      type: Schema.Types.ObjectId,
      ref: 'Portfolio',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  }],
});

const DepositPlan = model<IDepositPlan>('DepositPlan', depositPlanSchema);

module.exports = {
  DepositPlan,
  TYPES,
};
