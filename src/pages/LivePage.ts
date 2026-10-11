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
        logger.info('Clicking the Contact Sales button')
        await this.contactSalesButton.click();
    }

    public async getAllFooterLinks():Promise<string[]>{
        logger.info('Scrolling to the live product page footer');
        await this.footerLinks.first().scrollIntoViewIfNeeded();
        logger.info('Reading live product page footer links');
        return await this.footerLinks.allInnerTexts();
    }

}