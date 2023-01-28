import { Schema, Types, model } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId,
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

const User = model<IUser>('User', userSchema);

export default User

