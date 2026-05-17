import assert from 'assert';
import request from 'supertest';
import { createTestApp, createAdmin, createUser, authHeaderFor } from './helpers.js';

const app = createTestApp();

describe('DB integration', () => {
  it('rejects reset without auth', async () => {
    const res = await request(app)
      .post('/api/db/reset');

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('allows reset for admin', async () => {
    const admin = await createAdmin();

    const res = await request(app)
      .post('/api/db/reset')
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects reset for non-admin user', async () => {
    const user = await createUser();

    const res = await request(app)
      .post('/api/db/reset')
      .set(authHeaderFor(user));

    assert.strictEqual(res.status, 401);
  });
});
