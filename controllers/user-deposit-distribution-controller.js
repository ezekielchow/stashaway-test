const { UserDepositDistribution } = require('../models');

exports.distributions = async (req, res) => {
  try {
    return res.json({ data: UserDepositDistribution.find({ user: req.params.userId }) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
