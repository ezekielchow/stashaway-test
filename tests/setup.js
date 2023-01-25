const { MongoMemoryServer } = require('mongodb-memory-server');
const { mongoose } = require('mongoose');

require('dotenv').config({ path: '.env.test' });

let mongod;
const dbName = 'stashawayTestDb';

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const mongoUri = mongod.getUri();

  await mongoose.connect(mongoUri, {
    dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  if (mongoose.connection) {
    await mongoose.connection.close();
  }

  if (mongod) {
    await mongod.stop();
  }
});
