import assert from 'assert';
import mongoose from 'mongoose';
import Analytic from '../../../api/models/analytics.js';

describe('Analytic model — validacija sheme', () => {
  const validAnalytic = () => ({
    date: new Date('2026-01-01T00:00:00.000Z'),
    totalUsers: 100,
    activeUsers: 20,
    totalMeetings: 50,
    activeMeetings: 10,
    timeframe: 'daily',
  });

  it('uspešno shrani veljaven analytic dokument', async () => {
    const analytic = new Analytic(validAnalytic());
    const saved = await analytic.save();

    assert.ok(saved._id);
    assert.strictEqual(saved.totalUsers, 100);
    assert.strictEqual(saved.timeframe, 'daily');
  });

  it('zavrne neveljaven timeframe', async () => {
    const analytic = new Analytic({ ...validAnalytic(), timeframe: 'yearly' });

    await assert.rejects(
      () => analytic.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.timeframe);
        return true;
      },
    );
  });

  it('zavrne negativno totalUsers vrednost', async () => {
    const analytic = new Analytic({ ...validAnalytic(), totalUsers: -1 });

    await assert.rejects(
      () => analytic.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.totalUsers);
        return true;
      },
    );
  });

  it('zavrne negativno activeUsers vrednost', async () => {
    const analytic = new Analytic({ ...validAnalytic(), activeUsers: -1 });

    await assert.rejects(
      () => analytic.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.activeUsers);
        return true;
      },
    );
  });

  it('zavrne negativno totalMeetings vrednost', async () => {
    const analytic = new Analytic({ ...validAnalytic(), totalMeetings: -1 });

    await assert.rejects(
      () => analytic.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.totalMeetings);
        return true;
      },
    );
  });

  it('zavrne negativno activeMeetings vrednost', async () => {
    const analytic = new Analytic({ ...validAnalytic(), activeMeetings: -1 });

    await assert.rejects(
      () => analytic.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.activeMeetings);
        return true;
      },
    );
  });

  it('zavrne podvojen date (unique)', async () => {
    await new Analytic(validAnalytic()).save();

    const analytic2 = new Analytic({ ...validAnalytic(), timeframe: 'weekly' });

    await assert.rejects(
      () => analytic2.save(),
      (err) => {
        assert.strictEqual(err.code, 11000);
        return true;
      },
    );
  });

  it('nastavi privzete vrednosti', async () => {
    const analytic = new Analytic({ date: new Date('2026-02-01T00:00:00.000Z') });
    const saved = await analytic.save();

    assert.strictEqual(saved.totalUsers, 0);
    assert.strictEqual(saved.activeUsers, 0);
    assert.strictEqual(saved.totalMeetings, 0);
    assert.strictEqual(saved.activeMeetings, 0);
    assert.strictEqual(saved.timeframe, 'daily');
  });
});