const BasePage = require('./BasePage.page');
const selectors = require('../selectors/HeaderSelectors');

class Header extends BasePage {
  constructor(page) {
    super(page);
  }

  async open() {
    await this.click(selectors.menuButton);
    await this.waitForElement(selectors.allItems);
  }

  async close() {
    if (await this.isOpen()) {
      await this.click(selectors.closeMenuButton);
    }
  }

  async isOpen() {
    return await this.isVisible(selectors.allItems);
  }

  async openIfClosed() {
    if (!await this.isOpen()) {
      await this.open();
    }
  }

  async clickAllItems() {
    await this.openIfClosed();
    await this.click(selectors.allItems);
  }

  async clickAbout() {
    await this.openIfClosed();
    await this.click(selectors.about);
  }

  async clickLogout() {
    await this.openIfClosed();
    await this.click(selectors.logout);
  }

  async clickResetAppState() {
    await this.openIfClosed();
    await this.click(selectors.resetAppState);
  }

  async clickShoppingCart() {
    await this.click(selectors.shoppingCart);
  }

  async getCartBadgeCount() {
    const badge = await this.page.$(selectors.shoppingCartBadge);
    if (!badge) return 0;
    const text = await badge.textContent();
    return parseInt(text.trim(), 10);
  }

  async isCartBadgeVisible() {
    return await this.isVisible(selectors.shoppingCartBadge);
  }
}

module.exports = Header;
