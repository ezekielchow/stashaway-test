const { connection } = require('./database');
const { DepositPlan } = require('../models/deposit-plan');
const { UserDeposit } = require('../models/user-deposit');

module.exports.deposit = async (user, depositPlans, userDeposits) => {
  const session = await connection.startSession();
  console.log(session);
  try {
    let savedDepositPlans = [];
    let savedUserDeposits = [];

    session.startTransaction();

    depositPlans.forEach(async (depositPlan) => {
      const depositPlanToSave = new DepositPlan({
        user: user._id,
        type: depositPlan.type,
        allocations: depositPlan.allocations,
      });

      savedDepositPlans = [...savedDepositPlans, await depositPlanToSave.save({ session })];
    });
    throw Error('asd');
    userDeposits.forEach(async (userDeposit) => {
      const userDepositToSave = new UserDeposit({
        amount: userDeposit,
        depositedAt: new Date(),
      });

      savedUserDeposits = [...savedUserDeposits, await userDepositToSave.save({ session })];
    });
    await session.commitTransaction();
  } catch (error) {
    console.log('came in here what');
    await session.abortTransaction();
  }

  session.endSession();

  return null;
};
