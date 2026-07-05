import{test as basetest} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CSVHelper } from '../utilities/csvhelper';

type myfixture={
    lgPage:LoginPage,
    hmpage:HomePage,
    datasupplier:Record<string,string>[],
}

export let test=basetest.extend<myfixture>({
    lgPage:async ({page},use)=>{
       await use(new LoginPage(page));
    },
    hmpage:async ({page},use)=>{
       await  use(new HomePage(page));
    },
    datasupplier:async ({},use)=>{
        await use(CSVHelper.csvReader('src/data/loginCred.csv'))
    }
})

export {expect} from '@playwright/test';