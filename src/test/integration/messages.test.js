import assert from 'assert';
import request from 'supertest';
import Message from '../../api/models/messages.js';
import Meeting from '../../api/models/meetings.js';
import { createTestApp, createUser, createAdmin, authHeaderFor } from './helpers.js';

const app = createTestApp();

const futureDate = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const createMeetingWithMembers = async (members) => {
  return Meeting.create({
    groupName: 'Chat Meeting',
    members: members.map((user) => ({
      user: user._id,
      response: 'accepted',
      respondedAt: new Date(),
    })),
    sharedInterests: ['kava'],
    matchPercentage: 90,
    venue: {
      address: 'Chat Street 1',
      city: 'Ljubljana',
      country: 'Slovenia',
      coordinates: { lat: 46.05, lng: 14.5 },
    },
    date: futureDate(),
    status: 'upcoming',
  });
};

describe('Messages integration', () => {
  it('gets meeting messages for member', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    await Message.create({
      meeting: meeting._id,
      user: members[0]._id,
      message: 'Pozdrav',
    });

    const res = await request(app)
      .get(`/api/messages/${meeting._id}`)
      .set(authHeaderFor(members[0]));

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  it('blocks meeting messages for non-member', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const outsider = await createUser();
    const meeting = await createMeetingWithMembers(members);

    const res = await request(app)
      .get(`/api/messages/${meeting._id}`)
      .set(authHeaderFor(outsider));

    assert.strictEqual(res.status, 403);
  });

  it('rejects meeting messages without auth', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const res = await request(app)
      .get(`/api/messages/${meeting._id}`);

    assert.strictEqual(res.status, 401);
  });

  it('rejects invalid meeting id for messages', async () => {
    const user = await createUser();

    const res = await request(app)
      .get('/api/messages/not-valid')
      .set(authHeaderFor(user));

    assert.strictEqual(res.status, 400);
  });

  it('returns 404 for messages when meeting is missing', async () => {
    const user = await createUser();
    const missingMeetingId = new Meeting()._id;

    const res = await request(app)
      .get(`/api/messages/${missingMeetingId}`)
      .set(authHeaderFor(user));

    assert.strictEqual(res.status, 404);
  });

  it('sends a message to meeting', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const res = await request(app)
      .post(`/api/messages/${meeting._id}`)
      .set(authHeaderFor(members[0]))
      .send({ message: 'Nova sporocila' });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data._id);
  });

  it('blocks sending message for non-member', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const outsider = await createUser();
    const meeting = await createMeetingWithMembers(members);

    const res = await request(app)
      .post(`/api/messages/${meeting._id}`)
      .set(authHeaderFor(outsider))
      .send({ message: 'Pozdrav' });

    assert.strictEqual(res.status, 403);
  });

  it('rejects empty message', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const res = await request(app)
      .post(`/api/messages/${meeting._id}`)
      .set(authHeaderFor(members[0]))
      .send({ message: '   ' });

    assert.strictEqual(res.status, 400);
  });

  it('rejects too long message', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const res = await request(app)
      .post(`/api/messages/${meeting._id}`)
      .set(authHeaderFor(members[0]))
      .send({ message: 'a'.repeat(501) });

    assert.strictEqual(res.status, 400);
  });

  it('updates a message by owner', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const message = await Message.create({
      meeting: meeting._id,
      user: members[0]._id,
      message: 'Original',
    });

    const res = await request(app)
      .put(`/api/messages/${message._id}`)
      .set(authHeaderFor(members[0]))
      .send({ message: 'Updated' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.message, 'Updated');
  });

  it('rejects message update without auth', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const message = await Message.create({
      meeting: meeting._id,
      user: members[0]._id,
      message: 'Original',
    });

    const res = await request(app)
      .put(`/api/messages/${message._id}`)
      .send({ message: 'Updated' });

    assert.strictEqual(res.status, 401);
  });

  it('rejects message update with invalid id', async () => {
    const user = await createUser();

    const res = await request(app)
      .put('/api/messages/not-valid')
      .set(authHeaderFor(user))
      .send({ message: 'Updated' });

    assert.strictEqual(res.status, 400);
  });

  it('rejects message update with empty message', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const message = await Message.create({
      meeting: meeting._id,
      user: members[0]._id,
      message: 'Original',
    });

    const res = await request(app)
      .put(`/api/messages/${message._id}`)
      .set(authHeaderFor(members[0]))
      .send({ message: '   ' });

    assert.strictEqual(res.status, 400);
  });

  it('returns 404 for message update when message is missing', async () => {
    const user = await createUser();
    const missingId = new Message()._id;

    const res = await request(app)
      .put(`/api/messages/${missingId}`)
      .set(authHeaderFor(user))
      .send({ message: 'Updated' });

    assert.strictEqual(res.status, 404);
  });

  it('blocks message update for non-owner', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const message = await Message.create({
      meeting: meeting._id,
      user: members[0]._id,
      message: 'Original',
    });

    const res = await request(app)
      .put(`/api/messages/${message._id}`)
      .set(authHeaderFor(members[1]))
      .send({ message: 'Updated' });

    assert.strictEqual(res.status, 403);
  });

  it('deletes a message by admin', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);
    const admin = await createAdmin();

    const message = await Message.create({
      meeting: meeting._id,
      user: members[0]._id,
      message: 'Delete me',
    });

    const res = await request(app)
      .delete(`/api/messages/${message._id}`)
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects message delete without auth', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const message = await Message.create({
      meeting: meeting._id,
      user: members[0]._id,
      message: 'Delete me',
    });

    const res = await request(app)
      .delete(`/api/messages/${message._id}`);

    assert.strictEqual(res.status, 401);
  });

  it('rejects message delete with invalid id', async () => {
    const user = await createUser();

    const res = await request(app)
      .delete('/api/messages/not-valid')
      .set(authHeaderFor(user));

    assert.strictEqual(res.status, 400);
  });

  it('returns 404 for message delete when message is missing', async () => {
    const user = await createUser();
    const missingId = new Message()._id;

    const res = await request(app)
      .delete(`/api/messages/${missingId}`)
      .set(authHeaderFor(user));

    assert.strictEqual(res.status, 404);
  });

  it('blocks message delete for non-owner', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const message = await Message.create({
      meeting: meeting._id,
      user: members[0]._id,
      message: 'Delete me',
    });

    const res = await request(app)
      .delete(`/api/messages/${message._id}`)
      .set(authHeaderFor(members[2]));

    assert.strictEqual(res.status, 403);
  });
});
