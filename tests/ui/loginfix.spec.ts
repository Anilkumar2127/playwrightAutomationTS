import { test, expect } from '../../src/fixtures/myfixtures';
import { logger } from '../../src/utilities/logger';



test.beforeEach(async({lgPage})=>{
        logger.info('Opening OrangeHRM login page');
        await lgPage.launchUrl();        
});
test('Login to Orange HRM @uitests',async({lgPage})=>{
    logger.info('Signing in with the UI test account');
    await lgPage.doLogin('Admin','admin123');
    logger.info('Login action completed');
})