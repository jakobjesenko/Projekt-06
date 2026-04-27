import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

before(async () => {
  // Nastavi environment na test
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.SESSION_SECRET = 'test-session-secret';

  // Zaženi in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Poveži mongoose na testno bazo
  await mongoose.connect(uri);

  // Importaj modele ročno (ker db.js preskočimo)
  await import('../api/models/users.js');
  await import('../api/models/meetings.js');
  await import('../api/models/ratings.js');
  await import('../api/models/messages.js');
  await import('../api/models/contacts.js');
  await import('../api/models/analytics.js');
  await import('../api/models/reports.js');
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Počisti vse kolekcije med testi da so neodvisni
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});