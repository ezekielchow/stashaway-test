import { Schema, model } from 'mongoose';

interface IUser {
  email: string,
  referenceCode: string
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  referenceCode: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports.User = model<IUser>('User', userSchema);

