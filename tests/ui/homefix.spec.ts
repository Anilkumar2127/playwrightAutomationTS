
import {test,expect}  from '../../src/fixtures/myfixtures';
import { logger } from '../../src/utilities/logger';

test.beforeEach(async({lgPage})=>{
         logger.info('Opening OrangeHRM login page');
         await lgPage.launchUrl();
         logger.info('Signing in with the UI test account');
        await lgPage.doLogin('Admin','admin123');
})

test('Verify DashBoard page loaded @uitests',async({hmpage})=>{
    logger.info('Checking that the Dashboard header is visible');
    expect(await hmpage.isDashBoardVisible(),'Veirfying the dashboard header is visible').toBeTruthy();
})

test('Verify application modules are displayed @uitests',async({hmpage})=>{
        logger.info('Reading the application navigation modules');
        const modules = await hmpage.getApplicationModules();
        logger.info(`Verifying the expected navigation modules among ${modules.length} displayed modules`);
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
        logger.info('Opening the OrangeHRM, Inc link');
        await hmpage.clickOnOrangeHRMIncLink();
})

test('Verify OrangeHRMInc opens the live product site in a new window @uitests',async({page,hmpage})=>{
        logger.info('Opening OrangeHRM, Inc in a new window');
        const [liveProductPage] = await Promise.all([
                page.waitForEvent('popup'),
                hmpage.clickOnOrangeHRMIncLink()
        ]);
        logger.info('Waiting for the live product site to load');
        await liveProductPage.waitForLoadState('domcontentloaded');
        logger.info(`Verifying popup destination: ${liveProductPage.url()}`);
        expect(liveProductPage.url()).toContain('orangehrm.com');
})

test('Verify live product page has footer links @uitests',async({livePage})=>{
        logger.info('Reading live product page footer links');
        const footerLinks = await livePage.getAllFooterLinks();
        logger.info(`Verifying the footer contains links (found ${footerLinks.length})`);
        expect(footerLinks.length).toBeGreaterThan(0);
})

test('Verify OrangeHRMInc is naviagble to LiveProduct Window @uitests',async({hmpage,livePage})=>{
        logger.info('Opening the Contact Sales destination from the live product page');
        await livePage.clickContactSalesButton();
        logger.info('Reading footer links from the live product page');
        const footerLinks = await livePage.getAllFooterLinks();
        logger.info(`Retrieved ${footerLinks.length} live product footer links`);
})

test('Verify the dashboard of homepage when navigating back from livePage @uitests',async({hmpage,livePage})=>{
        logger.info('Opening the Contact Sales destination from the live product page');
        await livePage.clickContactSalesButton();
        logger.info('Verifying the original Dashboard remains visible');
        logger.info(`Dashboard visible: ${await hmpage.isDashBoardVisible()}`);
        logger.info('Returning to the live product page');
        await livePage.clickContactSalesButton();
        logger.info('Reading footer links after returning to the live product page');
        const footerLinks = await livePage.getAllFooterLinks();
        logger.info(`Retrieved ${footerLinks.length} live product footer links`);
})