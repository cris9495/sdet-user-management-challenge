const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // Set default environment to dev if not provided
      const envName = config.env.environment || 'dev';
      config.env.apiUrl = `${config.baseUrl}/${envName}`;
      return config;
    },
    video: false,
    screenshotOnRunFailure: false
  },
});