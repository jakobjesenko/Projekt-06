const { execSync } = require('child_process');

async function run() {
  try {
    // Require puppeteer lazily so npm install can populate it first
    const puppeteer = require('puppeteer');
    const chromePath = puppeteer.executablePath();

    console.log('Using Chromium from Puppeteer:', chromePath);

    const env = Object.assign({}, process.env, { CHROME_BIN: chromePath });

    // Forward any extra CLI args to `ng test` so we can limit which specs run
    const extra = process.argv.slice(2).join(' ');
    const cmd = `npx ng test --watch=false --no-progress ${extra}`.trim();
    execSync(cmd, { stdio: 'inherit', env });
  } catch (err) {
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  }
}

run();
