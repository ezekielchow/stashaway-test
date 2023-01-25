const { body, validationResult } = require('express-validator');

const { User } = require('../models/user');
const { TYPES } = require('../models/deposit-plan');
const { Portfolio } = require('../models/porfolio');
const { deposit } = require('../services/user-deposit-service');

exports.deposit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.errors.map((el) => `${el.param}:${el.msg}\n`);
      return res.status(500).json({ error: errorMessages });
    }

    const exists = await User.exists({
      _id: req.body.user,
    });

    if (!exists) {
      throw new Error('User doesn\'t exist');
    }

    for (let i = 0; i < req.body.depositPlans.length; i += 1) {
      const depositPlan = req.body.depositPlans[i];

      for (let ii = 0; ii < depositPlan.allocations.length; ii += 1) {
        const allocation = depositPlan.allocations[ii];
        const { portfolio } = allocation;
        /* eslint-disable no-await-in-loop */
        if (!await Portfolio.exists({ _id: portfolio })) {
          throw new Error('Portfolio doesn\'t exist');
        }
        /* eslint-enable no-await-in-loop */
      }
    }

    const user = await User.findById(req.body.user);
    const allocatedFunds = await deposit(user, req.body.depositPlans, req.body.deposits);

    return res.json({ data: allocatedFunds });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.validate = (method) => {
  switch (method) {
    case 'deposit': {
      return [
        body('user').not().isEmpty()
          .trim()
          .escape(),
        body('depositPlans').not().isEmpty().withMessage('Deposit plan is needed'),
        body('depositPlans').isArray({ max: 2 }).withMessage('Maximum 2 deposit plans'),
        body('depositPlans.*.type').not().isEmpty().isIn(Object.values(TYPES))
          .withMessage('Deposit plans only of one-time or monthly'),
        body('depositPlans.*.allocations').not().isEmpty().withMessage('Deposit plan allocations are needed'),
        body('depositPlans.*.allocations.*.portfolio').not().isEmpty().withMessage('Deposit plan must have allocation to portfolio'),
        body('depositPlans.*.allocations.*.amount').not().isEmpty().isFloat({ min: 1 })
          .withMessage('Deposit plan must have allocation amount where is one and above'),
        body('deposits').not().isEmpty().withMessage('Must have deposits'),
        body('deposits.*').not().isEmpty().isFloat({ min: 1 })
          .withMessage('Deposits must be a number one and above'),
      ];
    }
    default: return [];
  }
};
