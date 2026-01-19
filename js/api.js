/**
 * BuySmart API Client - Frontend Integration
 * Connects static frontend to backend API endpoints
 */

class BuySmartAPI {
  constructor() {
    this.baseUrl = 'http://localhost:5000/api';
    this.init();
  }

  /**
   * Initialize API client
   */
  init() {
    // Check if we're running in production
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      this.baseUrl = 'https://buysmart-production.up.railway.app/api';
    }
  }

  /**
   * Fetch all products from backend
   * @returns {Promise<Array>} Array of product objects
   */
  async getAllProducts() {
    try {
      const response = await fetch(`${this.baseUrl}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return []; // Return empty array on error for graceful degradation
    }
  }

  /**
   * Get a single product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getProductById(productId) {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  /**
   * Get featured products
   * @returns {Promise<Array>} Array of featured product objects
   */
  async getFeaturedProducts() {
    try {
      const products = await this.getAllProducts();
      return products.filter(product => product.isFeatured);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  /**
   * Get products on sale
   * @returns {Promise<Array>} Array of products on sale
   */
  async getSaleProducts() {
    try {
      const products = await this.getAllProducts();
      return products.filter(product => product.isOnSale);
    } catch (error) {
      console.error('Error fetching sale products:', error);
      return [];
    }
  }

  /**
   * Get new products
   * @returns {Promise<Array>} Array of new product objects
   */
  async getNewProducts() {
    try {
      const products = await this.getAllProducts();
      return products.filter(product => product.isNew);
    } catch (error) {
      console.error('Error fetching new products:', error);
      return [];
    }
  }

  /**
   * Get popular products
   * @returns {Promise<Array>} Array of popular product objects
   */
  async getPopularProducts() {
    try {
      const products = await this.getAllProducts();
      return products.filter(product => product.isPopular);
    } catch (error) {
      console.error('Error fetching popular products:', error);
      return [];
    }
  }

  /**
   * Get products by category
   * @param {string} category - Product category
   * @returns {Promise<Array>} Array of products in category
   */
  async getProductsByCategory(category) {
    try {
      const products = await this.getAllProducts();
      return products.filter(product => product.category && product.category.includes(category));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  /**
   * Format product price with discount
   * @param {Object} product - Product object
   * @returns {string} Formatted price string
   */
  formatProductPrice(product) {
   if (product.discountPrice && product.discountPrice > 0) {
     return `
       <span class="original-price">GHS ${product.price.toFixed(2)}</span>
       <span class="discount-price">GHS ${product.discountPrice.toFixed(2)}</span>
     `;
   }
   return `GHS ${product.price.toFixed(2)}`;
 }

  /**
   * Generate product badge HTML
   * @param {Object} product - Product object
   * @returns {string} HTML for product badges
   */
  generateProductBadges(product) {
    const badges = [];
    
    if (product.isFeatured) {
      badges.push('<span class="badge featured">FEATURED</span>');
    }
    
    if (product.isNew) {
      badges.push('<span class="badge new">NEW</span>');
    }
    
    if (product.isOnSale) {
      badges.push('<span class="badge sale">SALE</span>');
    }
    
    if (!product.inStock) {
      badges.push('<span class="badge out-of-stock">OUT OF STOCK</span>');
    }
    
    return badges.join(' ');
  }

  /**
   * Generate product card HTML
   * @param {Object} product - Product object
   * @returns {string} HTML for product card
   */
  generateProductCard(product) {
    const priceHtml = this.formatProductPrice(product);
    const badgesHtml = this.generateProductBadges(product);
    const stockClass = product.inStock ? '' : 'out-of-stock';
    const addToCartDisabled = product.inStock ? '' : 'disabled';

    return `
      <div class="product-card ${stockClass}">
        <div class="product-image">
          <img src="${product.coverImage}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
          <div class="product-badges">${badgesHtml}</div>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price">${priceHtml}</div>
          <div class="product-buttons">
            <button class="button add-to-cart-btn" data-product-id="${product._id}" ${addToCartDisabled}>
              ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <a href="product-details.html?id=${product._id}" class="button view-details-btn">View More</a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render products to a container
   * @param {string} containerSelector - CSS selector for container
   * @param {Array} products - Array of product objects
   */
  renderProducts(containerSelector, products) {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error(`Container not found: ${containerSelector}`);
      return;
    }
    
    if (products.length === 0) {
      container.innerHTML = '<p class="no-products">No products found.</p>';
      return;
    }
    
    const productCards = products.map(product => this.generateProductCard(product));
    container.innerHTML = productCards.join('');
    
    // Add event listeners to Add to Cart buttons
    this.setupAddToCartListeners();
  }

  /**
   * Setup Add to Cart button event listeners
   */
  setupAddToCartListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = button.getAttribute('data-product-id');
        
        // Get product details from the API
        this.getProductById(productId).then(product => {
          if (product) {
            // Call the addToCart function from cart.js
            if (typeof addToCart === 'function') {
              addToCart(productId, product.name, product.price, product.coverImage);
            } else {
              console.error('addToCart function not found');
            }
          }
        });
      });
    });
  }

  /**
   * Setup Add to Cart button event listeners
   */
  setupAddToCartListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = button.getAttribute('data-product-id');
        this.addToCart(productId);
      });
    });
  }

  /**
   * Add product to cart (local storage implementation)
   * @param {string} productId - Product ID to add to cart
   */
  addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('buysmart_cart') || '[]');
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }
    
    localStorage.setItem('buysmart_cart', JSON.stringify(cart));
    
    // Show feedback to user
    alert('Product added to cart!');
    
    // Update cart counter
    this.updateCartCounter();
  }

  /**
   * Update cart counter in UI
   */
  updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('buysmart_cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
      cartCounter.textContent = totalItems;
      cartCounter.style.display = totalItems > 0 ? 'inline' : 'none';
    }
  }

  /**
   * Initialize cart from local storage
   */
  initCart() {
    this.updateCartCounter();
  }

  /**
   * Search products by name
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Filtered products
   */
  async searchProducts(searchTerm) {
    try {
      const products = await this.getAllProducts();
      return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}

// Initialize API client when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.buysmartAPI = new BuySmartAPI();
  window.buysmartAPI.initCart();
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BuySmartAPI;
}