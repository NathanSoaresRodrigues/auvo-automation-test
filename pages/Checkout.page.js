const BasePage = require('./BasePage.page');
const selectors = require('../selectors/CheckoutSelectors');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async fillCheckoutInformation(firstName, lastName, postalCode) {
    await this.fillInput(selectors.firstName, firstName);
    await this.fillInput(selectors.lastName, lastName);
    await this.fillInput(selectors.postalCode, postalCode);
  }

  async clickContinue() {
    await this.click(selectors.continueButton);
  }

  async clickCancel() {
    await this.click(selectors.cancelButton);
  }

  async clickFinish() {
    await this.click(selectors.finishButton);
  }

  async clickBackHome() {
    await this.click(selectors.backHomeButton);
  }

  async getAllCheckoutItems() {
    return await this.getElements(selectors.cartItem);
  }

  async getCheckoutItemByName(productName) {
    const items = await this.getAllCheckoutItems();

    for (const item of items) {
      const name = await item.$eval(selectors.itemName, el => el.textContent.trim());
      if (name === productName) return item;
    }

    throw new Error(`Product with name "${productName}" not found in checkout.`);
  }

  async getItemPriceByName(productName) {
    const item = await this.getCheckoutItemByName(productName);
    return await item.$eval(selectors.itemPrice, el => el.textContent.trim());
  }

  async getPaymentInfo() {
    const summaryInfo = await this.page.$$(selectors.paymentValue);
    if (summaryInfo.length >= 1) {
      return await summaryInfo[0].textContent();
    }
    return null;
  }

  async getShippingInfo() {
    const summaryInfo = await this.page.$$(selectors.shippingValue);
    if (summaryInfo.length >= 2) {
      return await summaryInfo[1].textContent();
    }
    return null;
  }

  async getSubtotal() {
    const text = await this.getText(selectors.subtotal);
    return this.extractPrice(text);
  }

  async getTax() {
    const text = await this.getText(selectors.tax);
    return this.extractPrice(text);
  }

  async getTotal() {
    const text = await this.getText(selectors.total);
    return this.extractPrice(text);
  }

  async getCompleteHeader() {
    return await this.getText(selectors.completeHeader);
  }

  async getCompleteText() {
    return await this.getText(selectors.completeText);
  }

  extractPrice(text) {
    const match = text.match(/\$?(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }
}

module.exports = CheckoutPage;

