import express from 'express';
import apiRouter from '../../api/routes/api.js';
import User from '../../api/models/users.js';
import { generateToken } from '../../api/utils/jwt.js';
import { __setResendForTests, __resetResendForTests } from '../../api/utils/email.js';

export const createTestApp = () => {
  const app = express();

  app.set('io', {
    to: () => ({
      emit: () => {},
    }),
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', apiRouter);

  return app;
};

export const seedResendMock = () => {
  __setResendForTests({
    emails: {
      send: async () => ({ data: { id: 'test-email-id' }, error: null }),
    },
  });
};

export const resetResendMock = () => {
  __resetResendForTests();
};

export const createUser = async (overrides = {}) => {
  const defaults = {
    firstName: 'Ana',
    lastName: 'Novak',
    username: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    email: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
    password: 'password123',
    birthday: new Date('1995-05-10'),
    termsAccepted: true,
    status: 'active',
    role: 'user',
    activeSearch: true,
    isActive: true,
    accountSecurity: { emailVerified: true },
  };

  const user = await User.create({ ...defaults, ...overrides });
  return user;
};

export const createAdmin = async (overrides = {}) => {
  const admin = await createUser({
    role: 'admin',
    status: 'active',
    accountSecurity: { emailVerified: true },
    ...overrides,
  });

  return admin;
};

export const authHeaderFor = (user) => {
  const token = generateToken(user);
  return { Authorization: `Bearer ${token}` };
};
