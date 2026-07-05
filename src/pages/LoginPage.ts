import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";



export class LoginPage extends BasePage {

    // private Locators
    private readonly userName:Locator;
    private readonly password:Locator;
    private readonly loginBtn:Locator;


    constructor(page:Page){
        super(page);
        this.userName=page.getByPlaceholder("Username");
        this.password=page.getByPlaceholder("Password");
        this.loginBtn=page.getByRole("button",{name:'Login'});
    }

    //page actions methods
     
    async goToLoginPage():Promise<void>{
        await this.page.goto('https://www.saucedemo.com/');
    }


    async doLogin(username:string,password:string):Promise<void>{
        await this.userName.isVisible();
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.loginBtn.click();

    }
}