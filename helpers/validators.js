const moment = require('moment');

const { User } = require('../dist/models/user');

exports.passwordConfirmation = (value, { req }) => {
  if (req.body.password !== req.body.passwordRepeat) {
    throw new Error('Password confirmation does not match password');
  }

  return true;
};

exports.emailIsUnique = (value) => User.findOne({ email: value }).then((user) => {
  if (user) {
    throw new Error('E-mail already in use');
  }

  return true;
});

exports.isDatetime = (value) => {
  if (!moment(value).isValid()) {
    throw new Error('Not a valid date');
  }

  return true;
};
