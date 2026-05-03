import assert from 'assert';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import { clearTokenCookie, generateToken, setTokenCookie, verifyToken } from '../../../api/utils/jwt.js';

const testUser = () => ({
  _id: '507f1f77bcf86cd799439011',
  username: 'ana_novak',
  email: 'ana@test.com',
  role: 'user',
});

describe('JWT utils — generateToken', () => {
  it('vrne string token', () => {
    const token = generateToken(testUser());
    assert.strictEqual(typeof token, 'string');
    assert.ok(token.length > 0);
  });

  it('token vsebuje pravilne podatke (id, username, email, role)', () => {
    const user = testUser();
    const token = generateToken(user);
    const decoded = jwt.decode(token);

    assert.strictEqual(decoded.id, user._id.toString());
    assert.strictEqual(decoded.username, user.username);
    assert.strictEqual(decoded.email, user.email);
    assert.strictEqual(decoded.role, user.role);
  });

  it('token ima expiry (exp polje)', () => {
    const token = generateToken(testUser());
    const decoded = jwt.decode(token);
    assert.ok(decoded.exp);
    assert.ok(decoded.exp > Math.floor(Date.now() / 1000));
  });

  it('dva tokena za istega userja sta različna (različen iat)', async () => {
    const clock = sinon.useFakeTimers({ now: Date.now() });

    const token1 = generateToken(testUser());
    clock.tick(1100);
    const token2 = generateToken(testUser());

    clock.restore();

    assert.notStrictEqual(token1, token2);
  });

  it('token za admin userja vsebuje role admin', () => {
    const admin = { ...testUser(), role: 'admin' };
    const token = generateToken(admin);
    const decoded = jwt.decode(token);
    assert.strictEqual(decoded.role, 'admin');
  });
});

describe('JWT utils — verifyToken', () => {
  it('vrne decoded payload za veljaven token', () => {
    const user = testUser();
    const token = generateToken(user);
    const decoded = verifyToken(token);

    assert.ok(decoded);
    assert.strictEqual(decoded.id, user._id.toString());
    assert.strictEqual(decoded.username, user.username);
    assert.strictEqual(decoded.email, user.email);
    assert.strictEqual(decoded.role, user.role);
  });

  it('vrne null za neveljaven token', () => {
    const result = verifyToken('to.ni.veljaven.token');
    assert.strictEqual(result, null);
  });

  it('vrne null za prazen string', () => {
    const result = verifyToken('');
    assert.strictEqual(result, null);
  });

  it('vrne null za token podpisan z napačnim secretom', () => {
    const napačenToken = jwt.sign({ id: '123' }, 'napačen-secret', { expiresIn: '1h' });
    const result = verifyToken(napačenToken);
    assert.strictEqual(result, null);
  });

  it('vrne null za potekel token', async () => {
    const potekelToken = jwt.sign(
      { id: '123', username: 'test' },
      process.env.JWT_SECRET || '8LXTn83pW2CAP5u1xDpmHQ6UeaPG9bgq',
      { expiresIn: '1s' },
    );

    await new Promise((r) => setTimeout(r, 1500));

    const result = verifyToken(potekelToken);
    assert.strictEqual(result, null);
  });

  it('vrne null za undefined', () => {
    const result = verifyToken(undefined);
    assert.strictEqual(result, null);
  });

  it('vrne null za null', () => {
    const result = verifyToken(null);
    assert.strictEqual(result, null);
  });
});

describe('JWT utils — setTokenCookie', () => {
  it('nastavi jwt cookie z varnimi nastavitvami', () => {
    const res = {
      cookie: sinon.spy(),
    };
    const token = generateToken(testUser());

    setTokenCookie(res, token);

    assert.strictEqual(res.cookie.calledOnce, true);
    const [cookieName, cookieValue, cookieOptions] = res.cookie.firstCall.args;
    assert.strictEqual(cookieName, 'jwt');
    assert.strictEqual(cookieValue, token);
    assert.strictEqual(cookieOptions.httpOnly, true);
    assert.strictEqual(cookieOptions.sameSite, 'strict');
    assert.strictEqual(cookieOptions.secure, false);
    assert.ok(cookieOptions.expires instanceof Date);
  });
});

describe('JWT utils — clearTokenCookie', () => {
  it('nastavi logged-out cookie', () => {
    const res = {
      cookie: sinon.spy(),
    };

    clearTokenCookie(res);

    assert.strictEqual(res.cookie.calledOnce, true);
    const [cookieName, cookieValue, cookieOptions] = res.cookie.firstCall.args;
    assert.strictEqual(cookieName, 'jwt');
    assert.strictEqual(cookieValue, 'logged-out');
    assert.strictEqual(cookieOptions.httpOnly, true);
    assert.ok(cookieOptions.expires instanceof Date);
    assert.ok(cookieOptions.expires.getTime() > Date.now());
  });
});