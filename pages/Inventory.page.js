const BasePage = require('./BasePage.page');
const selectors = require('../selectors/InventorySelectors');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async waitForPageLoad() {
    await this.waitForElement(selectors.inventoryContainer);
  }

  async getAllProducts() {
    return await this.getElements(selectors.inventoryItem);
  }

  async getProductByIndex(index) {
    const products = await this.getAllProducts();
    return products[index];
  }

  async getProductByName(productName) {
    const products = await this.getAllProducts();

    for (const product of products) {
      const name = await product.$eval(selectors.itemName, el => el.textContent.trim());
      if (name === productName) return product;
    }

    throw new Error(`Product with name "${productName}" not found on inventory list.`);
  }

  async getProductPriceByName(productName) {
    const product = await this.getProductByName(productName);
    return await product.$eval(selectors.itemPrice, el => el.textContent.trim());
  }

  async addProductToCartByName(productName, productJsonList) {
    const productData = productJsonList.find(p => p.name === productName);

    if (!productData) {
      throw new Error(`Product "${productName}" not found in JSON data.`);
    }

    const buttonSelector = selectors.addToCartButton(productData.id);
    await this.click(buttonSelector);
  }

  async addProductToCartByJsonIndex(index, productJsonList) {
    if (!productJsonList[index]) {
      throw new Error(`Product index "${index}" not found in JSON data.`);
    }

    const productData = productJsonList[index];
    const buttonSelector = selectors.addToCartButton(productData.id);

    await this.click(buttonSelector);
  }

  async removeProductFromCartByName(productName, productJsonList) {
    const productData = productJsonList.find(p => p.name === productName);

    if (!productData) {
      throw new Error(`Product "${productName}" not found in JSON data.`);
    }

    const buttonSelector = selectors.removeFromCartButton(productData.id);
    await this.click(buttonSelector);
  }

  async openProductDetailsByName(productName) {
    const product = await this.getProductByName(productName);
    const nameLink = await product.$(selectors.itemName);
    await nameLink.click();
  }

  async sortProducts(sortOption) {
    await this.page.selectOption(selectors.sortDropdown, sortOption);
  }

  async getSortOption() {
    return await this.page.$eval(selectors.sortDropdown, el => el.value);
  }
}

module.exports = InventoryPage;