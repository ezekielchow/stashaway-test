const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports.Portfolio = Portfolio;

module.exports.find = async (params) => {
  const query = Portfolio.find();

  if (params.user) {
    query.where({ user: params.user });
  }

  return query.exec();
};
