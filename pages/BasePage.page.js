// Base Page Object - contains common methods used across all page objects
class BasePage {
  constructor(page) {
    this.page = page;
  }

  // Navigate to a specific URL
  async navigateTo(url) {
    await this.page.goto(url);
  }

  // Get current page URL
  getCurrentUrl() {
    return this.page.url();
  }

  // Wait for a selector to be visible
  async waitForElement(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  // Fill input field
  async fillInput(selector, text) {
    await this.page.fill(selector, text);
  }

  // Click an element
  async click(selector) {
    await this.page.click(selector);
  }

  // Get text content of an element
  async getText(selector) {
    return await this.page.textContent(selector);
  }

  // Check if an element is visible
  async isVisible(selector) {
    try {
      return await this.page.isVisible(selector);
    } catch (e) {
      return false;
    }
  }

  // Wait for a navigation to complete
  async waitForNavigation(action) {
    await Promise.all([
      this.page.waitForNavigation(),
      action()
    ]);
  }

  // Get multiple elements by selector
  async getElements(selector) {
    return await this.page.$$(selector);
  }

  // Get single element by selector
  async getElement(selector) {
    return await this.page.$(selector);
  }

  // Get attribute value from an element
  async getAttribute(selector, attributeName) {
    return await this.page.getAttribute(selector, attributeName);
  }

  // Wait for a specified timeout
  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }
}

module.exports = BasePage;
