import { Schema, Types, model } from 'mongoose';

interface IUserDepositDistributionSchema {
  user: Types.ObjectId,
  amount: number,
  allocations: Array<Object>
}

const userDepositDistributionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
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

module.exports.UserDepositDistribution = model<IUserDepositDistributionSchema>('UserDepositDistribution', userDepositDistributionSchema);
