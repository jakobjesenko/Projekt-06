import assert from 'assert';
import mongoose from 'mongoose';
import Message from '../../../api/models/messages.js';

describe('Message model — validacija sheme', () => {
  const validMessage = () => ({
    meeting: new mongoose.Types.ObjectId(),
    user: new mongoose.Types.ObjectId(),
    message: 'To je testno sporočilo.',
  });

  it('uspešno shrani veljavno sporočilo', async () => {
    const doc = new Message(validMessage());
    const saved = await doc.save();

    assert.ok(saved._id);
    assert.strictEqual(saved.message, 'To je testno sporočilo.');
    assert.ok(saved.timestamp);
  });

  it('zavrne manjkajoč meeting', async () => {
    const data = validMessage();
    delete data.meeting;

    await assert.rejects(
      () => new Message(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.meeting);
        return true;
      },
    );
  });

  it('zavrne manjkajoč user', async () => {
    const data = validMessage();
    delete data.user;

    await assert.rejects(
      () => new Message(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.user);
        return true;
      },
    );
  });

  it('trim-a message in zavrne predolgo sporočilo', async () => {
    const trimmed = await new Message({
      ...validMessage(),
      message: '  Pozdrav  ',
    }).save();

    assert.strictEqual(trimmed.message, 'Pozdrav');

    const longMessage = 'a'.repeat(501);
    await assert.rejects(
      () => new Message({ ...validMessage(), message: longMessage }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.message);
        return true;
      },
    );
  });
});
