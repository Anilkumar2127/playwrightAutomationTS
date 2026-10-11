import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { logger } from "../utilities/logger";

export class AdminPage extends BasePage {
    private readonly adminMenuItem: Locator;
    private readonly systemUsersHeader: Locator;
    private readonly usernameFilter: Locator;
    private readonly searchButton: Locator;
    private readonly resetButton: Locator;
    private readonly userRows: Locator;

    constructor(page: Page) {
        super(page);
        this.adminMenuItem = page.getByRole('link', { name: 'Admin', exact: true });
        this.systemUsersHeader = page.getByRole('heading', { name: 'System Users' });
        this.usernameFilter = page.locator('.oxd-input-group')
            .filter({ hasText: 'Username' })
            .locator('input');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.userRows = page.locator('.oxd-table-body .oxd-table-row');
    }

    public async openSystemUsers(): Promise<void> {
        logger.info('Opening the Admin module');
        await this.adminMenuItem.click();
        logger.info('Waiting for the System Users page');
        await this.systemUsersHeader.waitFor({ state: 'visible' });
    }

    public async isSystemUsersPageVisible(): Promise<boolean> {
        logger.info('Checking System Users heading visibility');
        return this.systemUsersHeader.isVisible();
    }

    public async searchByUsername(username: string): Promise<void> {
        logger.info('Entering the username filter');
        await this.usernameFilter.fill(username);
        logger.info('Submitting the System Users search');
        await this.searchButton.click();
    }

    public async getUserRows(): Promise<string[]> {
        logger.info('Waiting for System Users search results');
        await this.userRows.first().waitFor({ state: 'visible' });
        return (await this.userRows.allInnerTexts()).map(row=>row.toLowerCase());
    }

    public async resetSearch(): Promise<void> {
        logger.info('Resetting the System Users filters');
        await this.resetButton.click();
    }

    public async getUsernameFilterValue(): Promise<string> {
        logger.info('Reading the username filter value');
        return this.usernameFilter.inputValue();
    }
}
