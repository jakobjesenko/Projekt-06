import assert from 'assert';
import request from 'supertest';
import Rating from '../../api/models/ratings.js';
import Meeting from '../../api/models/meetings.js';
import { createTestApp, createUser, createAdmin, authHeaderFor } from './helpers.js';

const app = createTestApp();

const futureDate = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const createMeeting = async () => {
  const members = [await createUser(), await createUser(), await createUser()];
  return Meeting.create({
    groupName: 'Rating Meeting',
    members: members.map((user) => ({ user: user._id, response: 'accepted', respondedAt: new Date() })),
    sharedInterests: ['kava'],
    matchPercentage: 85,
    venue: {
      address: 'Rating Street 1',
      city: 'Ljubljana',
      country: 'Slovenia',
      coordinates: { lat: 46.05, lng: 14.5 },
    },
    date: futureDate(),
    status: 'upcoming',
  });
};

describe('Ratings integration', () => {
  it('creates a rating', async () => {
    const user = await createUser();
    const meeting = await createMeeting();

    const res = await request(app)
      .post('/api/ratings')
      .set(authHeaderFor(user))
      .send({ meeting: meeting._id, rating: 5, comment: 'Super' });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects rating creation without auth', async () => {
    const meeting = await createMeeting();

    const res = await request(app)
      .post('/api/ratings')
      .send({ meeting: meeting._id, rating: 5, comment: 'Super' });

    assert.strictEqual(res.status, 401);
  });

  it('rejects rating creation with invalid rating value', async () => {
    const user = await createUser();
    const meeting = await createMeeting();

    const res = await request(app)
      .post('/api/ratings')
      .set(authHeaderFor(user))
      .send({ meeting: meeting._id, rating: 10 });

    assert.strictEqual(res.status, 400);
  });

  it('rejects rating creation with invalid meeting id', async () => {
    const user = await createUser();

    const res = await request(app)
      .post('/api/ratings')
      .set(authHeaderFor(user))
      .send({ meeting: 'not-valid', rating: 5 });

    assert.strictEqual(res.status, 400);
  });

  it('rejects rating creation with missing rating', async () => {
    const user = await createUser();
    const meeting = await createMeeting();

    const res = await request(app)
      .post('/api/ratings')
      .set(authHeaderFor(user))
      .send({ meeting: meeting._id });

    assert.strictEqual(res.status, 400);
  });

  it('rejects rating creation with missing meeting', async () => {
    const user = await createUser();

    const res = await request(app)
      .post('/api/ratings')
      .set(authHeaderFor(user))
      .send({ rating: 5 });

    assert.strictEqual(res.status, 400);
  });

  it('rejects rating for missing meeting', async () => {
    const user = await createUser();
    const missingMeetingId = '68012345bcf86cd799439013';

    const res = await request(app)
      .post('/api/ratings')
      .set(authHeaderFor(user))
      .send({ meeting: missingMeetingId, rating: 5, comment: 'Again' });

    assert.strictEqual(res.status, 404);
  });

  it('gets paginated ratings for admin', async () => {
    const admin = await createAdmin();

    const res = await request(app)
      .get('/api/ratings?page=1&limit=10')
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects ratings list without admin auth', async () => {
    const res = await request(app)
      .get('/api/ratings?page=1&limit=10');

    assert.strictEqual(res.status, 401);
  });

  it('updates a rating by owner', async () => {
    const user = await createUser();
    const meeting = await createMeeting();

    const rating = await Rating.create({
      user: user._id,
      meeting: meeting._id,
      username: user.username,
      groupName: meeting.groupName,
      rating: 4,
      comment: 'Ok',
    });

    const res = await request(app)
      .put(`/api/ratings/${rating._id}`)
      .set(authHeaderFor(user))
      .send({ rating: 3, comment: 'Updated' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.rating, 3);
  });

  it('rejects rating update with invalid rating value', async () => {
    const user = await createUser();
    const meeting = await createMeeting();

    const rating = await Rating.create({
      user: user._id,
      meeting: meeting._id,
      username: user.username,
      groupName: meeting.groupName,
      rating: 4,
      comment: 'Ok',
    });

    const res = await request(app)
      .put(`/api/ratings/${rating._id}`)
      .set(authHeaderFor(user))
      .send({ rating: 0 });

    assert.strictEqual(res.status, 400);
  });

  it('rejects rating update with long comment', async () => {
    const user = await createUser();
    const meeting = await createMeeting();

    const rating = await Rating.create({
      user: user._id,
      meeting: meeting._id,
      username: user.username,
      groupName: meeting.groupName,
      rating: 4,
      comment: 'Ok',
    });

    const res = await request(app)
      .put(`/api/ratings/${rating._id}`)
      .set(authHeaderFor(user))
      .send({ comment: 'a'.repeat(501) });

    assert.strictEqual(res.status, 400);
  });

  it('rejects rating update with invalid rating id', async () => {
    const user = await createUser();

    const res = await request(app)
      .put('/api/ratings/not-valid')
      .set(authHeaderFor(user))
      .send({ rating: 3 });

    assert.strictEqual(res.status, 400);
  });

  it('returns 404 when updating missing rating', async () => {
    const user = await createUser();
    const missingId = new Rating()._id;

    const res = await request(app)
      .put(`/api/ratings/${missingId}`)
      .set(authHeaderFor(user))
      .send({ rating: 3 });

    assert.strictEqual(res.status, 404);
  });

  it('blocks rating update by non-owner', async () => {
    const user = await createUser();
    const other = await createUser();
    const meeting = await createMeeting();

    const rating = await Rating.create({
      user: user._id,
      meeting: meeting._id,
      username: user.username,
      groupName: meeting.groupName,
      rating: 4,
      comment: 'Ok',
    });

    const res = await request(app)
      .put(`/api/ratings/${rating._id}`)
      .set(authHeaderFor(other))
      .send({ rating: 2 });

    assert.strictEqual(res.status, 403);
  });

  it('deletes a rating by admin', async () => {
    const admin = await createAdmin();
    const meeting = await createMeeting();

    const rating = await Rating.create({
      user: admin._id,
      meeting: meeting._id,
      username: admin.username,
      groupName: meeting.groupName,
      rating: 5,
      comment: 'Top',
    });

    const res = await request(app)
      .delete(`/api/ratings/${rating._id}`)
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects rating delete without auth', async () => {
    const meeting = await createMeeting();
    const user = await createUser();

    const rating = await Rating.create({
      user: user._id,
      meeting: meeting._id,
      username: user.username,
      groupName: meeting.groupName,
      rating: 5,
      comment: 'Top',
    });

    const res = await request(app)
      .delete(`/api/ratings/${rating._id}`);

    assert.strictEqual(res.status, 401);
  });

  it('returns 404 when deleting missing rating', async () => {
    const admin = await createAdmin();
    const missingId = new Rating()._id;

    const res = await request(app)
      .delete(`/api/ratings/${missingId}`)
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 404);
  });

  it('rejects delete with invalid rating id', async () => {
    const admin = await createAdmin();

    const res = await request(app)
      .delete('/api/ratings/not-valid')
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 400);
  });
});
