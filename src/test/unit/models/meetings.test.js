import assert from 'assert';
import mongoose from 'mongoose';
import Meeting from '../../../api/models/meetings.js';

const futureDate = () => new Date(Date.now() + 24 * 60 * 60 * 1000);

const validMembers = () => [
  { user: new mongoose.Types.ObjectId(), response: 'pending' },
  { user: new mongoose.Types.ObjectId(), response: 'accepted' },
  { user: new mongoose.Types.ObjectId(), response: 'declined' },
];

const validMeeting = () => ({
  groupName: 'Sobotni pohodniki',
  members: validMembers(),
  sharedInterests: ['hiking', 'coffee'],
  matchPercentage: 85,
  venue: {
    address: 'Slovenska cesta 10',
    city: 'Ljubljana',
    country: 'Slovenia',
    coordinates: { lat: 46.05, lng: 14.5 },
  },
  date: futureDate(),
  status: 'draft',
});

describe('Meeting model — validacija sheme', () => {
  it('uspešno shrani veljaven meeting', async () => {
    const meeting = new Meeting(validMeeting());
    const saved = await meeting.save();

    assert.ok(saved._id);
    assert.strictEqual(saved.members.length, 3);
    assert.strictEqual(saved.status, 'draft');
    assert.strictEqual(saved.matchPercentage, 85);
  });

  it('privzeti status je draft', async () => {
    const data = validMeeting();
    delete data.status;
    const saved = await new Meeting(data).save();
    assert.strictEqual(saved.status, 'draft');
  });

  it('zavrne meeting brez groupName', async () => {
    const data = validMeeting();
    delete data.groupName;

    await assert.rejects(
      () => new Meeting(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.groupName);
        return true;
      },
    );
  });

  it('zavrne meeting brez venue.address', async () => {
    const data = validMeeting();
    delete data.venue.address;

    await assert.rejects(
      () => new Meeting(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors['venue.address']);
        return true;
      },
    );
  });

  it('zavrne meeting brez venue.city', async () => {
    const data = validMeeting();
    delete data.venue.city;

    await assert.rejects(
      () => new Meeting(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors['venue.city']);
        return true;
      },
    );
  });

  it('zavrne koordinate izven obsega (lat > 90)', async () => {
    const data = validMeeting();
    data.venue.coordinates.lat = 91;

    await assert.rejects(
      () => new Meeting(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors['venue.coordinates.lat']);
        return true;
      },
    );
  });

  it('zavrne koordinate izven obsega (lng < -180)', async () => {
    const data = validMeeting();
    data.venue.coordinates.lng = -181;

    await assert.rejects(
      () => new Meeting(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors['venue.coordinates.lng']);
        return true;
      },
    );
  });

  it('zavrne meeting z manj kot 3 člani', async () => {
    const meeting = new Meeting({ ...validMeeting(), members: validMembers().slice(0, 2) });

    await assert.rejects(
      () => meeting.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.members);
        return true;
      },
    );
  });

  it('zavrne meeting z več kot 5 člani', async () => {
    const members = [
      ...validMembers(),
      { user: new mongoose.Types.ObjectId() },
      { user: new mongoose.Types.ObjectId() },
      { user: new mongoose.Types.ObjectId() },
    ];

    await assert.rejects(
      () => new Meeting({ ...validMeeting(), members }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.members);
        return true;
      },
    );
  });

  it('zavrne datum v preteklosti pri create', async () => {
    const meeting = new Meeting({ ...validMeeting(), date: new Date(Date.now() - 10000) });

    await assert.rejects(
      () => meeting.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.date);
        return true;
      },
    );
  });

  it('zavrne neveljaven status', async () => {
    await assert.rejects(
      () => new Meeting({ ...validMeeting(), status: 'pending' }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.status);
        return true;
      },
    );
  });

  it('zavrne matchPercentage izven obsega', async () => {
    await assert.rejects(
      () => new Meeting({ ...validMeeting(), matchPercentage: 101 }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.matchPercentage);
        return true;
      },
    );

    await assert.rejects(
      () => new Meeting({ ...validMeeting(), matchPercentage: -1 }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.matchPercentage);
        return true;
      },
    );
  });

  it('shrani sharedInterests kot array', async () => {
    const saved = await new Meeting({
      ...validMeeting(),
      sharedInterests: ['kava', 'glasba', 'pohodništvo'],
    }).save();

    assert.deepStrictEqual(saved.sharedInterests, ['kava', 'glasba', 'pohodništvo']);
  });
});

describe('Meeting model — metoda setMemberResponse', () => {
  it('posodobi response in respondedAt obstoječemu članu', async () => {
    const meeting = await new Meeting(validMeeting()).save();
    const targetUser = meeting.members[0].user;

    meeting.setMemberResponse(targetUser, 'accepted');
    await meeting.save();

    const reloaded = await Meeting.findById(meeting._id);
    const member = reloaded.members.find((m) => m.user.toString() === targetUser.toString());

    assert.strictEqual(member.response, 'accepted');
    assert.ok(member.respondedAt instanceof Date);
  });

  it('posodobi response na declined', async () => {
    const meeting = await new Meeting(validMeeting()).save();
    const targetUser = meeting.members[1].user;

    meeting.setMemberResponse(targetUser, 'declined');
    await meeting.save();

    const reloaded = await Meeting.findById(meeting._id);
    const member = reloaded.members.find((m) => m.user.toString() === targetUser.toString());

    assert.strictEqual(member.response, 'declined');
    assert.ok(member.respondedAt instanceof Date);
  });

  it('vrže napako za neobstoječega člana', async () => {
    const meeting = await new Meeting(validMeeting()).save();

    assert.throws(
      () => meeting.setMemberResponse(new mongoose.Types.ObjectId(), 'accepted'),
      /Member not found in this meeting/,
    );
  });
});

describe('Meeting model — statična metoda getPaginatedMeetings', () => {
  beforeEach(async () => {
    await Meeting.create([
      {
        ...validMeeting(),
        groupName: 'Coffee Group',
        status: 'upcoming',
        date: new Date('2027-01-10T10:00:00.000Z'),
      },
      {
        ...validMeeting(),
        groupName: 'Hiking Team',
        status: 'completed',
        date: new Date('2027-01-20T10:00:00.000Z'),
      },
      {
        ...validMeeting(),
        groupName: 'Board Games',
        status: 'cancelled',
        date: new Date('2027-02-01T10:00:00.000Z'),
      },
    ]);
  });

  it('vrne vse meetinge brez filtrov', async () => {
    const { meetings, totalCount } = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
    });

    assert.strictEqual(totalCount, 3);
    assert.strictEqual(meetings.length, 3);
  });

  it('filtrira po statusu completed', async () => {
    const { meetings, totalCount } = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
      status: 'completed',
    });

    assert.strictEqual(totalCount, 1);
    assert.strictEqual(meetings[0].groupName, 'Hiking Team');
  });

  it('filtrira po statusu cancelled', async () => {
    const { meetings, totalCount } = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
      status: 'cancelled',
    });

    assert.strictEqual(totalCount, 1);
    assert.strictEqual(meetings[0].groupName, 'Board Games');
  });

  it('išče po groupName', async () => {
    const { totalCount } = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
      search: 'board games',
    });
    assert.strictEqual(totalCount, 1);
  });

  it('išče po venue.city', async () => {
    const { totalCount } = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
      search: 'ljubljana',
    });
    assert.strictEqual(totalCount, 3);
  });

  it('filtrira po dateFrom', async () => {
    const { totalCount } = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
      dateFrom: '2027-01-15',
    });
    assert.strictEqual(totalCount, 2);
  });

  it('filtrira po dateTo', async () => {
    const { totalCount } = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
      dateTo: '2027-01-15',
    });
    assert.strictEqual(totalCount, 1);
  });

  it('filtrira po dateFrom in dateTo skupaj', async () => {
    const { meetings, totalCount } = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
      dateFrom: '2027-01-15',
      dateTo: '2027-01-31',
    });

    assert.strictEqual(totalCount, 1);
    assert.strictEqual(meetings[0].groupName, 'Hiking Team');
  });

  it('upošteva limit in offset', async () => {
    const { meetings } = await Meeting.getPaginatedMeetings({ offset: 0, limit: 2 });
    assert.strictEqual(meetings.length, 2);

    const { meetings: page2 } = await Meeting.getPaginatedMeetings({ offset: 2, limit: 2 });
    assert.strictEqual(page2.length, 1);
  });

  it('vrne prazen array če ni zadetkov', async () => {
    const { meetings, totalCount } = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
      search: 'xxxyyyzzz',
    });
    assert.strictEqual(totalCount, 0);
    assert.strictEqual(meetings.length, 0);
  });
});