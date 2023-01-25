const { MongoMemoryServer } = require('mongodb-memory-server');
const { mongoose } = require('mongoose');

require('dotenv').config({ path: '.env.test' });

describe('MongodbMemoryServer init', () => {
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

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    collections.forEach(async (collection) => {
      await collection.deleteMany();
    });
  });

  afterAll(async () => {
    if (mongod) {
      await mongod.stop();
    }

    if (mongoose.connection) {
      await mongoose.connection.close();
    }
  });

  it('should connection successful', async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
