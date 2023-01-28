const { Portfolio } = require('../dist/models/porfolio');
const { DepositPlan } = require('../dist/models/deposit-plan');
const { UserDeposit } = require('../dist/models/user-deposit');
const { User } = require('../dist/models/user');
const { UserDepositDistribution } = require('../dist/models/user-deposit-distribution');

module.exports = {
  Portfolio,
  DepositPlan,
  UserDeposit,
  User,
  UserDepositDistribution,
};
