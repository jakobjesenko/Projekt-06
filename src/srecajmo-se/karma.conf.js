module.exports({
  browsers: ["Chrome", "ChromeHeadless", "ChromeHeadlessCI"],
  customLaunchers: {
    ChromeHeadlessCI: {
      base: "ChromeHeadless",
      flags: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    },
  },
  files: ["test/**/*.js"],
});
