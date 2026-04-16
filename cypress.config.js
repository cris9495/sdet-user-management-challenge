const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      const envName = config.env.environment || 'dev';
      config.env.apiUrl = `${config.baseUrl}/${envName}`;
      return config;
    },
    // Reporter Configuration
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true
    },
    video: true, // Videos are also part of the "testing report"
    screenshotOnRunFailure: true
  },
});