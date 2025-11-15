const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/Login.page');
const InventoryPage = require('../../pages/Inventory.page');
const inventorySelectors = require('../../selectors/InventorySelectors');
const users = require('../../fixtures/users.json');
const errorMessages = require('../../fixtures/errorMessages.json');

test.describe('Login Page Tests', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await page.goto('/');
  });

  test('TC-LOGIN-001: Login com usuário e senha corretos', async ({ page }) => {
    // Arrange
    const username = users.users[0];
    const password = users.password;

    // Act
    await loginPage.login(username, password);
    await inventoryPage.waitForPageLoad();

    // Assert
    expect(page.url()).toContain('/inventory.html');
    await expect(page.locator(inventorySelectors.inventoryContainer)).toBeVisible();
  });

  test('TC-LOGIN-002: Login com usuário correto e senha incorreta', async ({ page }) => {
    // Arrange
    const username = users.users[0];
    const wrongPassword = 'senha_incorreta';

    // Act
    await loginPage.login(username, wrongPassword);

    // Assert
    expect(page.url()).toContain('/');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(errorMessages.login.invalidCredentials);
  });

  test('TC-LOGIN-003: Login com usuário incorreto e senha correta', async ({ page }) => {
    // Arrange
    const wrongUsername = 'usuario_inexistente';
    const password = users.password;

    // Act
    await loginPage.login(wrongUsername, password);

    // Assert
    expect(page.url()).toContain('/');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(errorMessages.login.invalidCredentials);
  });

  test('TC-LOGIN-004: Login com usuário e senha vazios', async ({ page }) => {
    // Arrange
    // Nenhum dado necessário

    // Act
    await loginPage.click('[data-test="login-button"]');

    // Assert
    expect(page.url()).toContain('/');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(errorMessages.login.usernameRequired);
  });

  test('TC-LOGIN-005: Login com usuário vazio', async ({ page }) => {
    // Arrange
    const password = users.password;

    // Act
    await loginPage.fillInput('[data-test="password"]', password);
    await loginPage.click('[data-test="login-button"]');

    // Assert
    expect(page.url()).toContain('/');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(errorMessages.login.usernameRequired);
  });

  test('TC-LOGIN-006: Login com senha vazia', async ({ page }) => {
    // Arrange
    const username = users.users[0];

    // Act
    await loginPage.fillInput('[data-test="username"]', username);
    await loginPage.click('[data-test="login-button"]');

    // Assert
    expect(page.url()).toContain('/');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(errorMessages.login.passwordRequired);
  });
});

