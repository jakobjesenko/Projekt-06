import assert from 'assert';
import mongoose from 'mongoose';
import Contact from '../../../api/models/contacts.js';

describe('Contact model — validacija sheme', () => {
  const validContact = () => ({
    name: 'Janez',
    lastName: 'Novak',
    email: 'janez@test.com',
    subject: 'Splošno vprašanje',
    message: 'Pozdravljeni, zanima me podrobnost glede aplikacije.',
  });

  it('uspešno shrani veljaven contact', async () => {
    const contact = new Contact(validContact());
    const saved = await contact.save();

    assert.ok(saved._id);
    assert.strictEqual(saved.status, 'new');
  });

  it('zavrne manjkajoč name', async () => {
    const data = validContact();
    delete data.name;

    await assert.rejects(
      () => new Contact(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.name);
        return true;
      },
    );
  });

  it('zavrne manjkajoč lastName', async () => {
    const data = validContact();
    delete data.lastName;

    await assert.rejects(
      () => new Contact(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.lastName);
        return true;
      },
    );
  });

  it('zavrne manjkajoč subject', async () => {
    const data = validContact();
    delete data.subject;

    await assert.rejects(
      () => new Contact(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.subject);
        return true;
      },
    );
  });

  it('zavrne neveljaven email', async () => {
    await assert.rejects(
      () => new Contact({ ...validContact(), email: 'napačen' }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.email);
        return true;
      },
    );
  });

  it('zavrne predolgo message', async () => {
    const longMsg = 'a'.repeat(5001);

    await assert.rejects(
      () => new Contact({ ...validContact(), message: longMsg }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.message);
        return true;
      },
    );
  });

  it('privzeti status je new', async () => {
    const saved = await new Contact(validContact()).save();
    assert.strictEqual(saved.status, 'new');
  });

  it('zavrne neveljaven status', async () => {
    await assert.rejects(
      () => new Contact({ ...validContact(), status: 'closed' }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.status);
        return true;
      },
    );
  });
});

describe('Contact model — statična metoda getPaginatedContacts', () => {
  // setup.js po vsakem testu počisti kolekcije, zato seedamo pred vsakim testom
  beforeEach(async () => {
    await Contact.create([
      {
        name: 'Ana',
        lastName: 'Al',
        email: 'ana@test.com',
        subject: 'Prijava',
        message: 'Sporočilo A',
        status: 'new',
      },
      {
        name: 'Bine',
        lastName: 'Bi',
        email: 'bine@test.com',
        subject: 'Pomoč',
        message: 'Sporočilo B',
        status: 'resolved',
      },
      {
        name: 'Cene',
        lastName: 'Ce',
        email: 'cene@test.com',
        subject: 'Vprašanje',
        message: 'Sporočilo C',
        status: 'in-progress',
      },
    ]);
  });

  it('vrne vse kontakte brez filtrov', async () => {
    const { contacts, totalCount } = await Contact.getPaginatedContacts({
      offset: 0,
      limit: 10,
    });

    assert.strictEqual(totalCount, 3);
    assert.strictEqual(contacts.length, 3);
  });

  it('filtrira po statusu', async () => {
    const { contacts, totalCount } = await Contact.getPaginatedContacts({
      offset: 0,
      limit: 10,
      status: 'resolved',
    });

    assert.strictEqual(totalCount, 1);
    assert.strictEqual(contacts[0].email, 'bine@test.com');
  });

  it('išče po email', async () => {
    const { contacts } = await Contact.getPaginatedContacts({
      offset: 0,
      limit: 10,
      search: 'cene@test',
    });
    assert.strictEqual(contacts.length, 1);
    assert.strictEqual(contacts[0].name, 'Cene');
  });

  it('išče po subject', async () => {
    const { contacts } = await Contact.getPaginatedContacts({
      offset: 0,
      limit: 10,
      search: 'pomoč',
    });
    assert.strictEqual(contacts.length, 1);
    assert.strictEqual(contacts[0].name, 'Bine');
  });

  it('upošteva limit in offset', async () => {
    const { contacts } = await Contact.getPaginatedContacts({ offset: 0, limit: 2 });
    assert.strictEqual(contacts.length, 2);

    const { contacts: page2 } = await Contact.getPaginatedContacts({ offset: 2, limit: 2 });
    assert.strictEqual(page2.length, 1);
  });

  it('vrne prazen array če ni zadetkov', async () => {
    const { contacts, totalCount } = await Contact.getPaginatedContacts({
      offset: 0,
      limit: 10,
      search: 'xxxyyyzzz',
    });
    assert.strictEqual(totalCount, 0);
    assert.strictEqual(contacts.length, 0);
  });
});