import { Schema, Types, model } from 'mongoose';

interface IPortfolio {
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

const Portfolio = model('Portfolio', portfolioSchema);

module.exports.Portfolio = Portfolio;

type findParams = {
  user: string | Types.ObjectId
}

module.exports.find = async (params: findParams) => {
  const query = Portfolio.find();

  if (params.user) {
    query.where({ user: params.user });
  }

  return query.exec();
};
