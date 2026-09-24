import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";




export class LoginPage extends BasePage{

    //private variables
    private readonly userNameField:Locator;
    private readonly userPassword:Locator;
    private readonly loginbutton:Locator;

    constructor(page:Page){
        super(page);
        this.userNameField=page.getByRole('textbox',{name:'Username'});
        this.userPassword=page.getByRole('textbox',{name :'Password'});
        this.loginbutton=page.getByRole('button',{name : 'Login'});
    }
//public methods

    public async launchUrl():Promise<void>{
        await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    }
    public async doLogin(username:string,password:string):Promise<void>{
        await this.userNameField.fill(username);
        await this.userPassword.fill(password);
        await this.loginbutton.click();
    }
}