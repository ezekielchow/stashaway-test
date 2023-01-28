import { Schema, Types, model } from 'mongoose';

export interface IPortfolio {
  name: string,
  user: Types.ObjectId
}

const portfolioSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const Portfolio = model('Portfolio', portfolioSchema);

type findParams = {
  user: string | Types.ObjectId
}

export const find = async (params: findParams) => {
  const query = Portfolio.find();

  if (params.user) {
    query.where({ user: params.user });
  }

  return query.exec();
};