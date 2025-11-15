const { test, expect, selectors } = require('@playwright/test');
const LoginPage = require('../../pages/Login.page');
const InventoryPage = require('../../pages/Inventory.page');
const CartPage = require('../../pages/Cart.page');
const Header = require('../../pages/Header.page');
const cartSelectors = require('../../selectors/CartSelectors');
const inventorySelectors = require('../../selectors/InventorySelectors');
const checkoutSelectors = require('../../selectors/CheckoutSelectors');
const users = require('../../fixtures/users.json');
const products = require('../../fixtures/products.json');

test.describe('Cart Page Tests', () => {
  let loginPage;
  let inventoryPage;
  let cartPage;
  let header;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    header = new Header(page);
    await page.goto('/');
    await loginPage.login(users.users[0], users.password);
    await inventoryPage.waitForPageLoad();
  });

  test('TC-CART-001: Visualizar produtos no carrinho', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await inventoryPage.addProductToCartByName(products[1].name, products);
    await header.clickShoppingCart();

    // Act
    await cartPage.waitForPageLoad();
    const cartItems = await cartPage.getAllCartItems();
    const pageTitle = await cartPage.getPageTitle();

    // Assert
    await expect(page.locator(cartSelectors.cartContainer)).toBeVisible();
    expect(pageTitle).toBe('Your Cart');
    expect(cartItems.length).toBe(2);
    for (const item of cartItems) {
      const name = await item.$eval(inventorySelectors.itemName, el => el.textContent.trim());
      const price = await item.$eval(inventorySelectors.itemPrice, el => el.textContent.trim());
      expect(name).toBeTruthy();
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  test('TC-CART-002: Remover produto do carrinho', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    const initialCount = await cartPage.getCartItemsCount();

    // Act
    await cartPage.removeItemByName(products[0].name);
    const finalCount = await cartPage.getCartItemsCount();
    const badgeVisible = await header.isCartBadgeVisible();

    // Assert
    expect(finalCount).toBe(initialCount - 1);
    expect(badgeVisible).toBe(false);
  });

  test('TC-CART-003: Continuar comprando', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    const badgeCountBefore = await header.getCartBadgeCount();

    // Act
    await cartPage.clickContinueShopping();
    await inventoryPage.waitForPageLoad();
    const badgeCountAfter = await header.getCartBadgeCount();

    // Assert
    expect(page.url()).toContain('/inventory.html');
    await expect(page.locator(inventorySelectors.inventoryContainer)).toBeVisible();
    expect(badgeCountAfter).toBe(badgeCountBefore);
  });

  test('TC-CART-004: Ir para checkout', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();

    // Act
    await cartPage.clickCheckout();

    // Assert
    expect(page.url()).toContain('/checkout-step-one.html');
    await expect(page.locator(checkoutSelectors.pageTitle)).toContainText('Checkout: Your Information');
  });

  test('TC-CART-005: Verificar quantidade de itens no carrinho', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await inventoryPage.addProductToCartByName(products[1].name, products);
    await inventoryPage.addProductToCartByName(products[2].name, products);
    await header.clickShoppingCart();

    // Act
    await cartPage.waitForPageLoad();
    const itemsCount = await cartPage.getCartItemsCount();

    // Assert
    expect(itemsCount).toBe(3);
    const visibleItems = await cartPage.getAllCartItems();
    expect(visibleItems.length).toBe(3);
  });

  test('TC-CART-006: Verificar preço dos itens no carrinho', async ({ page }) => {
    // Arrange
    const productName = products[0].name;
    const expectedPrice = `$${products[0].price.toFixed(2)}`;
    await inventoryPage.addProductToCartByName(productName, products);
    await header.clickShoppingCart();

    // Act
    await cartPage.waitForPageLoad();
    const itemPrice = await cartPage.getItemPriceByName(productName);

    // Assert
    expect(itemPrice).toBe(expectedPrice);
    expect(itemPrice).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('TC-CART-007: Verificar quantidade de um item específico', async ({ page }) => {
    // Arrange
    const productName = products[0].name;
    await inventoryPage.addProductToCartByName(productName, products);
    await header.clickShoppingCart();

    // Act
    await cartPage.waitForPageLoad();
    const quantity = await cartPage.getItemQuantityByName(productName);

    // Assert
    expect(quantity).toBe(1);
  });

  test('TC-CART-008: Remover item pelo índice', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await inventoryPage.addProductToCartByName(products[1].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    const initialCount = await cartPage.getCartItemsCount();

    // Act
    await cartPage.removeItemByIndex(0);
    const finalCount = await cartPage.getCartItemsCount();
    const badgeCount = await header.getCartBadgeCount();

    // Assert
    expect(finalCount).toBe(initialCount - 1);
    expect(badgeCount).toBe(1);
  });
});

