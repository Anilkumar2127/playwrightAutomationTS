import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class HomePage extends BasePage{
   
    private readonly pageheader:Locator;
    private readonly items:Locator;

    constructor(page:Page){
        super(page);
        this.pageheader=this.page.locator('.app_logo');
        this.items=  this.page.locator('[data-test="inventory-item-name"]')
    }


    async getitems():Promise<string[]>{
        await this.items.first().waitFor({state:'visible'});
        let listOfitems:Locator[]=await this.items.all();
        let autItemsList:string[]=[];
        for(let l of listOfitems){
           let itemName:string=await l.innerText();
            autItemsList.push(itemName);
        }
        return autItemsList;
    }

    async getPageHeader(){
        return this.pageheader.innerText();
    }
}