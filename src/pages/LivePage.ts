import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import {logger} from "../utilities/logger"

export class LivePage extends BasePage{

    //privaet variables

    private readonly contactSalesButton:Locator;
    private readonly footerLinks:Locator;


    constructor(page:Page){
        super(page);
        this.contactSalesButton=page.locator('.lan-menu-website a button').last();
        this.footerLinks=page.locator('.footer-main li a');
    }

    public async clickContactSalesButton():Promise<void>{
        logger.info('Clicking the contact sales Button')
        await this.contactSalesButton.click();
    }

    public async getAllFooterLinks():Promise<string[]>{
        await this.footerLinks.first().scrollIntoViewIfNeeded();
        logger.info('Fecting the footer links text');
        return await this.footerLinks.allInnerTexts();
    }

}