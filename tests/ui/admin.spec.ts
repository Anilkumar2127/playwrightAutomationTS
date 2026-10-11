import { test, expect } from '../../src/fixtures/myfixtures';
import { AdminPage } from '../../src/pages/AdminPage';
import { logger } from '../../src/utilities/logger';


const username = process.env.USERNAME || 'admin';
const password = process.env.PASSWORD || 'admin123';
test.beforeEach(async ({ lgPage }) => {
    logger.info('Opening OrangeHRM login page');
    await lgPage.launchUrl();
    logger.info('Signing in with credentials loaded from the environment');
    await lgPage.doLogin(username, password);
});

test('Verify Admin opens the System Users page @uitests @smoke', async ({ page }) => {
    logger.info('Creating the Admin page object');
    const adminPage = new AdminPage(page);
    logger.info('Opening the System Users page');
    await adminPage.openSystemUsers();

    logger.info('Verifying the System Users page is visible');
    expect(await adminPage.isSystemUsersPageVisible()).toBeTruthy();
});

test('Verify the signed-in user can be found in System Users @uitests', async ({ page }) => {
    logger.info('Creating the Admin page object');
    const adminPage = new AdminPage(page);
    logger.info('Opening the System Users page');
    await adminPage.openSystemUsers();
    logger.info('Searching System Users by the configured username');
    await adminPage.searchByUsername(username);

    logger.info('Reading the filtered System Users rows');
    const userRows = await adminPage.getUserRows();
    logger.info(`Found ${userRows.length} matching System Users row(s)`);
    logger.info('Verifying that the configured username is present');
    expect(userRows.some(row => row.includes(username.toLowerCase()))).toBeTruthy();
});

test('Verify Reset clears the System Users username filter @uitests @smoke', async ({ page }) => {
    logger.info('Creating the Admin page object');
    const adminPage = new AdminPage(page);
    logger.info('Opening the System Users page');
    await adminPage.openSystemUsers();
    logger.info('Filtering System Users by the configured username');
    await adminPage.searchByUsername(username);
    logger.info('Resetting System Users search filters');
    await adminPage.resetSearch();

    logger.info('Verifying the username filter is empty after reset');
    expect(await adminPage.getUsernameFilterValue()).toBe('');
});
