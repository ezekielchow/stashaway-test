const User = require('../models/user');

exports.generateUniqueReferenceCode = async function generateUniqueReferenceCode() {
  let exists = true;
  let newAlphanumeric;

  while (exists) {
    newAlphanumeric = Math.random().toString(36).slice(2);
    /* eslint-disable no-await-in-loop */
    const dbExists = await User.exists({
      referenceCode: newAlphanumeric,
    });
    /* eslint-enable no-await-in-loop */

    if (!dbExists) {
      exists = false;
    }
  }

  return newAlphanumeric;
};
