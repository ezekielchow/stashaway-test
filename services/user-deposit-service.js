const { DepositPlan, TYPES } = require('../models/deposit-plan');
const { UserDeposit } = require('../models/user-deposit');
const { UserDepositDistribution } = require('../models/user-deposit-distribution');

const distributeFunds = (userDeposit, depositPlans) => {
  const userDepositAllocations = [];
  const distributedAllocations = {};

  depositPlans.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === TYPES.ONE_TIME ? -1 : 1;
    }

    return 0;
  });

  let depositBalance = userDeposit;

  depositPlans.forEach((depositPlan) => {
    if (depositBalance === 0) {
      return;
    }

    const allocationsTotal = depositPlan.allocations
      .reduce((accumulator, allocation) => accumulator + allocation.amount, 0);

    // Just allocate as planned
    if (depositBalance >= allocationsTotal) {
      for (let i = 0; i < depositPlan.allocations.length; i += 1) {
        const allocation = depositPlan.allocations[i];

        depositBalance -= allocation.amount;

        const oldAmount = Object.prototype.hasOwnProperty
          .call(distributedAllocations, allocation.portfolio)
          ? distributedAllocations[allocation.portfolio] : 0;

        if (oldAmount === 0) {
          distributedAllocations[allocation.portfolio] = 0;
        }

        distributedAllocations[allocation.portfolio] += allocation.amount;
      }
    }

    // Handle plan having lesser balance than all allocations
  });

  // Handle extra balance from deposit

  // Save distribution for future referencing
  const portfolioIds = Object.keys(distributedAllocations);

  for (let i = 0; i < portfolioIds.length; i += 1) {
    const portfolioId = portfolioIds[i];

    userDepositAllocations.push({
      portfolio: portfolioId,
      distributedAmount: distributedAllocations[portfolioId],
    });
  }

  return userDepositAllocations;
};

module.exports.deposit = async (user, depositPlans, userDeposits) => {
  try {
    let savedDepositPlans = [];
    let savedUserDeposits = [];

    await DepositPlan.deleteMany({ user: user._id });

    savedDepositPlans = await Promise.all(depositPlans.map(async (depositPlan) => {
      const depositPlanToSave = new DepositPlan({
        user: user._id,
        type: depositPlan.type,
        allocations: depositPlan.allocations,
      });

      return depositPlanToSave.save();
    }));

    savedUserDeposits = await Promise.all(userDeposits.map(async (userDeposit) => {
      const userDepositToSave = new UserDeposit({
        amount: userDeposit,
        depositedAt: new Date(),
      });

      return userDepositToSave.save();
    }));

    const totalAmount = savedUserDeposits
      .reduce((accumulator, userDeposit) => accumulator + userDeposit.amount, 0);

    const userDepositAllocations = await distributeFunds(
      totalAmount,
      savedDepositPlans,
    );

    await UserDepositDistribution.deleteMany({ user: user._id });

    const userDepositDistribution = new UserDepositDistribution({
      user: user._id,
      amount: totalAmount,
      allocations: userDepositAllocations,
    });

    await userDepositDistribution.save();
  } catch (error) {
    throw new Error(error);
  }

  return null;
};
