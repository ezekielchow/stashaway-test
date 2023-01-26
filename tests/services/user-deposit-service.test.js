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
      if (distributedFund.portfolio === portfolioA.toString()) {
        expect(distributedFund.distributedAmount).toBe(10001);
      }

      if (distributedFund.portfolio === portfolioB.toString()) {
        expect(distributedFund.distributedAmount).toBe(600);
      }
    });
  });

  /*
  Total Amount: 11500
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
              "amount": 1500
          },
          {
              "portfolio": "63cf91676e3bd7a696526ee4",
              "amount": 500
          }
      ]
    }
  ]
  */

  it('distribute funds using ratio between portfolios when deposit is inadequate', async () => {
    const user = new mongoose.Types.ObjectId();
    const portfolioA = new mongoose.Types.ObjectId();
    const portfolioB = new mongoose.Types.ObjectId();

    const depositPlans = [
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
      new DepositPlan({
        user,
        type: TYPES.MONTHLY,
        allocations: [
          {
            portfolio: portfolioA,
            amount: 1500,
          },
          {
            portfolio: portfolioB,
            amount: 500,
          },
        ],
      }),
    ];

    const distributedFunds = await distributeFunds(11500, depositPlans);

    distributedFunds.forEach((distributedFund) => {
      if (distributedFund.portfolio === portfolioA.toString()) {
        expect(distributedFund.distributedAmount).toBe(10750);
      }

      if (distributedFund.portfolio === portfolioB.toString()) {
        expect(distributedFund.distributedAmount).toBe(750);
      }
    });
  });

  /*
  Total Amount: 13500
  Deposit Plans: [
    { //840, assigned based on plans percentage
      "type": "one-time",
      "allocations": [
          {
              "portfolio": "63cf91566e3bd7a696526ee1",
              "amount": 10000,
              //800, balance deposit amount
          },
          {
              "portfolio": "63cf91676e3bd7a696526ee4",
              "amount": 500
              //40, balance deposit amount
          }
      ]
    },
    {
      //160, assigned based on plans percentage
      "type": "monthly",
      "allocations": [
          {
              "portfolio": "63cf91566e3bd7a696526ee1",
              "amount": 1500
              //120, balance deposit amount
          },
          {
              "portfolio": "63cf91676e3bd7a696526ee4",
              "amount": 500
              //40, balance deposit amount
          }
      ]
    }
  ]
  */

  it('distribute funds using ratio between deposit plans & portfolios when deposit has excess after first round', async () => {
    const user = new mongoose.Types.ObjectId();
    const portfolioA = new mongoose.Types.ObjectId();
    const portfolioB = new mongoose.Types.ObjectId();

    const depositPlans = [
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
      new DepositPlan({
        user,
        type: TYPES.MONTHLY,
        allocations: [
          {
            portfolio: portfolioA,
            amount: 1500,
          },
          {
            portfolio: portfolioB,
            amount: 500,
          },
        ],
      }),
    ];

    const distributedFunds = await distributeFunds(13500, depositPlans);

    distributedFunds.forEach((distributedFund) => {
      if (distributedFund.portfolio === portfolioA.toString()) {
        expect(distributedFund.distributedAmount).toBe(12420);
      }

      if (distributedFund.portfolio === portfolioB.toString()) {
        expect(distributedFund.distributedAmount).toBe(1080);
      }
    });
  });
});
