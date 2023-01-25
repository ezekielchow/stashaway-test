const { body, validationResult } = require('express-validator');

const { User } = require('../models/user');
const { Portfolio, find } = require('../models/porfolio');

exports.list = async (req, res) => {
  try {
    return res.json({ data: await find(req.query) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
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

    const portfolio = new Portfolio({
      user: req.body.user,
      name: req.body.name,
    });

    await portfolio.save();

    return res.json({ data: portfolio });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.validate = (method) => {
  switch (method) {
    case 'create': {
      return [
        body('user').not().isEmpty()
          .trim()
          .escape(),
        body('name').not().isEmpty().isLength({ min: 1, max: 128 })
          .trim()
          .escape(),
      ];
    }
    default: return [];
  }
};
