const { body, validationResult } = require('express-validator');

const { User } = require('../models/user');
const validators = require('../helpers/validators');
const { generateUniqueReferenceCode } = require('../helpers/string');

exports.list = async (req, res) => {
  try {
    return res.json({ data: await User.find() });
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

    const uniqueReferenceCode = await generateUniqueReferenceCode();

    const user = new User({
      email: req.body.email,
      referenceCode: uniqueReferenceCode,
    });

    await user.save();

    return res.json({ data: user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.validate = (method) => {
  switch (method) {
    case 'create': {
      return [
        body('email').not().isEmpty().isEmail()
          .withMessage('Invalid Email')
          .normalizeEmail()
          .custom(validators.emailIsUnique)
          .trim()
          .escape(),
      ];
    }
    default: return [];
  }
};
