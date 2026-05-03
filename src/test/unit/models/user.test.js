import assert from 'assert';
import mongoose from 'mongoose';
import User from '../../../api/models/users.js';

describe('User model — validacija sheme', () => {

  // Pomožna funkcija ki vrne veljaven user objekt
  const validUser = () => ({
    firstName: 'Ana',
    lastName: 'Novak',
    username: 'ana_novak',
    email: 'ana@test.com',
    password: 'geslo123',
    birthday: new Date('2000-05-15'),
  });

  it('uspešno shrani veljavnega uporabnika', async () => {
    const user = new User(validUser());
    const saved = await user.save();
    assert.ok(saved._id);
    assert.strictEqual(saved.firstName, 'Ana');
    assert.strictEqual(saved.role, 'user');       // privzeta vrednost
    assert.strictEqual(saved.status, 'pending');  // privzeta vrednost
    assert.strictEqual(saved.strikes, 0);         // privzeta vrednost
    assert.strictEqual(saved.activeSearch, false); // privzeta vrednost
  });

  it('zavrne uporabnika brez firstName', async () => {
    const data = validUser();
    delete data.firstName;
    const user = new User(data);
    await assert.rejects(
      () => user.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.firstName);
        return true;
      }
    );
  });

  it('zavrne uporabnika brez lastName', async () => {
    const data = validUser();
    delete data.lastName;
    const user = new User(data);
    await assert.rejects(
      () => user.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.lastName);
        return true;
      }
    );
  });

  it('zavrne uporabnika brez emaila', async () => {
    const data = validUser();
    delete data.email;
    const user = new User(data);
    await assert.rejects(
      () => user.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.email);
        return true;
      }
    );
  });

  it('zavrne neveljaven format emaila', async () => {
    const user = new User({ ...validUser(), email: 'ni-email' });
    await assert.rejects(
      () => user.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.email);
        return true;
      }
    );
  });

  it('zavrne username s prepovedanimi znaki', async () => {
    const user = new User({ ...validUser(), username: 'ana novak!' });
    await assert.rejects(
      () => user.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.username);
        return true;
      }
    );
  });

  it('zavrne username krajši od 3 znakov', async () => {
    const user = new User({ ...validUser(), username: 'ab' });
    await assert.rejects(
      () => user.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.username);
        return true;
      }
    );
  });

  it('zavrne firstName krajši od 2 znakov', async () => {
    const user = new User({ ...validUser(), firstName: 'A' });
    await assert.rejects(
      () => user.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.firstName);
        return true;
      }
    );
  });

  it('zavrne neveljaven role', async () => {
    const user = new User({ ...validUser(), role: 'superadmin' });
    await assert.rejects(
      () => user.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.role);
        return true;
      }
    );
  });

  it('zavrne neveljaven status', async () => {
    const user = new User({ ...validUser(), status: 'suspended' });
    await assert.rejects(
      () => user.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.status);
        return true;
      }
    );
  });

  it('zavrne podvojen email', async () => {
    await new User(validUser()).save();
    const user2 = new User({ ...validUser(), username: 'drugi_user' });
    await assert.rejects(
      () => user2.save(),
      (err) => {
        assert.strictEqual(err.code, 11000); // MongoDB duplicate key
        return true;
      }
    );
  });

  it('zavrne podvojen username', async () => {
    await new User(validUser()).save();
    const user2 = new User({ ...validUser(), email: 'drugi@test.com' });
    await assert.rejects(
      () => user2.save(),
      (err) => {
        assert.strictEqual(err.code, 11000);
        return true;
      }
    );
  });

  it('shrani interese in razpoložljivost kot array', async () => {
    const user = new User({
      ...validUser(),
      interests: ['glasba', 'hiking'],
      availability: ['vikendi', 'večeri'],
    });
    const saved = await user.save();
    assert.deepStrictEqual(saved.interests, ['glasba', 'hiking']);
    assert.deepStrictEqual(saved.availability, ['vikendi', 'večeri']);
  });

  it('shrani lokacijo pravilno', async () => {
    const user = new User({
      ...validUser(),
      location: { lat: 46.05, lng: 14.50, radius: 10 },
    });
    const saved = await user.save();
    assert.strictEqual(saved.location.lat, 46.05);
    assert.strictEqual(saved.location.lng, 14.50);
    assert.strictEqual(saved.location.radius, 10);
  });

  it('privzeti radius lokacije je 5', async () => {
    const user = new User(validUser());
    const saved = await user.save();
    assert.strictEqual(saved.location.radius, 5);
  });
});

describe('User model — metoda comparePassword', () => {

  it('vrne true za pravilno geslo', async () => {
    const user = new User({
      firstName: 'Bor',
      lastName: 'Kovač',
      username: 'bor_kovac',
      email: 'bor@test.com',
      password: 'mojGeslo123',
      birthday: new Date('1999-01-01'),
    });
    await user.save();
    const result = await user.comparePassword('mojGeslo123');
    assert.strictEqual(result, true);
  });

  it('vrne false za napačno geslo', async () => {
    const user = new User({
      firstName: 'Cene',
      lastName: 'Kos',
      username: 'cene_kos',
      email: 'cene@test.com',
      password: 'pravilnoGeslo',
      birthday: new Date('1998-06-15'),
    });
    await user.save();
    const result = await user.comparePassword('napačnoGeslo');
    assert.strictEqual(result, false);
  });

  it('geslo je v bazi shranjeno kot hash in ne kot plaintext', async () => {
    const user = new User({
      firstName: 'Deja',
      lastName: 'Mrak',
      username: 'deja_mrak',
      email: 'deja@test.com',
      password: 'plaintext123',
      birthday: new Date('2001-03-20'),
    });
    await user.save();
    assert.notStrictEqual(user.password, 'plaintext123');
    assert.ok(user.password.startsWith('$2'));  // bcrypt hash vedno začne z $2
  });
});

describe('User model — metoda getAge', () => {

  it('pravilno izračuna starost', async () => {
    const today = new Date();
    const birthday = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const user = new User({
      firstName: 'Eva',
      lastName: 'Šarc',
      username: 'eva_sarc',
      email: 'eva@test.com',
      password: 'geslo123',
      birthday,
    });
    await user.save();
    assert.strictEqual(user.getAge(), 25);
  });

  it('pravilno izračuna starost če rojstni dan letos še ni bil', async () => {
    const today = new Date();
    // rojstni dan je jutri → letos še ni bil
    const birthday = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate() + 1);
    const user = new User({
      firstName: 'Filip',
      lastName: 'Zorko',
      username: 'filip_zorko',
      email: 'filip@test.com',
      password: 'geslo123',
      birthday,
    });
    await user.save();
    assert.strictEqual(user.getAge(), 29);
  });
});

describe('User model — statična metoda getPaginatedUsers', () => {

  // Ustvari testne uporabnike pred vsakim testom, ker setup.js po vsakem testu počisti bazo
  beforeEach(async () => {
    await User.create([
      { firstName: 'Gaja', lastName: 'Lah', username: 'gaja_lah', email: 'gaja@test.com', password: 'geslo', birthday: new Date('2000-01-01'), status: 'active' },
      { firstName: 'Hana', lastName: 'Rus', username: 'hana_rus', email: 'hana@test.com', password: 'geslo', birthday: new Date('2000-01-01'), status: 'active' },
      { firstName: 'Ivan', lastName: 'Bole', username: 'ivan_bole', email: 'ivan@test.com', password: 'geslo', birthday: new Date('2000-01-01'), status: 'blocked' },
    ]);
  });

  it('vrne vse uporabnike brez filtrov', async () => {
    const { users, totalCount } = await User.getPaginatedUsers({ offset: 0, limit: 10 });
    assert.strictEqual(totalCount, 3);
    assert.strictEqual(users.length, 3);
  });

  it('filtrira po statusu', async () => {
    const { users, totalCount } = await User.getPaginatedUsers({ offset: 0, limit: 10, status: 'active' });
    assert.strictEqual(totalCount, 2);
    users.forEach(u => assert.strictEqual(u.status, 'active'));
  });

  it('filtrira po statusu blocked', async () => {
    const { users, totalCount } = await User.getPaginatedUsers({ offset: 0, limit: 10, status: 'blocked' });
    assert.strictEqual(totalCount, 1);
    assert.strictEqual(users[0].username, 'ivan_bole');
  });

  it('išče po username', async () => {
    const { users, totalCount } = await User.getPaginatedUsers({ offset: 0, limit: 10, search: 'gaja' });
    assert.strictEqual(totalCount, 1);
    assert.strictEqual(users[0].username, 'gaja_lah');
  });

  it('išče po emailu', async () => {
    const { users } = await User.getPaginatedUsers({ offset: 0, limit: 10, search: 'hana@test' });
    assert.strictEqual(users[0].email, 'hana@test.com');
  });

  it('upošteva offset in limit (paginacija)', async () => {
    const { users } = await User.getPaginatedUsers({ offset: 0, limit: 2 });
    assert.strictEqual(users.length, 2);

    const { users: page2 } = await User.getPaginatedUsers({ offset: 2, limit: 2 });
    assert.strictEqual(page2.length, 1);
  });

  it('vrne prazen array če ni zadetkov', async () => {
    const { users, totalCount } = await User.getPaginatedUsers({ offset: 0, limit: 10, search: 'xxxyyyzzz' });
    assert.strictEqual(totalCount, 0);
    assert.strictEqual(users.length, 0);
  });
});