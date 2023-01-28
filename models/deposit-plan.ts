import { Schema, Types, model } from 'mongoose';

export const TYPES = {
  ONE_TIME: 'one-time',
  MONTHLY: 'monthly',
};

export interface AllocationType {
  _id: Types.ObjectId
  portfolio: Types.ObjectId,
  amount: number,
}

export interface IDepositPlan {
  user: Types.ObjectId,
  type: string,
  allocations: Array<AllocationType>
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

export const DepositPlan = model<IDepositPlan>('DepositPlan', depositPlanSchema);
