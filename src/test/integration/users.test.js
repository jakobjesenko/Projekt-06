import assert from 'assert';
import request from 'supertest';
import User from '../../api/models/users.js';
import { authHeaderFor, createAdmin, createTestApp, createUser } from './helpers.js';

const app = createTestApp();

describe('Users integration', () => {
  it('returns paginated users list', async () => {
    await createUser({ email: 'list1@test.com', username: 'list1' });
    await createUser({ email: 'list2@test.com', username: 'list2' });

    const res = await request(app)
      .get('/api/users/admin?page=1&limit=1');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.length, 1);
    assert.strictEqual(res.body.pagination.page, 1);
  });

  it('updates user profile', async () => {
    const user = await createUser({
      email: 'profile@test.com',
      username: 'profile_user',
    });

    const res = await request(app)
      .put(`/api/users/profile/${user._id}`)
      .send({
        firstName: 'Updated',
        lastName: 'User',
        username: 'updated_user',
        birthday: '1992-05-10',
        email: 'profile@test.com',
        interests: ['kava'],
        availability: ['Pon__morning'],
        location: { lat: 46.05, lng: 14.5, radius: 10 },
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.username, 'updated_user');
  });

  it('rejects profile update with invalid birthday', async () => {
    const user = await createUser({
      email: 'profilebad@test.com',
      username: 'profile_bad',
    });

    const res = await request(app)
      .put(`/api/users/profile/${user._id}`)
      .send({
        firstName: 'Updated',
        lastName: 'User',
        username: 'profile_bad',
        birthday: 'not-a-date',
        email: 'profilebad@test.com',
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('returns 404 for profile update on missing user', async () => {
    const missingId = new User()._id;

    const res = await request(app)
      .put(`/api/users/profile/${missingId}`)
      .send({
        firstName: 'Updated',
        lastName: 'User',
        username: 'missing_user',
        birthday: '1992-05-10',
        email: 'missing@test.com',
      });

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
  });

  it('deactivates and activates user', async () => {
    const user = await createUser({
      email: 'toggle@test.com',
      username: 'toggle_user',
    });

    const deactivate = await request(app)
      .put(`/api/users/admin/${user._id}/deactivate`)
      .send({});

    assert.strictEqual(deactivate.status, 200);
    assert.strictEqual(deactivate.body.success, true);

    const activate = await request(app)
      .put(`/api/users/admin/${user._id}/activate`)
      .send({});

    assert.strictEqual(activate.status, 200);
    assert.strictEqual(activate.body.success, true);
  });

  it('updates user status', async () => {
    const user = await createUser({
      email: 'status@test.com',
      username: 'status_user',
    });

    const res = await request(app)
      .put(`/api/users/admin/status/${user._id}`)
      .send({ status: 'blocked' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects invalid status update', async () => {
    const user = await createUser({
      email: 'badstatus@test.com',
      username: 'badstatus_user',
    });

    const res = await request(app)
      .put(`/api/users/admin/status/${user._id}`)
      .send({ status: 'invalid' });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('returns 404 for status update on missing user', async () => {
    const missingId = new User()._id;

    const res = await request(app)
      .put(`/api/users/admin/status/${missingId}`)
      .send({ status: 'blocked' });

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
  });

  it('adds strike and reads strike count', async () => {
    const user = await createUser({
      email: 'strikes@test.com',
      username: 'strikes_user',
    });

    const addStrike = await request(app)
      .post(`/api/users/admin/strikes/${user._id}`)
      .send({});

    assert.strictEqual(addStrike.status, 200);
    assert.strictEqual(addStrike.body.success, true);

    const getStrikes = await request(app)
      .get(`/api/users/admin/strikes/${user._id}`);

    assert.strictEqual(getStrikes.status, 200);
    assert.strictEqual(getStrikes.body.success, true);
  });

  it('rejects strike add when user has max strikes', async () => {
    const user = await createUser({
      email: 'maxstrike@test.com',
      username: 'max_strike',
      strikes: 3,
    });

    const res = await request(app)
      .post(`/api/users/admin/strikes/${user._id}`)
      .send({});

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('returns 404 when adding strike to missing user', async () => {
    const missingId = new User()._id;

    const res = await request(app)
      .post(`/api/users/admin/strikes/${missingId}`)
      .send({});

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
  });

  it('returns 404 when reading strikes for missing user', async () => {
    const missingId = new User()._id;

    const res = await request(app)
      .get(`/api/users/admin/strikes/${missingId}`);

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
  });

  it('updates strike count', async () => {
    const user = await createUser({
      email: 'strikeupdate@test.com',
      username: 'strikeupdate_user',
    });

    const res = await request(app)
      .put(`/api/users/admin/strikes/${user._id}`)
      .send({ strikes: 2 });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.strikes, 2);
  });

  it('rejects strike update with invalid value', async () => {
    const user = await createUser({
      email: 'badstrike@test.com',
      username: 'badstrike_user',
    });

    const res = await request(app)
      .put(`/api/users/admin/strikes/${user._id}`)
      .send({ strikes: 6 });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('rejects strike update without strikes payload', async () => {
    const user = await createUser({
      email: 'nostrike@test.com',
      username: 'nostrike_user',
    });

    const res = await request(app)
      .put(`/api/users/admin/strikes/${user._id}`)
      .send({});

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('returns 404 when updating strikes for missing user', async () => {
    const missingId = new User()._id;

    const res = await request(app)
      .put(`/api/users/admin/strikes/${missingId}`)
      .send({ strikes: 1 });

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
  });

  it('activates and deactivates search flag', async () => {
    const admin = await createAdmin({
      email: 'admin-search@test.com',
      username: 'admin_search',
    });

    const user = await createUser({
      email: 'search@test.com',
      username: 'search_user',
    });

    const activate = await request(app)
      .put(`/api/users/admin/activate-search/${user._id}`)
      .set(authHeaderFor(admin))
      .send({});

    assert.strictEqual(activate.status, 200);

    const deactivate = await request(app)
      .put(`/api/users/admin/deactivate-search/${user._id}`)
      .set(authHeaderFor(admin))
      .send({});

    assert.strictEqual(deactivate.status, 200);
  });

  it('filters users by status and search', async () => {
    await createUser({
      email: 'searcha@test.com',
      username: 'search_a',
      status: 'blocked',
    });

    const res = await request(app)
      .get('/api/users/admin?status=blocked&search=search_a');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.length, 1);
  });
});
