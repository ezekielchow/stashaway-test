const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  referenceCode: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports.User = mongoose.model('User', userSchema);
