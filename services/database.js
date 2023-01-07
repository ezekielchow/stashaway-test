const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://mongo:27017/stashawayDB?replicaSet=rs0')
  .then(() => {
    console.log('Mongodb: Successfully connected');
  })
  .catch((err) => {
    console.log('Mongodb:', err);
  });

module.exports.connection = mongoose.connection;
