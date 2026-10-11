
import {test,expect}  from '../../src/fixtures/myfixtures';
import { logger } from '../../src/utilities/logger';

test.beforeEach(async({lgPage})=>{
         await lgPage.launchUrl();      
        await lgPage.doLogin('Admin','admin123');
})

test('Verify DashBoard page loaded @uitests',async({hmpage})=>{
    expect(await hmpage.isDashBoardVisible(),'Veirfying the dashboard header is visible').toBeTruthy();
})

test('Verify application modules are displayed @uitests',async({hmpage})=>{
        const modules = await hmpage.getApplicationModules();
        expect(modules).toEqual(expect.arrayContaining([
                'Admin',
                'PIM',
                'Leave',
                'Time',
                'Recruitment',
                'My Info',
                'Performance',
                'Dashboard',
                'Directory'
        ]));
        expect(modules.length).toBeGreaterThan(0);
})

test('Verify OrangeHRMInc Link is clicable @uitests',async({hmpage})=>{
        logger.info('Clicking on OrangeHRMINC Link');
       await hmpage.clickOnOrangeHRMIncLink();
})

test('Verify OrangeHRMInc opens the live product site in a new window @uitests',async({page,hmpage})=>{
        const [liveProductPage] = await Promise.all([
                page.waitForEvent('popup'),
                hmpage.clickOnOrangeHRMIncLink()
        ]);
        await liveProductPage.waitForLoadState('domcontentloaded');
        expect(liveProductPage.url()).toContain('orangehrm.com');
})

test('Verify live product page has footer links @uitests',async({livePage})=>{
        const footerLinks = await livePage.getAllFooterLinks();
        expect(footerLinks.length).toBeGreaterThan(0);
})

test('Verify OrangeHRMInc is naviagble to LiveProduct Window @uitests',async({hmpage,livePage})=>{
        await livePage.clickContactSalesButton();
        console.log('Footer links',await livePage.getAllFooterLinks());
})

test('Verify the dashboard of homepage when navigating back from livePage @uitests',async({hmpage,livePage})=>{
        logger.info('Clicking contact sales button');
        await livePage.clickContactSalesButton();
        console.log('Is visible ',await hmpage.isDashBoardVisible());
        await livePage.clickContactSalesButton();
        logger.info('Fetching the footerlinks');
        console.log('Footer Links second time',await livePage.getAllFooterLinks());
})