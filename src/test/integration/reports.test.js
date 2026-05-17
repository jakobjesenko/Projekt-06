import assert from 'assert';
import request from 'supertest';
import Meeting from '../../api/models/meetings.js';
import Report from '../../api/models/reports.js';
import { createTestApp, createUser, createAdmin, authHeaderFor } from './helpers.js';

const app = createTestApp();

const futureDate = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const createMeetingWithMembers = async (members) => {
  return Meeting.create({
    groupName: 'Report Meeting',
    members: members.map((user) => ({ user: user._id, response: 'accepted', respondedAt: new Date() })),
    sharedInterests: ['kava'],
    matchPercentage: 75,
    venue: {
      address: 'Report Street 1',
      city: 'Ljubljana',
      country: 'Slovenia',
      coordinates: { lat: 46.05, lng: 14.5 },
    },
    date: futureDate(),
    status: 'upcoming',
  });
};

describe('Reports integration', () => {
  it('creates a report for meeting member', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const res = await request(app)
      .post('/api/reports')
      .set(authHeaderFor(members[0]))
      .send({
        reportedUser: members[1]._id,
        meeting: meeting._id,
        description: 'Uporabnik je bil zaljiv med klepetom.',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects report when reporter is not meeting member', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const outsider = await createUser();
    const meeting = await createMeetingWithMembers(members);

    const res = await request(app)
      .post('/api/reports')
      .set(authHeaderFor(outsider))
      .send({
        reportedUser: members[1]._id,
        meeting: meeting._id,
        description: 'Nimam dostopa.',
      });

    assert.strictEqual(res.status, 403);
  });

  it('rejects self-report', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const res = await request(app)
      .post('/api/reports')
      .set(authHeaderFor(members[0]))
      .send({
        reportedUser: members[0]._id,
        meeting: meeting._id,
        description: 'Self report.',
      });

    assert.strictEqual(res.status, 400);
  });

  it('rejects report with short description', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const res = await request(app)
      .post('/api/reports')
      .set(authHeaderFor(members[0]))
      .send({
        reportedUser: members[1]._id,
        meeting: meeting._id,
        description: 'Too short',
      });

    assert.strictEqual(res.status, 400);
  });

  it('rejects report when reported user is not in meeting', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const outsider = await createUser();
    const meeting = await createMeetingWithMembers(members);

    const res = await request(app)
      .post('/api/reports')
      .set(authHeaderFor(members[0]))
      .send({
        reportedUser: outsider._id,
        meeting: meeting._id,
        description: 'Uporabnik ni v skupini.',
      });

    assert.strictEqual(res.status, 400);
  });

  it('rejects report with invalid meeting id', async () => {
    const members = [await createUser(), await createUser(), await createUser()];

    const res = await request(app)
      .post('/api/reports')
      .set(authHeaderFor(members[0]))
      .send({
        reportedUser: members[1]._id,
        meeting: 'not-valid',
        description: 'Uporabnik je bil zaljiv med klepetom.',
      });

    assert.strictEqual(res.status, 400);
  });

  it('rejects report with invalid reported user id', async () => {
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const res = await request(app)
      .post('/api/reports')
      .set(authHeaderFor(members[0]))
      .send({
        reportedUser: 'not-valid',
        meeting: meeting._id,
        description: 'Uporabnik je bil zaljiv med klepetom.',
      });

    assert.strictEqual(res.status, 400);
  });

  it('rejects report with missing fields', async () => {
    const user = await createUser();

    const res = await request(app)
      .post('/api/reports')
      .set(authHeaderFor(user))
      .send({});

    assert.strictEqual(res.status, 400);
  });

  it('gets reports list for admin', async () => {
    const admin = await createAdmin();

    const res = await request(app)
      .get('/api/reports?page=1&limit=10')
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects reports list without admin auth', async () => {
    const res = await request(app)
      .get('/api/reports?page=1&limit=10');

    assert.strictEqual(res.status, 401);
  });

  it('updates report status as admin', async () => {
    const admin = await createAdmin();
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const report = await Report.create({
      reporter: members[0]._id,
      reportedUser: members[1]._id,
      meeting: meeting._id,
      description: 'Neprimerno vedenje v skupini.',
      status: 'new',
    });

    const res = await request(app)
      .put(`/api/reports/${report._id}/status`)
      .set(authHeaderFor(admin))
      .send({ status: 'in-review' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'in-review');
  });

  it('rejects invalid report status update', async () => {
    const admin = await createAdmin();
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const report = await Report.create({
      reporter: members[0]._id,
      reportedUser: members[1]._id,
      meeting: meeting._id,
      description: 'Neprimerno vedenje v skupini.',
      status: 'new',
    });

    const res = await request(app)
      .put(`/api/reports/${report._id}/status`)
      .set(authHeaderFor(admin))
      .send({ status: 'invalid' });

    assert.strictEqual(res.status, 400);
  });

  it('returns 404 for report status update on missing report', async () => {
    const admin = await createAdmin();
    const missingId = new Report()._id;

    const res = await request(app)
      .put(`/api/reports/${missingId}/status`)
      .set(authHeaderFor(admin))
      .send({ status: 'resolved' });

    assert.strictEqual(res.status, 404);
  });

  it('deletes report as admin', async () => {
    const admin = await createAdmin();
    const members = [await createUser(), await createUser(), await createUser()];
    const meeting = await createMeetingWithMembers(members);

    const report = await Report.create({
      reporter: members[0]._id,
      reportedUser: members[1]._id,
      meeting: meeting._id,
      description: 'Test report',
      status: 'new',
    });

    const res = await request(app)
      .delete(`/api/reports/${report._id}`)
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects delete with invalid report id', async () => {
    const admin = await createAdmin();

    const res = await request(app)
      .delete('/api/reports/not-valid')
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 400);
  });

  it('returns 404 for delete on missing report', async () => {
    const admin = await createAdmin();
    const missingId = new Report()._id;

    const res = await request(app)
      .delete(`/api/reports/${missingId}`)
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 404);
  });
});
