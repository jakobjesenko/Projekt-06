import assert from 'assert';
import request from 'supertest';
import { createTestApp, createUser, createAdmin, authHeaderFor } from './helpers.js';

const app = createTestApp();

describe('Suggestions integration', () => {
  it('returns empty list when activeSearch is false', async () => {
    const user = await createUser({ activeSearch: false });

    const res = await request(app)
      .get(`/api/suggestions/${user._id}`);

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body.length, 0);
  });

  it('returns suggestions for active user', async () => {
    const user = await createUser({
      activeSearch: true,
      interests: ['kava', 'glasba'],
      availability: ['Pon__morning'],
      location: { lat: 46.05, lng: 14.5, radius: 10 },
    });

    await createUser({
      activeSearch: true,
      interests: ['kava'],
      availability: ['Pon__morning'],
      location: { lat: 46.051, lng: 14.501, radius: 10 },
    });

    const res = await request(app)
      .get(`/api/suggestions/${user._id}`);

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  it('returns empty list when no candidates exist', async () => {
    const user = await createUser({
      activeSearch: true,
      interests: ['kava'],
      availability: ['Pon__morning'],
      location: { lat: 46.05, lng: 14.5, radius: 10 },
    });

    const res = await request(app)
      .get(`/api/suggestions/${user._id}`);

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body.length, 0);
  });

  it('returns 404 for suggestions when user is missing', async () => {
    const missingId = '68012345bcf86cd799439011';

    const res = await request(app)
      .get(`/api/suggestions/${missingId}`);

    assert.strictEqual(res.status, 404);
  });

  it('gets suggestion config as admin', async () => {
    const admin = await createAdmin();

    const res = await request(app)
      .get('/api/suggestions/config')
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects suggestion config fetch without auth', async () => {
    const res = await request(app)
      .get('/api/suggestions/config');

    assert.strictEqual(res.status, 401);
  });

  it('rejects suggestion config fetch for non-admin', async () => {
    const user = await createUser();

    const res = await request(app)
      .get('/api/suggestions/config')
      .set(authHeaderFor(user));

    assert.strictEqual(res.status, 401);
  });

  it('updates suggestion config as admin', async () => {
    const admin = await createAdmin();

    const res = await request(app)
      .put('/api/suggestions/config')
      .set(authHeaderFor(admin))
      .send({ weights: { interests: 0.6, geo: 0.2, time: 0.2 } });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects suggestion config update without auth', async () => {
    const res = await request(app)
      .put('/api/suggestions/config')
      .send({ weights: { interests: 0.6, geo: 0.2, time: 0.2 } });

    assert.strictEqual(res.status, 401);
  });

  it('rejects suggestion config update for non-admin', async () => {
    const user = await createUser();

    const res = await request(app)
      .put('/api/suggestions/config')
      .set(authHeaderFor(user))
      .send({ weights: { interests: 0.6, geo: 0.2, time: 0.2 } });

    assert.strictEqual(res.status, 401);
  });

  it('rejects suggestion config update with invalid payload', async () => {
    const admin = await createAdmin();

    const res = await request(app)
      .put('/api/suggestions/config')
      .set(authHeaderFor(admin))
      .send({});

    assert.strictEqual(res.status, 400);
  });

  it('rejects suggestion config update with out-of-range weights', async () => {
    const admin = await createAdmin();

    const res = await request(app)
      .put('/api/suggestions/config')
      .set(authHeaderFor(admin))
      .send({ weights: { interests: 2, geo: 0, time: -1 } });

    assert.strictEqual(res.status, 400);
  });

  it('rejects suggestion config update when sum is zero', async () => {
    const admin = await createAdmin();

    const res = await request(app)
      .put('/api/suggestions/config')
      .set(authHeaderFor(admin))
      .send({ weights: { interests: 0, geo: 0, time: 0 } });

    assert.strictEqual(res.status, 400);
  });
});
