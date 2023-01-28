import { DepositPlan, TYPES } from '../models/deposit-plan';
import { UserDeposit } from '../models/user-deposit';
import { UserDepositDistribution } from '../models/user-deposit-distribution';

import { IDepositPlan } from "../models/deposit-plan";
import { IUser } from "../models/user";

export const distributeFunds = (userDeposit: number, depositPlans: Array<IDepositPlan>) => {
  const userDepositAllocations = [];
  const distributedAllocations: Record<string, number> = {};

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
          .call(distributedAllocations, allocation.portfolio.toString())
          ? distributedAllocations[allocation.portfolio.toString()] : 0;

        if (oldAmount === 0) {
          distributedAllocations[allocation.portfolio.toString()] = 0;
        }

        distributedAllocations[allocation.portfolio.toString()] += allocation.amount;
      }
    } else {
      // Handle plan having lesser balance than all allocations

      // Get percentage for allocations
      for (let i = 0; i < depositPlan.allocations.length; i += 1) {
        const allocation = depositPlan.allocations[i];

        const percentage = (allocation.amount / allocationsTotal);

        const oldAmount = Object.prototype.hasOwnProperty
          .call(distributedAllocations, allocation.portfolio.toString())
          ? distributedAllocations[allocation.portfolio.toString()] : 0;

        if (oldAmount === 0) {
          distributedAllocations[allocation.portfolio.toString()] = 0;
        }

        const amountToAllocate = parseFloat((depositBalanceClone * percentage).toFixed(2));
        depositBalance -= amountToAllocate;

        distributedAllocations[allocation.portfolio.toString()]
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

      const amountForPlan: number = parseFloat(((allocationsTotal / depositPlansTotal) * cloneDepositBalance)
        .toFixed(2));

      for (let i = 0; i < depositPlan.allocations.length; i += 1) {
        const allocation = depositPlan.allocations[i];

        const percentage = (allocation.amount / allocationsTotal);

        const oldAmount = Object.prototype.hasOwnProperty
          .call(distributedAllocations, allocation.portfolio.toString())
          ? distributedAllocations[allocation.portfolio.toString()] : 0;

        if (oldAmount === 0) {
          distributedAllocations[allocation.portfolio.toString()] = 0;
        }

        const amountToAllocate = parseFloat((amountForPlan * percentage).toFixed(2));

        depositBalance -= amountToAllocate;
        depositBalance = parseFloat(depositBalance.toFixed(2));

        distributedAllocations[allocation.portfolio.toString()]
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

interface AllocationInput {
  portfolio: string,
  amount: number
}

interface DepositPlansInput {
  type: string,
  allocations: Array<AllocationInput>
}

export const deposit = async (user: IUser, depositPlans: Array<DepositPlansInput>, userDeposits: Array<number>) => {
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

    savedUserDeposits = await Promise.all(userDeposits.map(async (userDeposit: number) => {
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
  } catch (error: any) {
    throw new Error(error);
  }
};
