import assert from 'assert';
import sinon from 'sinon';

process.env.RESEND_API_KEY = 'test-api-key';
process.env.APP_URL = 'http://localhost:3000';
process.env.EMAIL_FROM = 'test@test.com';
process.env.NODE_ENV = 'test';

const emailService = await import('../../../api/utils/email.js');

const createResendStub = (response = { data: { id: 'test-email-id-123' }, error: null }) => ({
  emails: {
    send: sinon.stub().resolves(response),
  },
});

const stubService = (response) => {
  const resendStub = createResendStub(response);
  emailService.__setResendForTests(resendStub);
  return resendStub;
};

afterEach(() => {
  sinon.restore();
  emailService.__resetResendForTests();
});

describe('Email service — sendVerificationEmail', () => {
  it('pošlje verification email in uporabi verification URL', async () => {
    const resendStub = stubService();

    const result = await emailService.sendVerificationEmail(
      'test@test.com',
      'token123',
      'Ana',
      'verification',
    );

    assert.deepStrictEqual(result, { success: true, data: { id: 'test-email-id-123' } });
    assert.strictEqual(resendStub.emails.send.calledOnce, true);

    const payload = resendStub.emails.send.firstCall.args[0];
    assert.strictEqual(payload.to, 'test@test.com');
    assert.strictEqual(payload.subject, 'Potrdite svoj email naslov - Srecajmo se');
    assert.ok(payload.html.includes('/api/auth/verify-email?token=token123'));
    assert.ok(payload.text.includes('/api/auth/verify-email?token=token123'));
  });

  it('pošlje reset email in uporabi reset URL', async () => {
    const resendStub = stubService();

    const result = await emailService.sendVerificationEmail(
      'test@test.com',
      'resettoken456',
      'Ana',
      'reset',
    );

    assert.deepStrictEqual(result, { success: true, data: { id: 'test-email-id-123' } });
    const payload = resendStub.emails.send.firstCall.args[0];
    assert.strictEqual(payload.subject, 'Ponastavitev gesla - Srecajmo se');
    assert.ok(payload.html.includes('/reset-password?token=resettoken456'));
    assert.ok(payload.text.includes('/reset-password?token=resettoken456'));
  });

  it('vrne success false ob napaki iz Resend', async () => {
    const resendStub = stubService({ data: null, error: { message: 'Resend API error' } });

    const result = await emailService.sendVerificationEmail(
      'test@test.com',
      'token123',
      'Ana',
      'verification',
    );

    assert.strictEqual(result.success, false);
    assert.ok(result.error);
    assert.strictEqual(resendStub.emails.send.calledOnce, true);
  });
});

describe('Email service — sendPasswordResetEmail', () => {
  it('pošlje email z reset povezavo', async () => {
    const resendStub = stubService();

    const result = await emailService.sendPasswordResetEmail(
      'test@test.com',
      'resettoken123',
      'Janez',
    );

    assert.strictEqual(result.success, true);
    const payload = resendStub.emails.send.firstCall.args[0];
    assert.strictEqual(payload.subject, 'Ponastavitev gesla - Srecajmo se');
    assert.ok(payload.html.includes('/reset-password?token=resettoken123'));
    assert.ok(payload.text.includes('/reset-password?token=resettoken123'));
  });
});

describe('Email service — sendContactNotificationEmail', () => {
  it('pošlje kontaktno obvestilo z replyTo', async () => {
    const resendStub = stubService();

    const result = await emailService.sendContactNotificationEmail(
      'Ana',
      'Novak',
      'ana@test.com',
      'Splošno vprašanje',
      'Testno sporočilo iz testa.',
    );

    assert.strictEqual(result.success, true);
    const payload = resendStub.emails.send.firstCall.args[0];
    assert.strictEqual(payload.replyTo, 'ana@test.com');
    assert.ok(payload.subject.includes('Splošno vprašanje'));
    assert.ok(payload.html.includes('Ana'));
    assert.ok(payload.text.includes('Testno sporočilo iz testa.'));
  });
});

describe('Email service — sendEmail', () => {
  it('pošlje generičen email', async () => {
    const resendStub = stubService();

    const result = await emailService.sendEmail(
      'test@test.com',
      'Testni subject',
      '<p>Test HTML</p>',
      'Test text',
    );

    assert.strictEqual(result.success, true);
    const payload = resendStub.emails.send.firstCall.args[0];
    assert.strictEqual(payload.to, 'test@test.com');
    assert.strictEqual(payload.subject, 'Testni subject');
    assert.strictEqual(payload.html, '<p>Test HTML</p>');
    assert.strictEqual(payload.text, 'Test text');
  });
});