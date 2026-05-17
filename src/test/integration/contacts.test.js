import assert from 'assert';
import request from 'supertest';
import Contact from '../../api/models/contacts.js';
import { createTestApp, createAdmin, authHeaderFor, seedResendMock, resetResendMock } from './helpers.js';

const app = createTestApp();

describe('Contacts integration', () => {
  beforeEach(() => {
    seedResendMock();
  });

  afterEach(() => {
    resetResendMock();
  });

  it('submits a contact form', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .send({
        name: 'Janez',
        lastName: 'Test',
        email: 'janez@test.com',
        subject: 'Pomoc',
        message: 'Imam tezavo z aplikacijo.',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects contact form with missing fields', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .send({ name: 'Janez' });

    assert.strictEqual(res.status, 400);
  });

  it('rejects invalid contact email', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .send({
        name: 'Test',
        lastName: 'User',
        email: 'not-an-email',
        subject: 'Test',
        message: 'Test',
      });

    assert.strictEqual(res.status, 400);
  });

  it('rejects contact form with too long message', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .send({
        name: 'Test',
        lastName: 'User',
        email: 'long@test.com',
        subject: 'Test',
        message: 'a'.repeat(5001),
      });

    assert.strictEqual(res.status, 400);
  });

  it('gets contact forms as admin', async () => {
    const admin = await createAdmin();

    const res = await request(app)
      .get('/api/contacts?page=1&limit=10')
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects contact list without admin auth', async () => {
    const res = await request(app)
      .get('/api/contacts?page=1&limit=10');

    assert.strictEqual(res.status, 401);
  });

  it('updates contact form status as admin', async () => {
    const admin = await createAdmin();
    const contact = await Contact.create({
      name: 'Janez',
      lastName: 'Test',
      email: 'contact@test.com',
      subject: 'Test',
      message: 'Kontakt',
      status: 'new',
    });

    const res = await request(app)
      .put(`/api/contacts/${contact._id}/status`)
      .set(authHeaderFor(admin))
      .send({ status: 'resolved' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    const updated = await Contact.findById(contact._id);
    assert.ok(updated);
    assert.strictEqual(updated.status, 'resolved');
  });

  it('rejects invalid contact status update', async () => {
    const admin = await createAdmin();
    const contact = await Contact.create({
      name: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test',
    });

    const res = await request(app)
      .put(`/api/contacts/${contact._id}/status`)
      .set(authHeaderFor(admin))
      .send({ status: 'unknown' });

    assert.strictEqual(res.status, 400);
  });

  it('rejects contact status update with invalid contact id', async () => {
    const admin = await createAdmin();

    const res = await request(app)
      .put('/api/contacts/not-valid/status')
      .set(authHeaderFor(admin))
      .send({ status: 'resolved' });

    assert.strictEqual(res.status, 400);
  });

  it('returns 404 for status update on missing contact', async () => {
    const admin = await createAdmin();
    const missingId = new Contact()._id;

    const res = await request(app)
      .put(`/api/contacts/${missingId}/status`)
      .set(authHeaderFor(admin))
      .send({ status: 'resolved' });

    assert.strictEqual(res.status, 404);
  });

  it('deletes contact form as admin', async () => {
    const admin = await createAdmin();
    const contact = await Contact.create({
      name: 'Janez',
      lastName: 'Test',
      email: 'contact2@test.com',
      subject: 'Test',
      message: 'Kontakt',
      status: 'new',
    });

    const res = await request(app)
      .delete(`/api/contacts/${contact._id}`)
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('rejects delete without admin auth', async () => {
    const contact = await Contact.create({
      name: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test',
    });

    const res = await request(app)
      .delete(`/api/contacts/${contact._id}`);

    assert.strictEqual(res.status, 401);
  });

  it('returns 404 for delete on missing contact', async () => {
    const admin = await createAdmin();
    const missingId = new Contact()._id;

    const res = await request(app)
      .delete(`/api/contacts/${missingId}`)
      .set(authHeaderFor(admin));

    assert.strictEqual(res.status, 404);
  });
});
