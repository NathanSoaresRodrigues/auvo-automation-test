// Selectors for the Inventory Page
module.exports = {
  inventoryContainer: '[data-test="inventory-container"]',
  inventoryItem: '[data-test="inventory-item"]',
  itemName: '[data-test="inventory-item-name"]',
  itemPrice: '[data-test="inventory-item-price"]',
  addToCartButton: (productId) => `[data-test="add-to-cart-${productId}"]`,
  removeFromCartButton: (productId) => `[data-test="remove-${productId}"]`,
};
