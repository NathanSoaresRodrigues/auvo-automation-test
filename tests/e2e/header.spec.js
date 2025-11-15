const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/Login.page');
const InventoryPage = require('../../pages/Inventory.page');
const ProductDetailsPage = require('../../pages/ProductDetails.page');
const Header = require('../../pages/Header.page');
const headerSelectors = require('../../selectors/HeaderSelectors');
const inventorySelectors = require('../../selectors/InventorySelectors');
const loginSelectors = require('../../selectors/LoginSelectors');
const cartSelectors = require('../../selectors/CartSelectors');
const users = require('../../fixtures/users.json');
const products = require('../../fixtures/products.json');

test.describe('Header Tests', () => {
  let loginPage;
  let inventoryPage;
  let header;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    header = new Header(page);
    await page.goto('/');
    await loginPage.login(users.users[0], users.password);
    await inventoryPage.waitForPageLoad();
  });

  test('TC-HEADER-001: Abrir menu hambúrguer', async ({ page }) => {
    // Arrange
    // Login já realizado no beforeEach

    // Act
    await header.open();

    // Assert
    expect(await header.isOpen()).toBe(true);
    await expect(page.locator(headerSelectors.allItems)).toBeVisible();
    await expect(page.locator(headerSelectors.about)).toBeVisible();
    await expect(page.locator(headerSelectors.logout)).toBeVisible();
    await expect(page.locator(headerSelectors.resetAppState)).toBeVisible();
    await expect(page.locator(headerSelectors.closeMenuButton)).toBeVisible();
  });

  test('TC-HEADER-002: Fechar menu hambúrguer', async ({ page }) => {
    // Arrange
    await header.open();
    expect(await header.isOpen()).toBe(true);

    // Act
    await header.close();
    await page.waitForTimeout(500); // Timeout adicionado para garantir que a animação de fechamento do menu foi concluída

    // Assert
    expect(await header.isOpen()).toBe(false);
    await expect(page.locator(headerSelectors.allItems)).not.toBeVisible();
    await expect(page.locator(headerSelectors.menuButton)).toBeVisible();
  });

  test('TC-HEADER-003: Clicar em "All Items"', async ({ page }) => {
    // Arrange
    await inventoryPage.openProductDetailsByName(products[0].name);
    await header.open();

    // Act
    await header.clickAllItems();

    // Assert
    expect(page.url()).toContain('/inventory.html');
    await expect(page.locator(inventorySelectors.inventoryContainer)).toBeVisible();
  });

  test('TC-HEADER-004: Clicar em "About"', async ({ page }) => {
    // Arrange
    await header.open();

    // Act
    await page.locator(headerSelectors.about).click();

    // Assert
    await expect(page).toHaveURL(/saucelabs\.com/);
  });

  test('TC-HEADER-005: Fazer logout', async ({ page }) => {
    // Arrange
    await header.open();

    // Act
    await header.clickLogout();

    // Assert
    expect(page.url()).toContain('/');
    await expect(page.locator(loginSelectors.username)).toBeVisible();
    await expect(page.locator(loginSelectors.password)).toBeVisible();
  });

  test('TC-HEADER-006: Resetar estado da aplicação', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await inventoryPage.addProductToCartByName(products[1].name, products);
    expect(await header.getCartBadgeCount()).toBe(2);
    await header.open();

    // Act
    await header.clickResetAppState();
    await page.reload();
    await inventoryPage.waitForPageLoad(); // Esperar a página recarregar após o reset para atualização dos estados na tela
    const badgeVisible = await header.isCartBadgeVisible();

    // Assert
    expect(badgeVisible).toBe(false);
    await expect(page.locator(inventorySelectors.addToCartButton(products[0].id))).toBeVisible();
    await expect(page.locator(inventorySelectors.addToCartButton(products[1].id))).toBeVisible();
  });

  test('TC-HEADER-007: Verificar badge do carrinho', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await inventoryPage.addProductToCartByName(products[1].name, products);

    // Act
    const badgeCount = await header.getCartBadgeCount();
    const badgeVisible = await header.isCartBadgeVisible();

    // Assert
    expect(badgeCount).toBe(2);
    expect(badgeVisible).toBe(true);
  });

  test('TC-HEADER-008: Acessar carrinho pelo header', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await inventoryPage.addProductToCartByName(products[1].name, products);

    // Act
    await header.clickShoppingCart();

    // Assert
    expect(page.url()).toContain('/cart.html');
    await expect(page.locator(cartSelectors.cartContainer)).toBeVisible();
    const cartItems = await page.locator(cartSelectors.cartItem).count();
    expect(cartItems).toBe(2);
  });

  test('TC-HEADER-009: Verificar badge quando carrinho está vazio', async ({ page }) => {
    // Arrange
    await header.open();
    await header.clickResetAppState();

    // Act
    const badgeVisible = await header.isCartBadgeVisible();
    const badgeCount = await header.getCartBadgeCount();

    // Assert
    expect(badgeVisible).toBe(false);
    expect(badgeCount).toBe(0);
  });
});

