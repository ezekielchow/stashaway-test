import { Schema, model } from 'mongoose';

export interface IUserDeposit {
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

const UserDeposit = model<IUserDeposit>('UserDeposit', userDepositSchema);

export default UserDeposit