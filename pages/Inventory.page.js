const BasePage = require('./BasePage.page');
const selectors = require('../selectors/InventorySelectors');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // Waits until inventory page is fully loaded
  async waitForPageLoad() {
    await this.waitForElement(selectors.inventoryContainer);
  }

  // Returns all product elements on the page
  async getAllProducts() {
    return await this.getElements(selectors.inventoryItem);
  }

  // Returns a product element by its index on the page
  async getProductByIndex(index) {
    const products = await this.getAllProducts();
    return products[index];
  }

  // Returns a product element by its visible name
  async getProductByName(productName) {
    const products = await this.getAllProducts();

    for (const product of products) {
      const name = await product.$eval(selectors.itemName, el => el.textContent.trim());
      if (name === productName) return product;
    }

    throw new Error(`Product with name "${productName}" not found on inventory list.`);
  }

  // Returns the price of a product by its name
  async getProductPriceByName(productName) {
    const product = await this.getProductByName(productName);
    return await product.$eval(selectors.itemPrice, el => el.textContent.trim());
  }

  // Adds a product to the cart by name
  async addProductToCartByName(productName, productJsonList) {
    const productData = productJsonList.find(p => p.name === productName);

    if (!productData) {
      throw new Error(`Product "${productName}" not found in JSON data.`);
    }

    const buttonSelector = selectors.addToCartButton(productData.id);
    await this.click(buttonSelector);
  }

  // Adds a product to the cart by its index in the JSON data
  async addProductToCartByJsonIndex(index, productJsonList) {
    if (!productJsonList[index]) {
      throw new Error(`Product index "${index}" not found in JSON data.`);
    }

    const productData = productJsonList[index];
    const buttonSelector = selectors.addToCartButton(productData.id);

    await this.click(buttonSelector);
  }

  // Removes a product from the cart by name
  async removeProductFromCartByName(productName, productJsonList) {
    const productData = productJsonList.find(p => p.name === productName);

    if (!productData) {
      throw new Error(`Product "${productName}" not found in JSON data.`);
    }

    const buttonSelector = selectors.removeFromCartButton(productData.id);
    await this.click(buttonSelector);
  }

  // Open product details by name
  async openProductDetailsByName(productName) {
    const product = await this.getProductByName(productName);
    await product.click();
  }
}

module.exports = InventoryPage;