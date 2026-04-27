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
    const members = [...validMembers(), { user: new mongoose.Types.ObjectId() }, { user: new mongoose.Types.ObjectId() }, { user: new mongoose.Types.ObjectId() }];
    const meeting = new Meeting({ ...validMeeting(), members });

    await assert.rejects(
      () => meeting.save(),
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

  it('setMemberResponse posodobi response in respondedAt', async () => {
    const meeting = await new Meeting(validMeeting()).save();
    const targetUser = meeting.members[0].user;

    meeting.setMemberResponse(targetUser, 'accepted');
    await meeting.save();

    const reloaded = await Meeting.findById(meeting._id);
    const member = reloaded.members.find((m) => m.user.toString() === targetUser.toString());

    assert.strictEqual(member.response, 'accepted');
    assert.ok(member.respondedAt instanceof Date);
  });

  it('setMemberResponse vrže napako za neobstoječega člana', async () => {
    const meeting = await new Meeting(validMeeting()).save();

    assert.throws(() => {
      meeting.setMemberResponse(new mongoose.Types.ObjectId(), 'accepted');
    }, /Member not found in this meeting/);
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

  it('filtrira po statusu', async () => {
    const { meetings, totalCount } = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
      status: 'completed',
    });

    assert.strictEqual(totalCount, 1);
    assert.strictEqual(meetings[0].groupName, 'Hiking Team');
  });

  it('išče po groupName/venue/sharedInterests', async () => {
    const byName = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
      search: 'board games',
    });
    assert.strictEqual(byName.totalCount, 1);

    const byCity = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
      search: 'ljubljana',
    });
    assert.strictEqual(byCity.totalCount, 3);
  });

  it('filtrira po dateFrom/dateTo', async () => {
    const { meetings, totalCount } = await Meeting.getPaginatedMeetings({
      offset: 0,
      limit: 10,
      dateFrom: '2027-01-15',
      dateTo: '2027-01-31',
    });

    assert.strictEqual(totalCount, 1);
    assert.strictEqual(meetings[0].groupName, 'Hiking Team');
  });
});
