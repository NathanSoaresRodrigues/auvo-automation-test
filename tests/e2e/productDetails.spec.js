const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/Login.page');
const InventoryPage = require('../../pages/Inventory.page');
const ProductDetailsPage = require('../../pages/ProductDetails.page');
const Header = require('../../pages/Header.page');
const productDetailsSelectors = require('../../selectors/ProductDetailsSelectors');
const inventorySelectors = require('../../selectors/InventorySelectors');
const users = require('../../fixtures/users.json');
const products = require('../../fixtures/products.json');

test.describe('Product Details Page Tests', () => {
  let loginPage;
  let inventoryPage;
  let productDetailsPage;
  let header;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    header = new Header(page);
    await page.goto('/');
    await loginPage.login(users.users[0], users.password);
    await inventoryPage.waitForPageLoad();
  });

  test('TC-PRODUCTDETAILS-001: Visualizar detalhes do produto', async ({ page }) => {
    // Arrange
    const productName = products[1].name;
    await inventoryPage.openProductDetailsByName(productName);

    // Act
    await productDetailsPage.waitForPageLoad();
    const name = await productDetailsPage.getProductName();
    const description = await productDetailsPage.getProductDescription();
    const price = await productDetailsPage.getProductPrice();

    // Assert
    expect(name).toBe(productName);
    expect(description).toBeTruthy();
    expect(price).toMatch(/^\$\d+\.\d{2}$/);
    await expect(page.locator(productDetailsSelectors.productImage)).toBeVisible();
    expect(await productDetailsPage.isAddToCartButtonVisible()).toBe(true);
  });

  test('TC-PRODUCTDETAILS-002: Adicionar produto ao carrinho na página de detalhes', async ({ page }) => {
    // Arrange
    const productName = products[1].name;
    await inventoryPage.openProductDetailsByName(productName);
    await productDetailsPage.waitForPageLoad();
    expect(await header.isCartBadgeVisible()).toBe(false);

    // Act
    await productDetailsPage.addToCart();
    const badgeCount = await header.getCartBadgeCount();

    // Assert
    expect(await productDetailsPage.isRemoveButtonVisible()).toBe(true);
    expect(badgeCount).toBe(1);
    expect(await header.isCartBadgeVisible()).toBe(true);
  });

  test('TC-PRODUCTDETAILS-003: Remover produto do carrinho na página de detalhes', async ({ page }) => {
    // Arrange
    const productName = products[1].name;
    await inventoryPage.openProductDetailsByName(productName);
    await productDetailsPage.waitForPageLoad();
    await productDetailsPage.addToCart();
    expect(await header.getCartBadgeCount()).toBe(1);

    // Act
    await productDetailsPage.removeFromCart();
    const badgeVisible = await header.isCartBadgeVisible();

    // Assert
    expect(await productDetailsPage.isAddToCartButtonVisible()).toBe(true);
    expect(badgeVisible).toBe(false);
  });

  test('TC-PRODUCTDETAILS-004: Voltar para lista de produtos', async ({ page }) => {
    // Arrange
    const productName = products[1].name;
    await inventoryPage.openProductDetailsByName(productName);
    await productDetailsPage.waitForPageLoad();

    // Act
    await productDetailsPage.goBackToProducts();
    await inventoryPage.waitForPageLoad();

    // Assert
    expect(page.url()).toContain('/inventory.html');
    await expect(page.locator(inventorySelectors.inventoryContainer)).toBeVisible();
  });

  test('TC-PRODUCTDETAILS-005: Verificar estado do botão quando produto está no carrinho', async ({ page }) => {
    // Arrange
    const productName = products[0].name;
    await inventoryPage.addProductToCartByName(productName, products);
    await inventoryPage.openProductDetailsByName(productName);
    await productDetailsPage.waitForPageLoad();

    // Act
    const isAddToCartVisible = await productDetailsPage.isAddToCartButtonVisible();
    const isRemoveVisible = await productDetailsPage.isRemoveButtonVisible();

    // Assert
    expect(isAddToCartVisible).toBe(false);
    expect(isRemoveVisible).toBe(true);
  });
});

