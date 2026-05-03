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
    const saved = await new Rating(validRating()).save();

    assert.ok(saved._id);
    assert.strictEqual(saved.rating, 4);
    assert.strictEqual(saved.username, 'ana_novak');
  });

  it('zavrne rating pod 1', async () => {
    await assert.rejects(
      () => new Rating({ ...validRating(), rating: 0 }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.rating);
        return true;
      },
    );
  });

  it('zavrne rating nad 5', async () => {
    await assert.rejects(
      () => new Rating({ ...validRating(), rating: 6 }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.rating);
        return true;
      },
    );
  });

  it('zavrne manjkajoč username', async () => {
    const data = validRating();
    delete data.username;

    await assert.rejects(
      () => new Rating(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.username);
        return true;
      },
    );
  });

  it('zavrne manjkajoč groupName', async () => {
    const data = validRating();
    delete data.groupName;

    await assert.rejects(
      () => new Rating(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.groupName);
        return true;
      },
    );
  });

  it('zavrne predolg comment', async () => {
    await assert.rejects(
      () => new Rating({ ...validRating(), comment: 'a'.repeat(501) }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.comment);
        return true;
      },
    );
  });

  it('nastavi privzeti comment če ni podan', async () => {
    const data = validRating();
    delete data.comment;
    const saved = await new Rating(data).save();

    assert.strictEqual(saved.comment, 'Brez komentarja');
  });

  it('posodobi updatedAt ob shranjevanju', async () => {
    const rating = await new Rating(validRating()).save();
    const prvičUpdatedAt = rating.updatedAt;

    // Počakaj 10ms da je čas zagotovo drugačen
    await new Promise((r) => setTimeout(r, 10));
    rating.comment = 'Posodobljen komentar';
    await rating.save();

    assert.ok(rating.updatedAt > prvičUpdatedAt);
  });

  it('zavrne podvojen user + meeting (unique index)', async () => {
    const base = validRating();
    await new Rating(base).save();

    await assert.rejects(
      () => new Rating({ ...base, comment: 'drugi komentar' }).save(),
      (err) => {
        assert.strictEqual(err.code, 11000);
        return true;
      },
    );
  });

  it('dovoli istemu userju oceniti različne meetinge', async () => {
    const userId = new mongoose.Types.ObjectId();
    const meeting1 = new mongoose.Types.ObjectId();
    const meeting2 = new mongoose.Types.ObjectId();

    await new Rating({ ...validRating(), user: userId, meeting: meeting1 }).save();
    const saved = await new Rating({ ...validRating(), user: userId, meeting: meeting2 }).save();

    assert.ok(saved._id);
  });
});

describe('Rating model — statična metoda getPaginatedRatings', () => {
  let meeting1, meeting2, user1, user2;

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

  it('filtrira po točni vrednosti ratinga', async () => {
    const { ratings, totalCount } = await Rating.getPaginatedRatings({
      offset: 0,
      limit: 10,
      rating: 5,
    });

    assert.strictEqual(totalCount, 1);
    assert.strictEqual(ratings[0].username, 'ana');
  });

  it('filtrira po user', async () => {
    const { totalCount } = await Rating.getPaginatedRatings({
      offset: 0,
      limit: 10,
      user: user2,
    });
    assert.strictEqual(totalCount, 1);
  });

  it('filtrira po meeting', async () => {
    const { totalCount } = await Rating.getPaginatedRatings({
      offset: 0,
      limit: 10,
      meeting: meeting1,
    });
    assert.strictEqual(totalCount, 2);
  });

  it('išče po groupName', async () => {
    const { ratings, totalCount } = await Rating.getPaginatedRatings({
      offset: 0,
      limit: 10,
      search: 'hiking',
    });

    assert.strictEqual(totalCount, 1);
    assert.strictEqual(ratings[0].username, 'cene');
  });

  it('išče po username', async () => {
    const { totalCount } = await Rating.getPaginatedRatings({
      offset: 0,
      limit: 10,
      search: 'bine',
    });
    assert.strictEqual(totalCount, 1);
  });

  it('išče po comment', async () => {
    const { totalCount } = await Rating.getPaginatedRatings({
      offset: 0,
      limit: 10,
      search: 'odlično',
    });
    assert.strictEqual(totalCount, 1);
  });

  it('upošteva limit in offset', async () => {
    const { ratings } = await Rating.getPaginatedRatings({ offset: 0, limit: 2 });
    assert.strictEqual(ratings.length, 2);

    const { ratings: page2 } = await Rating.getPaginatedRatings({ offset: 2, limit: 2 });
    assert.strictEqual(page2.length, 1);
  });

  it('vrne prazen array če ni zadetkov', async () => {
    const { ratings, totalCount } = await Rating.getPaginatedRatings({
      offset: 0,
      limit: 10,
      search: 'xxxyyyzzz',
    });
    assert.strictEqual(totalCount, 0);
    assert.strictEqual(ratings.length, 0);
  });
});