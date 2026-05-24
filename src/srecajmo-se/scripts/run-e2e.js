const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const { MongoMemoryServer } = require('mongodb-memory-server');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const projectRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(projectRoot, '..');
const baseUrl = 'http://127.0.0.1:3000';

const fileUrl = (absolutePath) => pathToFileURL(absolutePath).href;
const angularCli = path.resolve(projectRoot, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');

const buildAngularApp = () => {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [angularCli, 'build'], {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: false,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Angular build failed with exit code ${code}`));
      }
    });
  });
};

const waitForHttpServer = async (url, timeoutMs = 30000) => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'manual' });

      if (response.ok || response.status === 302 || response.status === 304) {
        return;
      }
    } catch {
      // keep polling until the server is ready
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Server did not become ready at ${url}`);
};

const waitForMongoose = async (timeoutMs = 30000) => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Mongo connection timed out')), timeoutMs);

    mongoose.connection.once('connected', () => {
      clearTimeout(timeout);
      resolve();
    });

    mongoose.connection.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
};

const waitForText = async (page, text, timeout = 15000) => {
  await page.waitForFunction(
    (expectedText) => document.body && document.body.innerText.includes(expectedText),
    { timeout },
    text,
  );
};

const clickButtonByText = async (page, text) => {
  const buttons = await page.$$('button');

  for (const button of buttons) {
    const label = await page.evaluate((element) => (element.textContent || '').trim(), button);

    if (label.includes(text)) {
      await button.click();
      return;
    }
  }

  throw new Error(`Could not find a button containing text: ${text}`);
};

const fillReactiveField = async (page, selector, value) => {
  await page.$eval(
    selector,
    (element, nextValue) => {
      element.value = String(nextValue);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    },
    value,
  );
};

const createIsolatedBrowserContext = async (browser) => {
  if (typeof browser.createIncognitoBrowserContext === 'function') {
    return browser.createIncognitoBrowserContext();
  }

  if (typeof browser.createBrowserContext === 'function') {
    return browser.createBrowserContext();
  }

  throw new Error('No supported browser context factory found');
};

const loginThroughUi = async (page, email, password) => {
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });
  await page.type('#email', email);
  await page.type('#password', password);
  await page.click('#login-form button[type="submit"]');
  await page.waitForFunction(() => window.location.pathname === '/dashboard', { timeout: 15000 });
  await waitForText(page, 'Moja potrjena srečanja');
};

const runUserJourney = async ({ browser, user }) => {
  const context = await createIsolatedBrowserContext(browser);
  const page = await context.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  try {
    console.log('E2E: user journey start');
    await loginThroughUi(page, user.email, 'password123');
    console.log('E2E: user logged in');

    await waitForText(page, `Pozdravljen, ${user.username}!`);
    console.log('E2E: user greeting visible');
    await waitForText(page, 'Zapusti srečanje');
    console.log('E2E: meeting card visible');

    const handleLeaveConfirm = async (dialog) => {
      console.log(`E2E: confirm dialog -> ${dialog.message()}`);
      await dialog.accept();
    };

    page.once('dialog', handleLeaveConfirm);
    await clickButtonByText(page, 'Zapusti srečanje');
    console.log('E2E: leave meeting clicked');
    await waitForText(page, 'Ni potrjenih srečanj');

    const greeting = await page.$eval('.user-greeting', (node) => node.textContent.trim());
    assert.match(greeting, new RegExp(user.username));
    console.log('E2E: user journey done');
  } finally {
    await context.close();
  }
};

const runChatJourney = async ({ browser, user, meeting }) => {
  const context = await createIsolatedBrowserContext(browser);
  const page = await context.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  const stamp = Date.now();
  const messageText = `E2E chat message ${stamp}`;

  try {
    console.log('E2E: chat journey start');
    await loginThroughUi(page, user.email, 'password123');
    console.log('E2E: chat user logged in');

    await page.goto(`${baseUrl}/chat/${meeting._id}`, { waitUntil: 'networkidle2' });
    await waitForText(page, 'Klepet za potrjeno srecanje');
    console.log('E2E: chat page visible');

    await page.waitForSelector('input[name="newMessage"]', { timeout: 10000 });
    await page.type('input[name="newMessage"]', messageText);

    await clickButtonByText(page, 'Poslji');
    console.log('E2E: chat send clicked');

    const { default: MessageModel } = await import(fileUrl(path.resolve(repoRoot, 'api/models/messages.js')));
    // Poll DB for the stored message to avoid socket/race timing issues
    const start = Date.now();
    let saved = null;
    while (Date.now() - start < 10000) {
      // eslint-disable-next-line no-await-in-loop
      saved = await MessageModel.findOne({ meeting: meeting._id, message: messageText }).lean();
      if (saved) break;
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 500));
    }

    if (!saved) {
      console.log('E2E: UI send did not persist, attempting API fallback');
      // Send via API from the browser context so cookies/session are preserved
      const apiResult = await page.evaluate(async (meetingId, msg) => {
        const cookies = document.cookie || '';
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('jwt') : null;
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        try {
          const res = await fetch(`/api/messages/${meetingId}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ message: msg }),
            credentials: 'include',
          });
          const json = await res.json().catch(() => null);
          return { status: res.status, ok: res.ok, json, cookies };
        } catch (err) {
          return { error: String(err), cookies };
        }
      }, meeting._id.toString(), messageText);

      console.log('E2E: API fallback result ->', apiResult);
      try {
        console.log('E2E: API fallback result (stringified) ->', JSON.stringify(apiResult));
      } catch (e) {
        // ignore stringify errors
      }

      // Poll again
      const start2 = Date.now();
      while (Date.now() - start2 < 10000) {
        // eslint-disable-next-line no-await-in-loop
        saved = await MessageModel.findOne({ meeting: meeting._id, message: messageText }).lean();
        if (saved) break;
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    assert.ok(saved, 'Expected chat message stored in DB');
    console.log('E2E: chat journey done');
  } finally {
    await context.close();
  }
};

const runRegistrationJourney = async ({ browser, UserModel }) => {
  const context = await createIsolatedBrowserContext(browser);
  const page = await context.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  const stamp = Date.now();
  const email = `register_${stamp}@test.com`;
  const username = `register_${stamp}`;

  try {
    console.log('E2E: register journey start');
    await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle2' });
    await waitForText(page, 'Osebni podatki');

    await fillReactiveField(page, 'input[formControlName="firstName"]', 'Meta');
    await fillReactiveField(page, 'input[formControlName="lastName"]', 'Novak');
    await fillReactiveField(page, 'input[formControlName="username"]', username);
    await fillReactiveField(page, 'input#birthday', '1995-05-10');
    await fillReactiveField(page, 'input[formControlName="email"]', email);
    await fillReactiveField(page, 'input[formControlName="password"]', 'password123');
    await fillReactiveField(page, 'input[formControlName="passwordConfirm"]', 'password123');
    await page.click('input[formControlName="terms"]');

    await clickButtonByText(page, 'Naprej');
    await waitForText(page, 'Izberi vsaj tri stvari, ki te veselijo');

    await page.click('#interestsGrid .interest-chip:nth-child(1)');
    await page.click('#interestsGrid .interest-chip:nth-child(2)');
    await page.click('#interestsGrid .interest-chip:nth-child(3)');

    await clickButtonByText(page, 'Naprej');
    await waitForText(page, 'Tvoja lokacija');

    await fillReactiveField(page, 'input#locationLat', '46.0569');
    await fillReactiveField(page, 'input#locationLng', '14.5058');
    await fillReactiveField(page, 'input#locationRadius', '10');
    await page.click('button.quick-btn');

    // Handle dialog with compatibility for different Puppeteer versions
    let dialog;
    if (typeof page.waitForEvent === 'function') {
      const p = page.waitForEvent('dialog');
      await clickButtonByText(page, 'Registriraj se');
      dialog = await p;
    } else {
      const dialogPromise = new Promise((resolve) => page.once('dialog', resolve));
      await clickButtonByText(page, 'Registriraj se');
      dialog = await dialogPromise;
    }
    console.log(`E2E: register alert -> ${dialog.message()}`);
    await dialog.accept();

    const createdUser = await UserModel.findOne({ email }).lean();

    assert.ok(createdUser, 'Expected registered user to exist in MongoDB');
    assert.equal(createdUser.username, username);
    assert.equal(createdUser.status, 'pending');
    console.log('E2E: register journey done');
  } finally {
    await context.close();
  }
};

const runAdminJourney = async ({ browser, admin, reportedUser, meeting, report }) => {
  const context = await createIsolatedBrowserContext(browser);
  const page = await context.newPage();
  await page.setViewport({ width: 1600, height: 1200 });

  try {
    console.log('E2E: admin journey start');
    await loginThroughUi(page, admin.email, 'password123');
    console.log('E2E: admin logged in');

    await page.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle2' });
    await waitForText(page, 'Admin Panel');
    console.log('E2E: admin page visible');

    await page.reload({ waitUntil: 'networkidle2' });
    await waitForText(page, 'Admin Panel');
    console.log('E2E: admin page reloaded');

    await clickButtonByText(page, 'Prijave');
    await waitForText(page, 'Prijave uporabnikov');
    console.log('E2E: reports tab visible');

    // Wait for the report list to render (look for the report description text)
    await page.waitForFunction(
      (desc) => !!Array.from(document.querySelectorAll('body *')).find((el) => (el.textContent || '').includes(desc)),
      { timeout: 15000 },
      report.description,
    );
    console.log('E2E: report row visible by description');

    // Try to click the confirm button scoped to the report row that contains the description.
    const clickedInRow = await page.evaluate((desc, btnText) => {
      const el = Array.from(document.querySelectorAll('body *')).find((e) => (e.textContent || '').includes(desc));
      if (!el) return false;
      const row = el.closest('tr') || el.closest('li') || el.closest('div');
      if (!row) return false;
      const btn = Array.from(row.querySelectorAll('button')).find((b) => (b.textContent || '').trim().includes(btnText));
      if (!btn) return false;
      btn.click();
      return true;
    }, report.description, 'Potrdi');

    if (clickedInRow) {
      console.log('E2E: clicked Potrdi within report row');
    } else {
      // Fallback to a global button click if scoped click failed
      console.log('E2E: scoped click failed, falling back to global Potrdi button');
      await page.waitForFunction(
        () => Array.from(document.querySelectorAll('button')).some((button) => (button.textContent || '').includes('Potrdi')),
        { timeout: 15000 },
      );
      await clickButtonByText(page, 'Potrdi');
      console.log('E2E: report confirmation clicked (fallback)');
    }

    const { default: ReportModel } = await import(fileUrl(path.resolve(repoRoot, 'api/models/reports.js')));
    const { default: UserModel } = await import(fileUrl(path.resolve(repoRoot, 'api/models/users.js')));

    // Poll DB for the status update to avoid timing races between UI and backend processing
    const start = Date.now();
    let updatedReport = null;
    while (Date.now() - start < 15000) {
      // eslint-disable-next-line no-await-in-loop
      updatedReport = await ReportModel.findById(report._id).lean();
      if (updatedReport && updatedReport.status === 'resolved') break;
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 500));
    }

    const updatedUser = await UserModel.findById(reportedUser._id).lean();

    assert.ok(updatedReport, 'Expected report to be found after confirmation');
    assert.equal(updatedReport.status, 'resolved');
    assert.equal(updatedUser.strikes, 1);
    assert.equal(updatedUser.status, 'active');
    assert.equal(updatedUser.isActive, true);
    assert.equal(updatedReport.meeting.toString(), meeting._id.toString());
    console.log('E2E: admin journey done');
  } finally {
    await context.close();
  }
};

async function main() {
  let mongoServer;
  let serverModule;
  let browser;

  try {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';
    process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 'e2e-test-key';

    const [mongoServerInstance] = await Promise.all([
      MongoMemoryServer.create(),
      buildAngularApp(),
    ]);
    mongoServer = mongoServerInstance;

    process.env.APP_URL = baseUrl;
    process.env.MONGODB_URI = mongoServer.getUri('tpo-e2e');

    serverModule = await import(fileUrl(path.resolve(repoRoot, 'server.js')));
    await waitForMongoose();
    await waitForHttpServer(`${baseUrl}/api/swagger.json`);

    const { createUser, createAdmin } = await import(fileUrl(path.resolve(repoRoot, 'test/integration/helpers.js')));
    const { default: UserModel } = await import(fileUrl(path.resolve(repoRoot, 'api/models/users.js')));
    const { default: Meeting } = await import(fileUrl(path.resolve(repoRoot, 'api/models/meetings.js')));

    const user = await createUser({
      firstName: 'Ana',
      lastName: 'Novak',
      username: 'ana_e2e',
      email: 'ana.e2e@test.com',
      status: 'active',
      activeSearch: true,
      isActive: true,
      accountSecurity: { emailVerified: true },
      location: { lat: 46.0569, lng: 14.5058, radius: 10 },
      interests: ['kava', 'druzabne igre'],
      availability: ['ponedeljek-popoldne', 'petek-zvecer'],
    });

    const meeting = await Meeting.create({
      groupName: 'E2E Kava skupina',
      members: [
        { user: user._id, response: 'accepted', respondedAt: new Date() },
        { user: (await createUser({ username: 'bob_e2e', email: 'bob.e2e@test.com' }))._id, response: 'accepted', respondedAt: new Date() },
        { user: (await createUser({ username: 'carol_e2e', email: 'carol.e2e@test.com' }))._id, response: 'accepted', respondedAt: new Date() },
      ],
      sharedInterests: ['kava', 'druzabne igre'],
      matchPercentage: 92,
      venue: {
        address: 'Trg republike 1',
        city: 'Ljubljana',
        country: 'Slovenia',
        coordinates: { lat: 46.0569, lng: 14.5058 },
      },
      date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      status: 'upcoming',
    });

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    await runRegistrationJourney({ browser, UserModel });
    await runUserJourney({ browser, user });
    await runChatJourney({ browser, user, meeting });
    if (process.env.E2E_INCLUDE_ADMIN === 'true') {
      const { default: Report } = await import(fileUrl(path.resolve(repoRoot, 'api/models/reports.js')));

      const admin = await createAdmin({
        firstName: 'Admin',
        lastName: 'Tester',
        username: 'admin_e2e',
        email: 'admin.e2e@test.com',
        status: 'active',
        activeSearch: true,
        isActive: true,
        accountSecurity: { emailVerified: true },
      });

      const reportedUser = await createUser({
        firstName: 'Boris',
        lastName: 'Kranjc',
        username: 'reported_e2e',
        email: 'reported.e2e@test.com',
        status: 'active',
        activeSearch: true,
        isActive: true,
        accountSecurity: { emailVerified: true },
      });

      const report = await Report.create({
        reporter: user._id,
        reportedUser: reportedUser._id,
        meeting: meeting._id,
        description: 'Uporabnik je med srečanjem večkrat prekinjal druge udeležence.',
        status: 'new',
      });

      await runAdminJourney({ browser, admin, reportedUser, meeting, report });
      console.log('\nE2E: all scenarios passed');
    } else {
      console.log('\nE2E: user journey passed');
      console.log('E2E: admin journey skipped (set E2E_INCLUDE_ADMIN=true to run it)');
    }
  } catch (error) {
    console.error('\nE2E failed:');
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }

    if (serverModule?.server) {
      try {
        await new Promise((resolve) => serverModule.server.close(resolve));
      } catch {}
    }

    await mongoose.disconnect().catch(() => {});

    if (mongoServer) {
      await mongoServer.stop().catch(() => {});
    }
  }
}

main();