const BasePage = require('./BasePage.page');
const selectors = require('../selectors/ProductDetailsSelectors');

class ProductDetailsPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async waitForPageLoad() {
    await this.waitForElement(selectors.productName);
  }

  async getProductName() {
    return await this.getText(selectors.productName);
  }

  async getProductDescription() {
    return await this.getText(selectors.productDescription);
  }

  async getProductPrice() {
    return await this.getText(selectors.productPrice);
  }

  async addToCart() {
    await this.click(selectors.addToCartButton);
  }

  async removeFromCart() {
    await this.click(selectors.removeFromCartButton);
  }

  async isAddToCartButtonVisible() {
    return await this.isVisible(selectors.addToCartButton);
  }

  async isRemoveButtonVisible() {
    return await this.isVisible(selectors.removeFromCartButton);
  }

  async goBackToProducts() {
    await this.click(selectors.backButton);
  }
}

module.exports = ProductDetailsPage;

