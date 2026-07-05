
import {test as basetest }from '@playwright/test';
import { APIHelper } from '../api/apiutilites/apihelper';

type apifixture={
    apihelper:APIHelper
}

export let test=basetest.extend<apifixture>(
    {
        apihelper:async({request},use)=>{
            await use(new APIHelper(request,process.env.APIBASEURL!));
        }
    }
)

export {expect} from '@playwright/test';