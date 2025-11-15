const BasePage = require('./BasePage.page');
const selectors = require('../selectors/CartSelectors');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async waitForPageLoad() {
    await this.waitForElement(selectors.cartContainer);
  }

  async getAllCartItems() {
    return await this.getElements(selectors.cartItem);
  }

  async getCartItemByIndex(index) {
    const items = await this.getAllCartItems();
    return items[index];
  }

  async getCartItemByName(productName) {
    const items = await this.getAllCartItems();

    for (const item of items) {
      const name = await item.$eval(selectors.itemName, el => el.textContent.trim());
      if (name === productName) return item;
    }

    throw new Error(`Product with name "${productName}" not found in cart.`);
  }

  async getItemPriceByName(productName) {
    const item = await this.getCartItemByName(productName);
    return await item.$eval(selectors.itemPrice, el => el.textContent.trim());
  }

  async getItemQuantityByName(productName) {
    const item = await this.getCartItemByName(productName);
    const quantityElement = await item.$(selectors.itemQuantity);
    if (!quantityElement) return 1;
    const text = await quantityElement.textContent();
    return parseInt(text.trim(), 10);
  }

  async removeItemByName(productName) {
    const item = await this.getCartItemByName(productName);
    const removeButton = await item.$(selectors.removeButton);
    await removeButton.click();
  }

  async removeItemByIndex(index) {
    const items = await this.getAllCartItems();
    if (!items[index]) {
      throw new Error(`Cart item index "${index}" not found.`);
    }
    const removeButton = await items[index].$(selectors.removeButton);
    await removeButton.click();
  }

  async clickContinueShopping() {
    await this.click(selectors.continueShoppingButton);
  }

  async clickCheckout() {
    await this.click(selectors.checkoutButton);
  }

  async getCartItemsCount() {
    const items = await this.getAllCartItems();
    return items.length;
  }
}

module.exports = CartPage;

