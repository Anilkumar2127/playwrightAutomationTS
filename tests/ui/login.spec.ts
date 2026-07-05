import { expect,test } from "@playwright/test"
import { LoginPage } from "../../src/pages/LoginPage"
import { CSVHelper } from "../../src/utilities/csvhelper";

test('Login into application',async({page})=>{
    let loginPage:LoginPage=new LoginPage(page);
    await loginPage.goToLoginPage();
    await loginPage.doLogin("problem_user","secret_sauce");
});

//TestData Scenarios using CSV
let testdata= CSVHelper.csvReader('src/data/loginCred.csv')
       for(let row of testdata){
        test(`Validate the creditions via CSV file with ${row.username}`,async ({page})=>{
             let loginPage:LoginPage=new LoginPage(page);
             await loginPage.goToLoginPage();
             await loginPage.doLogin(row.username,row.password);
       })
    }
