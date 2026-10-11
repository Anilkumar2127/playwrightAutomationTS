import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

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
        await this.adminMenuItem.click();
        await this.systemUsersHeader.waitFor({ state: 'visible' });
    }

    public async isSystemUsersPageVisible(): Promise<boolean> {
        return this.systemUsersHeader.isVisible();
    }

    public async searchByUsername(username: string): Promise<void> {
        await this.usernameFilter.fill(username);
        await this.searchButton.click();
    }

    public async getUserRows(): Promise<string[]> {
        await this.userRows.first().waitFor({ state: 'visible' });
        return this.userRows.allInnerTexts();
    }

    public async resetSearch(): Promise<void> {
        await this.resetButton.click();
    }

    public async getUsernameFilterValue(): Promise<string> {
        return this.usernameFilter.inputValue();
    }
}
