const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/Login.page');
const InventoryPage = require('../../pages/Inventory.page');
const Header = require('../../pages/Header.page');
const ProductDetailsPage = require('../../pages/ProductDetails.page');
const inventorySelectors = require('../../selectors/InventorySelectors');
const users = require('../../fixtures/users.json');
const products = require('../../fixtures/products.json');

test.describe('Inventory Page Tests', () => {
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

  test('TC-INVENTORY-001: Visualizar lista de produtos', async ({ page }) => {
    // Arrange
    // Login já realizado no beforeEach

    // Act
    const productsList = await inventoryPage.getAllProducts();

    // Assert
    await expect(page.locator(inventorySelectors.inventoryContainer)).toBeVisible();
    expect(productsList.length).toBe(6);
    for (const product of productsList) {
      const name = await product.$eval(inventorySelectors.itemName, el => el.textContent.trim());
      const price = await product.$eval(inventorySelectors.itemPrice, el => el.textContent.trim());
      expect(name).toBeTruthy();
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  test('TC-INVENTORY-002: Adicionar produto ao carrinho', async ({ page }) => {
    // Arrange
    const productName = products[0].name;

    // Act
    await inventoryPage.addProductToCartByName(productName, products);
    const badgeCount = await header.getCartBadgeCount();

    // Assert
    await expect(page.locator(inventorySelectors.removeFromCartButton(products[0].id))).toBeVisible();
    expect(badgeCount).toBe(1);
    expect(await header.isCartBadgeVisible()).toBe(true);
  });

  test('TC-INVENTORY-003: Remover produto do carrinho', async ({ page }) => {
    // Arrange
    const productName = products[0].name;
    await inventoryPage.addProductToCartByName(productName, products);
    expect(await header.getCartBadgeCount()).toBe(1);

    // Act
    await inventoryPage.removeProductFromCartByName(productName, products);
    const badgeVisible = await header.isCartBadgeVisible();

    // Assert
    await expect(page.locator(inventorySelectors.addToCartButton(products[0].id))).toBeVisible();
    expect(badgeVisible).toBe(false);
  });

  test('TC-INVENTORY-004: Ordenar produtos por nome (A-Z)', async ({ page }) => {
    // Arrange
    // Login já realizado no beforeEach

    // Act
    await inventoryPage.sortProducts('az');
    const selectedOption = await inventoryPage.getSortOption();
    const firstProduct = await inventoryPage.getProductByIndex(0);
    const firstName = await firstProduct.$eval(inventorySelectors.itemName, el => el.textContent.trim());

    // Assert
    expect(selectedOption).toBe('az');
    expect(firstName).toBe('Sauce Labs Backpack');
  });

  test('TC-INVENTORY-005: Ordenar produtos por nome (Z-A)', async ({ page }) => {
    // Arrange
    // Login já realizado no beforeEach

    // Act
    await inventoryPage.sortProducts('za');
    const selectedOption = await inventoryPage.getSortOption();
    const firstProduct = await inventoryPage.getProductByIndex(0);
    const firstName = await firstProduct.$eval(inventorySelectors.itemName, el => el.textContent.trim());

    // Assert
    expect(selectedOption).toBe('za');
    expect(firstName).toBe('Test.allTheThings() T-Shirt (Red)');
  });

  test('TC-INVENTORY-006: Ordenar produtos por preço (menor para maior)', async ({ page }) => {
    // Arrange
    // Login já realizado no beforeEach

    // Act
    await inventoryPage.sortProducts('lohi');
    const selectedOption = await inventoryPage.getSortOption();
    const firstProduct = await inventoryPage.getProductByIndex(0);
    const firstPrice = await firstProduct.$eval(inventorySelectors.itemPrice, el => el.textContent.trim());

    // Assert
    expect(selectedOption).toBe('lohi');
    expect(firstPrice).toBe('$7.99');
  });

  test('TC-INVENTORY-007: Ordenar produtos por preço (maior para menor)', async ({ page }) => {
    // Arrange
    // Login já realizado no beforeEach

    // Act
    await inventoryPage.sortProducts('hilo');
    const selectedOption = await inventoryPage.getSortOption();
    const firstProduct = await inventoryPage.getProductByIndex(0);
    const firstPrice = await firstProduct.$eval(inventorySelectors.itemPrice, el => el.textContent.trim());

    // Assert
    expect(selectedOption).toBe('hilo');
    expect(firstPrice).toBe('$49.99');
  });

  test('TC-INVENTORY-008: Abrir detalhes de um produto', async ({ page }) => {
    // Arrange
    const productName = products[1].name;

    // Act
    await inventoryPage.openProductDetailsByName(productName);
    const productDetailsPage = new ProductDetailsPage(page);
    await productDetailsPage.waitForPageLoad();
    const detailsProductName = await productDetailsPage.getProductName();

    // Assert
    expect(page.url()).toContain('/inventory-item.html');
    expect(detailsProductName).toBe(productName);
  });

  test('TC-INVENTORY-009: Verificar badge do carrinho após adicionar múltiplos produtos', async ({ page }) => {
    // Arrange
    // Login já realizado no beforeEach

    // Act
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await inventoryPage.addProductToCartByName(products[1].name, products);
    await inventoryPage.addProductToCartByName(products[2].name, products);
    const badgeCount = await header.getCartBadgeCount();

    // Assert
    expect(badgeCount).toBe(3);
    expect(await header.isCartBadgeVisible()).toBe(true);
  });

  test('TC-INVENTORY-010: Obter preço de um produto pelo nome', async ({ page }) => {
    // Arrange
    const productName = products[0].name;
    const expectedPrice = `$${products[0].price.toFixed(2)}`;

    // Act
    const price = await inventoryPage.getProductPriceByName(productName);

    // Assert
    expect(price).toBe(expectedPrice);
    expect(price).toMatch(/^\$\d+\.\d{2}$/);
  });
});

