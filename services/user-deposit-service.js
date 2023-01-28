const { DepositPlan, TYPES } = require('../dist/models/deposit-plan');
const { UserDeposit } = require('../dist/models/user-deposit');
const { UserDepositDistribution } = require('../dist/models/user-deposit-distribution');

const distributeFunds = (userDeposit, depositPlans) => {
  const userDepositAllocations = [];
  const distributedAllocations = {};

  // Move one time plan to the front
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

    // Used for when balance is insufficient
    const depositBalanceClone = depositBalance;

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

        distributedAllocations[allocation.portfolio] += parseFloat(allocation.amount);
      }
    } else {
      // Handle plan having lesser balance than all allocations

      // Get percentage for allocations
      for (let i = 0; i < depositPlan.allocations.length; i += 1) {
        const allocation = depositPlan.allocations[i];

        const percentage = (allocation.amount / allocationsTotal);

        const oldAmount = Object.prototype.hasOwnProperty
          .call(distributedAllocations, allocation.portfolio)
          ? distributedAllocations[allocation.portfolio] : 0;

        if (oldAmount === 0) {
          distributedAllocations[allocation.portfolio] = 0;
        }

        const amountToAllocate = parseFloat((depositBalanceClone * percentage).toFixed(2));
        depositBalance -= amountToAllocate;

        distributedAllocations[allocation.portfolio]
          += amountToAllocate;
      }
    }
  });

  if (depositBalance > 0) {
    const cloneDepositBalance = depositBalance;

    // Handle extra balance from deposit. Divide accordingly to deposit plans
    const depositPlansTotal = depositPlans.reduce((accumulator, depositPlan) => accumulator
      + depositPlan.allocations
        .reduce((accumulatorII, allocation) => accumulatorII + allocation.amount, 0), 0);

    depositPlans.forEach((depositPlan) => {
      const allocationsTotal = depositPlan.allocations
        .reduce((accumulator, allocation) => accumulator + allocation.amount, 0);

      const amountForPlan = ((allocationsTotal / depositPlansTotal) * cloneDepositBalance)
        .toFixed(2);

      for (let i = 0; i < depositPlan.allocations.length; i += 1) {
        const allocation = depositPlan.allocations[i];

        const percentage = (allocation.amount / allocationsTotal);

        const oldAmount = Object.prototype.hasOwnProperty
          .call(distributedAllocations, allocation.portfolio)
          ? distributedAllocations[allocation.portfolio] : 0;

        if (oldAmount === 0) {
          distributedAllocations[allocation.portfolio] = 0;
        }

        const amountToAllocate = parseFloat((amountForPlan * percentage).toFixed(2));

        depositBalance -= amountToAllocate;
        depositBalance = parseFloat(depositBalance.toFixed(2));

        distributedAllocations[allocation.portfolio]
          += amountToAllocate;
      }
    });
  }

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

const deposit = async (user, depositPlans, userDeposits) => {
  try {
    let savedDepositPlans = [];
    let savedUserDeposits = [];

    // Clear up for new scenario
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

    // Main function here
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

    return userDepositDistribution.save();
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  deposit,
  distributeFunds,
};
