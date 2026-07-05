import test, { expect } from "@playwright/test";
import { HomePage } from "../../src/pages/HomePage";
import { LoginPage } from "../../src/pages/LoginPage";

let hmpage:HomePage;
let lgPage:LoginPage;

test.beforeEach(async ({page})=>{
        hmpage=new HomePage(page);
        lgPage=new LoginPage(page);
        await lgPage.goToLoginPage();
        await lgPage.doLogin("problem_user","secret_sauce");
});

test('Validate the Homepage header text',async()=>{
    expect(await hmpage.getPageHeader()).toContain('Swag');
})

test('Validate the items in homepage',async()=>{
        console.log('Items : ' + await hmpage.getitems());
})

