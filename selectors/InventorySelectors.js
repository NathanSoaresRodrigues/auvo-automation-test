module.exports = {
  inventoryContainer: '[data-test="inventory-container"]',
  inventoryItem: '[data-test="inventory-item"]',
  itemName: '[data-test="inventory-item-name"]',
  itemPrice: '[data-test="inventory-item-price"]',
  itemDescription: '[data-test="inventory-item-desc"]',
  itemImage: '[data-test="inventory-item-img"]',
  sortDropdown: '[data-test="product-sort-container"]',
  addToCartButton: (productId) => `[data-test="add-to-cart-${productId}"]`,
  removeFromCartButton: (productId) => `[data-test="remove-${productId}"]`,
};
