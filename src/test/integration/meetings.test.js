import assert from 'assert';
import request from 'supertest';
import Meeting from '../../api/models/meetings.js';
import { createTestApp, createUser, authHeaderFor, createAdmin } from './helpers.js';

const app = createTestApp();

const futureDate = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const createMeetingDoc = async (members) => {
  return Meeting.create({
    groupName: 'Test Meeting',
    members: members.map((user) => ({
      user: user._id,
      response: 'accepted',
      respondedAt: new Date(),
    })),
    sharedInterests: ['kava'],
    matchPercentage: 80,
    venue: {
      address: 'Test Street 1',
      city: 'Ljubljana',
      country: 'Slovenia',
      coordinates: { lat: 46.05, lng: 14.5 },
    },
    date: futureDate(),
    status: 'upcoming',
  });
};

const createPastMeetingDoc = async (members) => {
  const meeting = await createMeetingDoc(members);
  await Meeting.updateOne(
    { _id: meeting._id },
    { $set: { date: new Date(Date.now() - 24 * 60 * 60 * 1000), status: 'upcoming' } }
  );

  return Meeting.findById(meeting._id);
};

describe('Meetings integration', () => {
  it('creates a meeting', async () => {
    const userA = await createUser();
    const userB = await createUser();
    const userC = await createUser();

    const res = await request(app)
      .post('/api/meetings')
      .send({
        groupName: 'API Meeting',
        members: [
          { user: userA._id, response: 'accepted', respondedAt: new Date() },
          { user: userB._id, response: 'accepted', respondedAt: new Date() },
          { user: userC._id, response: 'pending', respondedAt: null },
        ],
        sharedInterests: ['kava'],
        matchPercentage: 70,
        venue: {
          address: 'Main Street 10',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.05, lng: 14.5 },
        },
        date: futureDate(),
        status: 'upcoming',
      });

    assert.strictEqual(res.status, 201);
    assert.ok(res.body._id);
  });

  it('returns paginated meetings list', async () => {
    const users = [await createUser(), await createUser(), await createUser()];
    await createMeetingDoc(users);

    const res = await request(app)
      .get('/api/meetings?page=1&limit=10');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  it('returns meeting by id', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingDoc(members);

    const res = await request(app)
      .get(`/api/meetings/${meeting._id}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body._id, meeting._id.toString());
    assert.strictEqual(res.body.members.length, 3);
  });

  it('returns completed meetings count and completes past upcoming meetings', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createPastMeetingDoc(members);

    const res = await request(app)
      .get('/api/meetings/stats/completed');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.count, 1);

    const reloaded = await Meeting.findById(meeting._id).lean();
    assert.strictEqual(reloaded.status, 'completed');
  });

  it('returns confirmed meetings for user', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingDoc(members);

    const res = await request(app)
      .get(`/api/meetings/confirmed/${members[0]._id}`);

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body[0]._id, meeting._id.toString());
  });

  it('creates and cancels a confirmed meeting', async () => {
    const members = [await createUser(), await createUser(), await createUser()];

    const createRes = await request(app)
      .post('/api/meetings/confirm')
      .send({
        groupName: 'Confirmed Meeting',
        members: members.map((user) => ({ user: user._id, response: 'accepted', respondedAt: new Date() })),
        sharedInterests: ['kava'],
        matchPercentage: 77,
        venue: {
          address: 'Confirm Street 1',
          city: 'Ljubljana',
          country: 'Slovenia',
          coordinates: { lat: 46.05, lng: 14.5 },
        },
        date: futureDate(),
        status: 'upcoming',
      });

    assert.strictEqual(createRes.status, 201);
    assert.ok(createRes.body._id);

    const cancelRes = await request(app)
      .delete(`/api/meetings/confirm/${createRes.body._id}`);

    assert.strictEqual(cancelRes.status, 204);

    const missing = await Meeting.findById(createRes.body._id);
    assert.strictEqual(missing, null);
  });

  it('returns chat context for meeting members', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingDoc(members);

    const res = await request(app)
      .get(`/api/meetings/${meeting._id}/chat-context`)
      .set(authHeaderFor(members[0]));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.meeting.id, meeting._id.toString());
    assert.strictEqual(res.body.members.length, 3);
  });

  it('rejects chat context without auth', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingDoc(members);

    const res = await request(app)
      .get(`/api/meetings/${meeting._id}/chat-context`);

    assert.strictEqual(res.status, 401);
  });

  it('returns 404 for chat context when meeting is missing', async () => {
    const user = await createUser();
    const missingMeetingId = new Meeting()._id;

    const res = await request(app)
      .get(`/api/meetings/${missingMeetingId}/chat-context`)
      .set(authHeaderFor(user));

    assert.strictEqual(res.status, 404);
  });

  it('blocks chat context for non-members', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const outsider = await createUser();
    const meeting = await createMeetingDoc(members);

    const res = await request(app)
      .get(`/api/meetings/${meeting._id}/chat-context`)
      .set(authHeaderFor(outsider));

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
  });

  it('allows a member to leave meeting and cancels when fewer than 2 active members remain', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingDoc(members);

    const firstLeave = await request(app)
      .delete(`/api/meetings/${meeting._id}/leave`)
      .set(authHeaderFor(members[0]));

    assert.strictEqual(firstLeave.status, 200);
    assert.strictEqual(firstLeave.body.success, true);
    assert.strictEqual(firstLeave.body.meeting.members.find((member) => member.user._id === members[0]._id.toString()).response, 'declined');

    const secondLeave = await request(app)
      .delete(`/api/meetings/${meeting._id}/leave`)
      .set(authHeaderFor(members[1]));

    assert.strictEqual(secondLeave.status, 200);
    assert.strictEqual(secondLeave.body.meeting.status, 'cancelled');
  });

  it('allows admin to access chat context', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const admin = await createAdmin();
    const meeting = await createMeetingDoc(members);

    const res = await request(app)
      .get(`/api/meetings/${meeting._id}/chat-context`)
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('deletes a meeting', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingDoc(members);

    const res = await request(app)
      .delete(`/api/meetings/${meeting._id}`);

    assert.strictEqual(res.status, 204);
  });
});
