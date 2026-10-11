import { test, expect } from '../../src/fixtures/myfixtures';
import { AdminPage } from '../../src/pages/AdminPage';

function getRequiredEnvironmentVariable(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

const username = getRequiredEnvironmentVariable('USERNAME');
const password = getRequiredEnvironmentVariable('PASSWORD');

test.beforeEach(async ({ lgPage }) => {
    await lgPage.launchUrl();
    await lgPage.doLogin(username, password);
});

test('Verify Admin opens the System Users page @uitests', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.openSystemUsers();

    expect(await adminPage.isSystemUsersPageVisible()).toBeTruthy();
});

test('Verify the signed-in user can be found in System Users @uitests', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.openSystemUsers();
    await adminPage.searchByUsername(username);

    const userRows = await adminPage.getUserRows();
    expect(userRows.some(row => row.includes(username))).toBeTruthy();
});

test('Verify Reset clears the System Users username filter @uitests', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.openSystemUsers();
    await adminPage.searchByUsername(username);
    await adminPage.resetSearch();

    expect(await adminPage.getUsernameFilterValue()).toBe('');
});
