import { Schema, model } from 'mongoose';

interface IUserDeposit {
  amount: number,
  depositedAt: Date
}

const userDepositSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  depositedAt: {
    type: Date,
    required: true,
  },
});

module.exports.UserDeposit = model<IUserDeposit>('UserDeposit', userDepositSchema);
