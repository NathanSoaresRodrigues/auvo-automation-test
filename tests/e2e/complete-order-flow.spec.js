const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/Login.page');
const InventoryPage = require('../../pages/Inventory.page');
const CartPage = require('../../pages/Cart.page');
const CheckoutPage = require('../../pages/Checkout.page');
const Header = require('../../pages/Header.page');
const users = require('../../fixtures/users.json');
const products = require('../../fixtures/products.json');
const checkoutInfo = require('../../fixtures/checkoutInfo.json');

test.describe('Complete Order Flow Tests', () => {
  let loginPage;
  let inventoryPage;
  let cartPage;
  let checkoutPage;
  let header;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    header = new Header(page);
    await page.goto('/');
    await loginPage.login(users.users[0], users.password);
    await inventoryPage.waitForPageLoad();
  });

test('TC-COMPLETE-ORDER-001: Completar pedido com 1 produto no carrinho', async ({ page }) => {
    // Arrange
    const productName = products[2].name;
    const checkoutData = checkoutInfo.checkoutData[0];

    // Act
    await inventoryPage.addProductToCartByName(productName, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.postalCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();

    // Assert — apenas validação de que o pedido foi realizado corretamente
    const completeUrl = page.url();
    const completeHeader = await checkoutPage.getCompleteHeader();
    const completeText = await checkoutPage.getCompleteText();
    const badgeVisibleAfterOrder = await header.isCartBadgeVisible();

    expect(completeUrl).toContain('/checkout-complete.html');
    expect(completeHeader).toBe('Thank you for your order!');
    expect(completeText).toContain('Your order has been dispatched');
    expect(badgeVisibleAfterOrder).toBe(false);
  });

test('TC-COMPLETE-ORDER-002: Completar pedido com TODOS os produtos no carrinho', async ({ page }) => {
    // Arrange
    const checkoutData = checkoutInfo.checkoutData[0];

    // Act
    for (const product of products) {
        await inventoryPage.addProductToCartByName(product.name, products);
    }
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.postalCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();

    // Assert — apenas validação de que o pedido foi realizado corretamente
    const completeUrl = page.url();
    const completeHeader = await checkoutPage.getCompleteHeader();
    const completeText = await checkoutPage.getCompleteText();
    const badgeVisibleAfterOrder = await header.isCartBadgeVisible();

    expect(completeUrl).toContain('/checkout-complete.html');
    expect(completeHeader).toBe('Thank you for your order!');
    expect(completeText).toContain('Your order has been dispatched');
    expect(badgeVisibleAfterOrder).toBe(false);
  });

  test('TC-COMPLETE-ORDER-003: Fluxo com carrinho vazio - VALIDAÇÃO DE BUG', async ({ page }) => {
    // Arrange
    const checkoutData = checkoutInfo.checkoutData[0];

    // Act
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();

    // Assert — apenas validação de que o pedido foi realizado corretamente
    const completeUrl = page.url();
    const completeHeader = await checkoutPage.getCompleteHeader();
    const completeText = await checkoutPage.getCompleteText();

    expect(completeUrl).toContain('/checkout-complete.html');
    expect(completeHeader).toBe('Thank you for your order!');
    expect(completeText).toContain('Your order has been dispatched');
    console.warn(
      '⚠️  BUG DETECTED: Order was completed successfully with an empty cart. ' +
      'Expected behavior: Checkout should be prevented or user should be warned when cart is empty.'
    );
  });
});
