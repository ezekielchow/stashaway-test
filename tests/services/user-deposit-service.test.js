const mongoose = require('mongoose');

const { distributeFunds } = require('../../services/user-deposit-service');
const { TYPES, DepositPlan } = require('../../models/deposit-plan');

describe('user deposit allocation', () => {
  /*
  Total Amount: 10601
  Deposit Plans: [
    {
      "type": "one-time",
      "allocations": [
          {
              "portfolio": "63cf91566e3bd7a696526ee1",
              "amount": 10000
          },
          {
              "portfolio": "63cf91676e3bd7a696526ee4",
              "amount": 500
          }
      ]
    },
    {
      "type": "monthly",
      "allocations": [
          {
              "portfolio": "63cf91566e3bd7a696526ee1",
              "amount": 1
          },
          {
              "portfolio": "63cf91676e3bd7a696526ee4",
              "amount": 100
          }
      ]
    }
  ]
  */

  it('distribute funds across allocations when deposit has no excess & inadequate', async () => {
    const user = new mongoose.Types.ObjectId();
    const portfolioA = new mongoose.Types.ObjectId();
    const portfolioB = new mongoose.Types.ObjectId();

    const depositPlans = [
      new DepositPlan({
        user,
        type: TYPES.MONTHLY,
        allocations: [
          {
            portfolio: portfolioB,
            amount: 100,
          },
          {
            portfolio: portfolioA,
            amount: 1,
          },
        ],
      }),
      new DepositPlan({
        user,
        type: TYPES.ONE_TIME,
        allocations: [
          {
            portfolio: portfolioA,
            amount: 10000,
          },
          {
            portfolio: portfolioB,
            amount: 500,
          },
        ],
      }),
    ];

    const distributedFunds = await distributeFunds(10601, depositPlans);

    distributedFunds.forEach((distributedFund) => {
      if (distributedFund.portfolio === portfolioA) {
        expect(distributedFund.distributedAmount).toBe(10001);
      }

      if (distributedFund.portfolio === portfolioB) {
        expect(distributedFund.distributedAmount).toBe(600);
      }
    });
  });
});
