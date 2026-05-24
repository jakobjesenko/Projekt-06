// process.env.CHROME_BIN = require("puppeteer").executablePath();
// // Note: Only use the puppeteer line if you have puppeteer installed.

// // Otherwise, use the standard Ubuntu path:
process.env.CHROME_BIN =
  process.env.CHROME_BIN || require("puppeteer").executablePath();
console.log(process.env.CHROME_BIN);

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "@angular-devkit/build-angular"], // <-- Order matters!

    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"), // <-- Essential for Angular
    ],
    // ... other config
    browsers: ["ChromeHeadlessNoSandbox"],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"],
      },
    },
    singleRun: true, // Ensures the test runner exits after completing
  });
};
