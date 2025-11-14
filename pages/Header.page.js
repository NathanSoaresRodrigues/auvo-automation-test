const BasePage = require('./BasePage.page');
const selectors = require('../selectors/HeaderSelectors');

class Header extends BasePage {
  constructor(page) {
    super(page);
  }

  // Open the hamburger menu
  async open() {
    await this.click(selectors.menuButton);
    await this.waitForElement(selectors.allItems);
  }

  // Check if the menu is open
  async isOpen() {
    return await this.isVisible(selectors.allItems);
  }

  // Ensure the menu is open
  async openIfClosed() {
    if (!await this.isOpen()) {
      await this.open();
    }
  }

  // Click "All Items" (navigates to inventory page)
  async clickAllItems() {
    await this.openIfClosed();
    await this.click(selectors.allItems);
  }

  // Click "About" (navigates to external Sauce Labs page)
  async clickAbout() {
    await this.openIfClosed();
    await this.click(selectors.about);
  }

  // Click "Logout" (logs out the user)
  async clickLogout() {
    await this.openIfClosed();
    await this.click(selectors.logout);
  }

  // Click "Reset App State" (resets the application state)
  async clickResetAppState() {
    await this.openIfClosed();
    await this.click(selectors.resetAppState);
  }

  // Click the shopping cart icon (navigates to the cart)
  async clickShoppingCart() {
    await this.click(selectors.shoppingCart);
  }
}

module.exports = Header;
