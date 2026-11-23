const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://www.tvmaze.com',
        specPattern: 'cypress/e2e/tvmaze/**/*.cy.js',
        supportFile: 'cypress/support/tvmaze-e2e.js',
        viewportWidth: 1280,
        viewportHeight: 800,
        defaultCommandTimeout: 15000,
    },
});
