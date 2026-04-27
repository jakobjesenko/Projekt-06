import assert from 'assert';
import mongoose from 'mongoose';
import Report from '../../../api/models/reports.js';

describe('Report model — validacija sheme', () => {
  const validReport = () => ({
    reporter: new mongoose.Types.ObjectId(),
    reportedUser: new mongoose.Types.ObjectId(),
    meeting: new mongoose.Types.ObjectId(),
    description: 'Uporabnik je uporabljal neprimeren jezik med srečanjem.',
  });

  it('uspešno shrani veljaven report', async () => {
    const report = new Report(validReport());
    const saved = await report.save();

    assert.ok(saved._id);
    assert.strictEqual(saved.status, 'new');
  });

  it('zavrne report brez obveznih polj', async () => {
    const report = new Report({});

    await assert.rejects(
      () => report.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.reporter);
        assert.ok(err.errors.reportedUser);
        assert.ok(err.errors.meeting);
        assert.ok(err.errors.description);
        return true;
      },
    );
  });

  it('zavrne prekratek description', async () => {
    const report = new Report({ ...validReport(), description: 'prekratko' });

    await assert.rejects(
      () => report.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.description);
        return true;
      },
    );
  });

  it('zavrne neveljaven status', async () => {
    const report = new Report({ ...validReport(), status: 'closed' });

    await assert.rejects(
      () => report.save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.status);
        return true;
      },
    );
  });
});

describe('Report model — statična metoda getPaginatedReports', () => {
  let meeting1;
  let meeting2;
  let reporter1;
  let reporter2;
  let reported1;

  beforeEach(async () => {
    meeting1 = new mongoose.Types.ObjectId();
    meeting2 = new mongoose.Types.ObjectId();
    reporter1 = new mongoose.Types.ObjectId();
    reporter2 = new mongoose.Types.ObjectId();
    reported1 = new mongoose.Types.ObjectId();

    await Report.create([
      {
        reporter: reporter1,
        reportedUser: reported1,
        meeting: meeting1,
        description: 'Žaljivi komentarji v klepetu.',
        status: 'new',
      },
      {
        reporter: reporter2,
        reportedUser: new mongoose.Types.ObjectId(),
        meeting: meeting1,
        description: 'Neprimerno vedenje na srečanju.',
        status: 'in-review',
      },
      {
        reporter: new mongoose.Types.ObjectId(),
        reportedUser: new mongoose.Types.ObjectId(),
        meeting: meeting2,
        description: 'Spam sporočila v skupini.',
        status: 'resolved',
      },
    ]);
  });

  it('vrne vse reporte brez filtrov', async () => {
    const { reports, totalCount } = await Report.getPaginatedReports({
      offset: 0,
      limit: 10,
    });

    assert.strictEqual(totalCount, 3);
    assert.strictEqual(reports.length, 3);
  });

  it('filtrira po statusu', async () => {
    const { reports, totalCount } = await Report.getPaginatedReports({
      offset: 0,
      limit: 10,
      status: 'in-review',
    });

    assert.strictEqual(totalCount, 1);
    assert.strictEqual(reports[0].status, 'in-review');
  });

  it('filtrira po reporter / reportedUser / meeting', async () => {
    const byReporter = await Report.getPaginatedReports({
      offset: 0,
      limit: 10,
      reporter: reporter1,
    });
    assert.strictEqual(byReporter.totalCount, 1);

    const byReported = await Report.getPaginatedReports({
      offset: 0,
      limit: 10,
      reportedUser: reported1,
    });
    assert.strictEqual(byReported.totalCount, 1);

    const byMeeting = await Report.getPaginatedReports({
      offset: 0,
      limit: 10,
      meeting: meeting1,
    });
    assert.strictEqual(byMeeting.totalCount, 2);
  });

  it('išče po description', async () => {
    const { reports, totalCount } = await Report.getPaginatedReports({
      offset: 0,
      limit: 10,
      search: 'spam',
    });

    assert.strictEqual(totalCount, 1);
    assert.ok(reports[0].description.toLowerCase().includes('spam'));
  });
});
