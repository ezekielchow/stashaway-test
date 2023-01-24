const { DepositPlan } = require('../models/deposit-plan');
const { UserDeposit } = require('../models/user-deposit');

module.exports.deposit = async (user, depositPlans, userDeposits) => {
  try {
    let savedDepositPlans = [];
    let savedUserDeposits = [];

    depositPlans.forEach(async (depositPlan) => {
      const depositPlanToSave = new DepositPlan({
        user: user._id,
        type: depositPlan.type,
        allocations: depositPlan.allocations,
      });

      savedDepositPlans = [...savedDepositPlans, await depositPlanToSave.save()];
    });

    userDeposits.forEach(async (userDeposit) => {
      const userDepositToSave = new UserDeposit({
        amount: userDeposit,
        depositedAt: new Date(),
      });

      savedUserDeposits = [...savedUserDeposits, await userDepositToSave.save()];
    });
  } catch (error) {
    throw new Error(error);
  }

  return null;
};
