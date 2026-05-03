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
    assert.ok(saved.timestamp instanceof Date);
  });

  it('nastavi timestamp ob shranjevanju', async () => {
    const before = new Date();
    const saved = await new Message(validMessage()).save();
    const after = new Date();

    assert.ok(saved.timestamp >= before);
    assert.ok(saved.timestamp <= after);
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

  it('zavrne manjkajoče message', async () => {
    const data = validMessage();
    delete data.message;

    await assert.rejects(
      () => new Message(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.message);
        return true;
      },
    );
  });

  it('trim-a whitespace iz sporočila', async () => {
    const saved = await new Message({
      ...validMessage(),
      message: '  Pozdrav  ',
    }).save();

    assert.strictEqual(saved.message, 'Pozdrav');
  });

  it('zavrne sporočilo daljše od 500 znakov', async () => {
    await assert.rejects(
      () => new Message({ ...validMessage(), message: 'a'.repeat(501) }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.message);
        return true;
      },
    );
  });

  it('sprejme sporočilo točno 500 znakov', async () => {
    const saved = await new Message({
      ...validMessage(),
      message: 'a'.repeat(500),
    }).save();

    assert.strictEqual(saved.message.length, 500);
  });

  it('shrani referenci na meeting in user kot ObjectId', async () => {
    const meetingId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    const saved = await new Message({
      meeting: meetingId,
      user: userId,
      message: 'Testno sporočilo',
    }).save();

    assert.strictEqual(saved.meeting.toString(), meetingId.toString());
    assert.strictEqual(saved.user.toString(), userId.toString());
  });
});