import assert from 'assert';
import request from 'supertest';
import User from '../../api/models/users.js';
import { createTestApp, seedResendMock, resetResendMock, createUser } from './helpers.js';

const app = createTestApp();

describe('Auth integration', () => {
  beforeEach(() => {
    seedResendMock();
  });

  afterEach(() => {
    resetResendMock();
  });

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@test.com',
        username: 'new_user',
        password: 'password123',
        firstName: 'Nina',
        lastName: 'Test',
        birthday: '1995-05-10',
        terms: true,
        interests: ['kava', 'tek'],
        availability: ['Pon__morning'],
        locationLat: 46.05,
        locationLng: 14.50,
        locationRadius: 10,
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.email, 'newuser@test.com');
  });

  it('rejects register with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'missing@test.com' });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('rejects register with invalid birthday', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'badbday@test.com',
        username: 'bad_bday',
        password: 'password123',
        firstName: 'Nina',
        lastName: 'Test',
        birthday: 'not-a-date',
        terms: true,
        interests: ['kava'],
        availability: ['Pon__morning'],
        locationLat: 46.05,
        locationLng: 14.50,
        locationRadius: 10,
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('rejects register for underage user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'underage@test.com',
        username: 'underage_user',
        password: 'password123',
        firstName: 'Nina',
        lastName: 'Test',
        birthday: '2010-01-01',
        terms: true,
        interests: ['kava'],
        availability: ['Pon__morning'],
        locationLat: 46.05,
        locationLng: 14.50,
        locationRadius: 10,
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('rejects register with duplicate email', async () => {
    await createUser({ email: 'dup@test.com', username: 'dup_user' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'dup@test.com',
        username: 'dup_user2',
        password: 'password123',
        firstName: 'Nina',
        lastName: 'Test',
        birthday: '1995-05-10',
        terms: true,
        interests: ['kava'],
        availability: ['Pon__morning'],
        locationLat: 46.05,
        locationLng: 14.50,
        locationRadius: 10,
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('rejects register with duplicate username', async () => {
    await createUser({ email: 'dupname@test.com', username: 'dup_name' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'dupname2@test.com',
        username: 'dup_name',
        password: 'password123',
        firstName: 'Nina',
        lastName: 'Test',
        birthday: '1995-05-10',
        terms: true,
        interests: ['kava'],
        availability: ['Pon__morning'],
        locationLat: 46.05,
        locationLng: 14.50,
        locationRadius: 10,
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('logs in active user', async () => {
    await createUser({
      email: 'login@test.com',
      username: 'login_user',
      password: 'password123',
      status: 'active',
      accountSecurity: { emailVerified: true },
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'password123' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
  });

  it('rejects login with missing credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('rejects login with wrong password', async () => {
    await createUser({
      email: 'wrongpass@test.com',
      username: 'wrongpass_user',
      password: 'password123',
      status: 'active',
      accountSecurity: { emailVerified: true },
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrongpass@test.com', password: 'wrongpass' });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('blocks login for pending user', async () => {
    await createUser({
      email: 'pending@test.com',
      username: 'pending_user',
      password: 'password123',
      status: 'pending',
      accountSecurity: { emailVerified: false },
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'pending@test.com', password: 'password123' });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
  });

  it('verifies email with valid token', async () => {
    const user = await createUser({
      status: 'pending',
      accountSecurity: {
        emailVerified: false,
        emailVerificationToken: 'token123',
        emailVerificationExpires: Date.now() + 3600000,
      },
    });

    const res = await request(app)
      .get('/api/auth/verify-email')
      .query({ token: 'token123' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    const updated = await User.findById(user._id);
    assert.strictEqual(updated.status, 'active');
  });

  it('rejects verify email without token', async () => {
    const res = await request(app)
      .get('/api/auth/verify-email');

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('rejects verify email with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/verify-email')
      .query({ token: 'invalid' });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('resends verification email for pending user', async () => {
    await createUser({
      email: 'resend@test.com',
      status: 'pending',
      accountSecurity: { emailVerified: false },
    });

    const res = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email: 'resend@test.com' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects resend verification without email', async () => {
    const res = await request(app)
      .post('/api/auth/resend-verification')
      .send({});

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('rejects resend verification for missing user', async () => {
    const res = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email: 'missing@test.com' });

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
  });

  it('rejects resend verification for active user', async () => {
    await createUser({ email: 'active@test.com', status: 'active' });

    const res = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email: 'active@test.com' });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('sends forgot password email for existing user', async () => {
    await createUser({ email: 'forgot@test.com' });

    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'forgot@test.com' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects forgot password for missing user', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'missing@test.com' });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('rejects forgot password without email', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({});

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('resets password with valid token', async () => {
    const user = await createUser({
      email: 'reset@test.com',
      accountSecurity: {
        emailVerified: true,
        passwordResetToken: 'reset123',
        passwordResetExpires: Date.now() + 3600000,
      },
    });

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'reset123', newPassword: 'newPass123' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    const updated = await User.findById(user._id).select('+password');
    assert.ok(updated);
  });

  it('rejects reset password with invalid token', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'invalid', newPassword: 'newPass123' });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('rejects reset password with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'reset123' });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('logs out successfully', async () => {
    const res = await request(app)
      .post('/api/auth/logout');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });
});
