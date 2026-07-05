import { test, expect } from '../../src/fixtures/myfixtures';


test('Login into application @uitests', async ({ lgPage }) => {

    await lgPage.goToLoginPage();
    await lgPage.doLogin("problem_user", "secret_sauce");
});


test('Login into application via datasupplier @uitests', async ({ lgPage, datasupplier }) => {

    for (let row of datasupplier) {
        await lgPage.goToLoginPage();
        await lgPage.doLogin(row.username, row.password);
    }

});