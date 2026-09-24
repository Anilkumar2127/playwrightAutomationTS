import { test, expect } from '../../src/fixtures/myfixtures';



test.beforeEach(async({lgPage})=>{
        await lgPage.launchUrl();        
});
test('Login to Orange HRM @uitests',async({lgPage})=>{
    await lgPage.doLogin('Admin','admin123');
})