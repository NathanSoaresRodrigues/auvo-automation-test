const BasePage = require('./BasePage.page');
const selectors = require('../selectors/LoginSelectors');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async login(username, password) {
    await this.fillInput(selectors.username, username);
    await this.fillInput(selectors.password, password);
    await this.click(selectors.loginButton);
  }

  async getErrorMessage() {
    const errorSelector = '[data-test="error"]';
    if (await this.isVisible(errorSelector)) {
      return await this.getText(errorSelector);
    }
    return null;
  }
}

module.exports = LoginPage;
