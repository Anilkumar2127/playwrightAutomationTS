import{test as basetest} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CSVHelper } from '../utilities/csvhelper';
import { LivePage } from '../pages/LivePage';

type myfixture={
    lgPage:LoginPage,
    hmpage:HomePage,
    livePage:LivePage
    datasupplier:Record<string,string>[],
}

export let test=basetest.extend<myfixture>({
    lgPage:async ({page},use)=>{
       await use(new LoginPage(page));
    },
    hmpage:async ({page},use)=>{
       await  use(new HomePage(page));
    },
    livePage: async ({ page, hmpage }, use) => {

        const [newWindow] = await Promise.all([
            page.waitForEvent('popup'),
            hmpage.clickOnOrangeHRMIncLink()
        ]);

        await newWindow.waitForLoadState('load');

        try {
            await use(new LivePage(newWindow));
        } finally {
            if (!newWindow.isClosed()) {
                await newWindow.close();
            }
        }
    },

    datasupplier:async ({},use)=>{
        await use(CSVHelper.csvReader('src/data/loginCred.csv'))
    }
})

export {expect} from '@playwright/test';