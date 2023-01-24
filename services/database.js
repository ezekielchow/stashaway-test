const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL;

mongoose.set('strictQuery', false);

mongoose.connect(`mongodb://${mongoUrl}`)
  .then(() => {
    console.log('Mongodb: Successfully connected');
  })
  .catch((err) => {
    console.log('Mongodb:', err);
  });
