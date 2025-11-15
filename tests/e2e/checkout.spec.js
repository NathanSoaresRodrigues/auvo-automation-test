const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/Login.page');
const InventoryPage = require('../../pages/Inventory.page');
const CartPage = require('../../pages/Cart.page');
const CheckoutPage = require('../../pages/Checkout.page');
const Header = require('../../pages/Header.page');
const cartSelectors = require('../../selectors/CartSelectors');
const inventorySelectors = require('../../selectors/InventorySelectors');
const checkoutSelectors = require('../../selectors/CheckoutSelectors');
const users = require('../../fixtures/users.json');
const products = require('../../fixtures/products.json');
const checkoutInfo = require('../../fixtures/checkoutInfo.json');
const errorMessages = require('../../fixtures/errorMessages.json');

test.describe('Checkout Page Tests', () => {
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

  test('TC-CHECKOUT-001: Preencher informações de checkout', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();
    const checkoutData = checkoutInfo.checkoutData[0];

    // Act
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.clickContinue();

    // Assert
    expect(page.url()).toContain('/checkout-step-two.html');
    const pageTitle = await checkoutPage.getPageTitle();
    expect(pageTitle).toBe('Checkout: Overview');
  });

  test('TC-CHECKOUT-002: Cancelar checkout', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();

    // Act
    await checkoutPage.clickCancel();

    // Assert
    expect(page.url()).toContain('/cart.html');
    await expect(page.locator(cartSelectors.cartContainer)).toBeVisible();
  });

  test('TC-CHECKOUT-003: Verificar resumo do pedido', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await inventoryPage.addProductToCartByName(products[1].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();
    const checkoutData = checkoutInfo.checkoutData[0];
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.clickContinue();

    // Act
    const checkoutItems = await checkoutPage.getAllCheckoutItems();
    const paymentInfo = await checkoutPage.getPaymentInfo();
    const shippingInfo = await checkoutPage.getShippingInfo();
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    // Assert
    expect(checkoutItems.length).toBe(2);
    expect(paymentInfo).toContain('SauceCard');
    expect(shippingInfo).toContain('Free Pony Express Delivery');
    const expectedSubtotal = products[0].price + products[1].price;
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('TC-CHECKOUT-004: Finalizar pedido', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();
    const checkoutData = checkoutInfo.checkoutData[0];
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.clickContinue();

    // Act
    await checkoutPage.clickFinish();

    // Assert
    expect(page.url()).toContain('/checkout-complete.html');
    const completeHeader = await checkoutPage.getCompleteHeader();
    const completeText = await checkoutPage.getCompleteText();
    expect(completeHeader).toBe('Thank you for your order!');
    expect(completeText).toContain('Your order has been dispatched');
  });

  test('TC-CHECKOUT-005: Verificar página de conclusão', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();
    const checkoutData = checkoutInfo.checkoutData[0];
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();

    // Act
    const completeHeader = await checkoutPage.getCompleteHeader();
    const completeText = await checkoutPage.getCompleteText();
    const backHomeVisible = await checkoutPage.isVisible(checkoutSelectors.backHomeButton);

    // Assert
    expect(completeHeader).toBe('Thank you for your order!');
    expect(completeText).toContain('Your order has been dispatched');
    await expect(page.locator(checkoutSelectors.ponyExpressImage)).toBeVisible();
    expect(backHomeVisible).toBe(true);
  });

  test('TC-CHECKOUT-006: Voltar para home após conclusão', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();
    const checkoutData = checkoutInfo.checkoutData[0];
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();

    // Act
    await checkoutPage.clickBackHome();
    await inventoryPage.waitForPageLoad();

    // Assert
    expect(page.url()).toContain('/inventory.html');
    await expect(page.locator(inventorySelectors.inventoryContainer)).toBeVisible();
    expect(await header.isCartBadgeVisible()).toBe(false);
  });

  test('TC-CHECKOUT-007: Validar campos obrigatórios - First Name vazio', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();
    const checkoutData = checkoutInfo.checkoutData[0];

    // Act
    await checkoutPage.fillCheckoutInformation('', checkoutData.lastName, checkoutData.postalCode);
    await checkoutPage.clickContinue();

    // Assert
    expect(page.url()).toContain('/checkout-step-one.html');
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toBe(errorMessages.checkout.firstNameRequired);
  });

  test('TC-CHECKOUT-008: Validar campos obrigatórios - Last Name vazio', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();
    const checkoutData = checkoutInfo.checkoutData[0];

    // Act
    await checkoutPage.fillCheckoutInformation(checkoutData.firstName, '', checkoutData.postalCode);
    await checkoutPage.clickContinue();

    // Assert
    expect(page.url()).toContain('/checkout-step-one.html');
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toBe(errorMessages.checkout.lastNameRequired);
  });

  test('TC-CHECKOUT-009: Validar campos obrigatórios - Postal Code vazio', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products[0].name, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();
    const checkoutData = checkoutInfo.checkoutData[0];

    // Act
    await checkoutPage.fillCheckoutInformation(checkoutData.firstName, checkoutData.lastName, '');
    await checkoutPage.clickContinue();

    // Assert
    expect(page.url()).toContain('/checkout-step-one.html');
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toBe(errorMessages.checkout.postalCodeRequired);
  });

  test('TC-CHECKOUT-010: Verificar preço de item no resumo', async ({ page }) => {
    // Arrange
    const productName = products[0].name;
    const expectedPrice = `$${products[0].price.toFixed(2)}`;
    await inventoryPage.addProductToCartByName(productName, products);
    await header.clickShoppingCart();
    await cartPage.waitForPageLoad();
    await cartPage.clickCheckout();
    const checkoutData = checkoutInfo.checkoutData[0];
    await checkoutPage.fillCheckoutInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    await checkoutPage.clickContinue();

    // Act
    const itemPrice = await checkoutPage.getItemPriceByName(productName);

    // Assert
    expect(itemPrice).toBe(expectedPrice);
    expect(itemPrice).toMatch(/^\$\d+\.\d{2}$/);
  });
});

