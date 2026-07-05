import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv'; 
import path from 'path';

// 1. FIRST: Load the central root .env file to populate process.env.ENV
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 2. SECOND: Now process.env.ENV will correctly equal 'preprod'
const env = process.env.ENV || 'nonprod'; 
console.log(`Running tests on ${env}...`);

// 3. THIRD: Load the specific environment file based on that variable
dotenv.config({ path: path.resolve(__dirname, `../env/${env}.env`), override: true });
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';


/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  testDir: '../tests/api/',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: Number(process.env.RETRIES),
  /* Opt out of parallel tests on CI. */
  workers: Number(process.env.PARALLELMODE),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
                ['html' , {outputFolder:path.resolve(__dirname,'../reports/finalreport')}]
              ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'https://naveenautomationlabs.com/',
     screenshot:'only-on-failure',
     video:'retain-on-failure',
    trace: 'on-first-retry',
    headless:process.env.CI?false:true,
    viewport: null,
    launchOptions:{
      args : ['--start-maximized']
    }
  },
  timeout:60000,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

});
