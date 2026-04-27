import assert from 'assert';
import mongoose from 'mongoose';
import Rating from '../../../api/models/ratings.js';

describe('Rating model — validacija sheme', () => {
  const validRating = () => ({
    user: new mongoose.Types.ObjectId(),
    meeting: new mongoose.Types.ObjectId(),
    username: 'ana_novak',
    groupName: 'Hiking Group',
    rating: 4,
    comment: 'Zelo dobro srecanje.',
  });

  it('uspešno shrani veljavno oceno', async () => {
    const doc = new Rating(validRating());
    const saved = await doc.save();

    assert.ok(saved._id);
    assert.strictEqual(saved.rating, 4);
  });

  it('zavrne rating pod 1 in nad 5', async () => {
    await assert.rejects(
      () => new Rating({ ...validRating(), rating: 0 }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.rating);
        return true;
      },
    );

    await assert.rejects(
      () => new Rating({ ...validRating(), rating: 6 }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.rating);
        return true;
      },
    );
  });

  it('nastavi privzeti comment', async () => {
    const data = validRating();
    delete data.comment;
    const saved = await new Rating(data).save();

    assert.strictEqual(saved.comment, 'Brez komentarja');
  });

  it('zavrne podvojen user + meeting', async () => {
    const base = validRating();
    await new Rating(base).save();

    await assert.rejects(
      () =>
        new Rating({
          ...base,
          comment: 'drugi komentar',
        }).save(),
      (err) => {
        assert.strictEqual(err.code, 11000);
        return true;
      },
    );
  });
});

describe('Rating model — statična metoda getPaginatedRatings', () => {
  let meeting1;
  let meeting2;
  let user1;
  let user2;

  beforeEach(async () => {
    meeting1 = new mongoose.Types.ObjectId();
    meeting2 = new mongoose.Types.ObjectId();
    user1 = new mongoose.Types.ObjectId();
    user2 = new mongoose.Types.ObjectId();

    await Rating.create([
      {
        user: user1,
        meeting: meeting1,
        username: 'ana',
        groupName: 'Coffee Group',
        rating: 5,
        comment: 'Odlično!',
      },
      {
        user: user2,
        meeting: meeting1,
        username: 'bine',
        groupName: 'Coffee Group',
        rating: 3,
        comment: 'OK izkušnja',
      },
      {
        user: new mongoose.Types.ObjectId(),
        meeting: meeting2,
        username: 'cene',
        groupName: 'Hiking Team',
        rating: 4,
        comment: 'Super skupina',
      },
    ]);
  });

  it('vrne vse ocene brez filtrov', async () => {
    const { ratings, totalCount } = await Rating.getPaginatedRatings({
      offset: 0,
      limit: 10,
    });

    assert.strictEqual(totalCount, 3);
    assert.strictEqual(ratings.length, 3);
  });

  it('filtrira po rating', async () => {
    const { ratings, totalCount } = await Rating.getPaginatedRatings({
      offset: 0,
      limit: 10,
      rating: 5,
    });

    assert.strictEqual(totalCount, 1);
    assert.strictEqual(ratings[0].username, 'ana');
  });

  it('filtrira po user in meeting', async () => {
    const byUser = await Rating.getPaginatedRatings({
      offset: 0,
      limit: 10,
      user: user2,
    });
    assert.strictEqual(byUser.totalCount, 1);

    const byMeeting = await Rating.getPaginatedRatings({
      offset: 0,
      limit: 10,
      meeting: meeting1,
    });
    assert.strictEqual(byMeeting.totalCount, 2);
  });

  it('išče po username/groupName/comment', async () => {
    const { ratings, totalCount } = await Rating.getPaginatedRatings({
      offset: 0,
      limit: 10,
      search: 'hiking',
    });

    assert.strictEqual(totalCount, 1);
    assert.strictEqual(ratings[0].username, 'cene');
  });
});
