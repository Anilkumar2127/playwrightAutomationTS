
import {test,expect}  from '../../src/fixtures/myfixtures';



test.beforeEach(async ({lgPage})=>{

        await lgPage.goToLoginPage();
        await lgPage.doLogin("problem_user","secret_sauce");
});

test('Validate the Homepage header text @uitests',async({hmpage})=>{
    expect(await hmpage.getPageHeader()).toContain('Swag');
})

test('Validate the items in homepage @uitests',async({hmpage})=>{
        console.log('Items : ' + await hmpage.getitems());
})