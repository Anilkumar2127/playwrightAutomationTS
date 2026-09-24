import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class HomePage extends BasePage{
        //private variables
    private readonly dashBoardHeader:Locator;
    private readonly modules:Locator;
    private readonly orangeHRMIncLink:Locator;
    constructor(page:Page){
        super(page);
        this.dashBoardHeader=page.getByRole('heading',{name:'Dashboard',level:6});
        this.modules=page.locator('.oxd-sidepanel-body span');
        this.orangeHRMIncLink=page.getByRole('link',{name:'OrangeHRM, Inc'});

    }
//public methods
    public async isDashBoardVisible():Promise<boolean>{
        await this.dashBoardHeader.waitFor({state:'visible'});
        return this.dashBoardHeader.isVisible();
    }

    public async getApplicationModules():Promise<string[]>{
        await this.modules.first().waitFor({state:'visible'});
       return await this.modules.allInnerTexts();
    }

    public async clickOnOrangeHRMIncLink(){
        await this.orangeHRMIncLink.click();
    }

    public async switchToLiveProductWindow():Promise<void>{

        const [childWindow]=await Promise.all([
             this.page.context().waitForEvent('page'),
             this.clickOnOrangeHRMIncLink()
        ])
        await childWindow.waitForLoadState('load');
        
    }
}