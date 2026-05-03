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
    const saved = await new Report(validReport()).save();

    assert.ok(saved._id);
    assert.strictEqual(saved.status, 'new');
  });

  it('privzeti status je new', async () => {
    const saved = await new Report(validReport()).save();
    assert.strictEqual(saved.status, 'new');
  });

  it('zavrne report brez reporter', async () => {
    const data = validReport();
    delete data.reporter;

    await assert.rejects(
      () => new Report(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.reporter);
        return true;
      },
    );
  });

  it('zavrne report brez reportedUser', async () => {
    const data = validReport();
    delete data.reportedUser;

    await assert.rejects(
      () => new Report(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.reportedUser);
        return true;
      },
    );
  });

  it('zavrne report brez meeting', async () => {
    const data = validReport();
    delete data.meeting;

    await assert.rejects(
      () => new Report(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.meeting);
        return true;
      },
    );
  });

  it('zavrne report brez description', async () => {
    const data = validReport();
    delete data.description;

    await assert.rejects(
      () => new Report(data).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.description);
        return true;
      },
    );
  });

  it('zavrne prekratek description (manj kot 10 znakov)', async () => {
    await assert.rejects(
      () => new Report({ ...validReport(), description: 'prekratko' }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.description);
        return true;
      },
    );
  });

  it('zavrne predolg description (več kot 2000 znakov)', async () => {
    await assert.rejects(
      () => new Report({ ...validReport(), description: 'a'.repeat(2001) }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.description);
        return true;
      },
    );
  });

  it('sprejme description točno 10 znakov', async () => {
    const saved = await new Report({
      ...validReport(),
      description: '1234567890',
    }).save();
    assert.ok(saved._id);
  });

  it('zavrne neveljaven status', async () => {
    await assert.rejects(
      () => new Report({ ...validReport(), status: 'closed' }).save(),
      (err) => {
        assert.ok(err instanceof mongoose.Error.ValidationError);
        assert.ok(err.errors.status);
        return true;
      },
    );
  });

  it('sprejme vse veljavne statuse', async () => {
    const statuses = ['new', 'in-review', 'resolved', 'rejected'];

    for (const status of statuses) {
      const saved = await new Report({ ...validReport(), status }).save();
      assert.strictEqual(saved.status, status);
    }
  });

  it('posodobi updatedAt ob shranjevanju', async () => {
    const report = await new Report(validReport()).save();
    const prvičUpdatedAt = report.updatedAt;

    await new Promise((r) => setTimeout(r, 10));
    report.status = 'in-review';
    await report.save();

    assert.ok(report.updatedAt > prvičUpdatedAt);
  });

  it('trim-a whitespace iz description', async () => {
    const saved = await new Report({
      ...validReport(),
      description: '  Neprimerno vedenje na srečanju.  ',
    }).save();

    assert.strictEqual(saved.description, 'Neprimerno vedenje na srečanju.');
  });
});

describe('Report model — statična metoda getPaginatedReports', () => {
  let meeting1, meeting2, reporter1, reporter2, reported1;

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

  it('filtrira po statusu new', async () => {
    const { totalCount } = await Report.getPaginatedReports({
      offset: 0,
      limit: 10,
      status: 'new',
    });
    assert.strictEqual(totalCount, 1);
  });

  it('filtrira po statusu in-review', async () => {
    const { reports, totalCount } = await Report.getPaginatedReports({
      offset: 0,
      limit: 10,
      status: 'in-review',
    });

    assert.strictEqual(totalCount, 1);
    assert.strictEqual(reports[0].status, 'in-review');
  });

  it('filtrira po reporter', async () => {
    const { totalCount } = await Report.getPaginatedReports({
      offset: 0,
      limit: 10,
      reporter: reporter1,
    });
    assert.strictEqual(totalCount, 1);
  });

  it('filtrira po reportedUser', async () => {
    const { totalCount } = await Report.getPaginatedReports({
      offset: 0,
      limit: 10,
      reportedUser: reported1,
    });
    assert.strictEqual(totalCount, 1);
  });

  it('filtrira po meeting', async () => {
    const { totalCount } = await Report.getPaginatedReports({
      offset: 0,
      limit: 10,
      meeting: meeting1,
    });
    assert.strictEqual(totalCount, 2);
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

  it('upošteva limit in offset', async () => {
    const { reports } = await Report.getPaginatedReports({ offset: 0, limit: 2 });
    assert.strictEqual(reports.length, 2);

    const { reports: page2 } = await Report.getPaginatedReports({ offset: 2, limit: 2 });
    assert.strictEqual(page2.length, 1);
  });

  it('vrne prazen array če ni zadetkov', async () => {
    const { reports, totalCount } = await Report.getPaginatedReports({
      offset: 0,
      limit: 10,
      search: 'xxxyyyzzz',
    });
    assert.strictEqual(totalCount, 0);
    assert.strictEqual(reports.length, 0);
  });
});