/**
 * BuySmart Enterprise - Cart JavaScript
 * Version: 1.0
 * Handles cart page functionality, item management, and checkout process
 */

// ============================================
// Cart Page Module
// ============================================
const CartPage = {
    init() {
        this.renderCartItems();
        this.bindEvents();
        this.updateSummary();
    },

    // Get cart from localStorage (shared with main.js Cart module)
    getCart() {
        const cart = localStorage.getItem('buysmart_cart');
        return cart ? JSON.parse(cart) : [];
    },

    // Save cart to localStorage
    saveCart(cart) {
        localStorage.setItem('buysmart_cart', JSON.stringify(cart));
        this.updateCartCount(); // Update header cart count
    },

    // Update cart count in header
    updateCartCount() {
        const cart = this.getCart();
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    },

    // Render cart items
    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cart = this.getCart();

        if (cart.length === 0) {
            this.renderEmptyCart();
            return;
        }

        // Hide empty cart message and show cart items
        const emptyCart = document.querySelector('.empty-cart');
        if (emptyCart) {
            emptyCart.style.display = 'none';
        }

        // Show cart items container
        const cartItemsSection = document.querySelector('.cart-items');
        if (cartItemsSection) {
            cartItemsSection.style.display = 'block';
        }

        // Update cart header
        this.updateCartHeader(cart);

        // Render cart items
        cartItemsContainer.innerHTML = cart.map(item => this.createCartItemHTML(item)).join('');

        // Show cart summary
        const cartSummary = document.querySelector('.cart-summary');
        if (cartSummary) {
            cartSummary.style.display = 'block';
        }
    },

    // Render empty cart
    renderEmptyCart() {
        const emptyCart = document.querySelector('.empty-cart');
        const cartItemsSection = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');

        if (emptyCart) {
            emptyCart.style.display = 'block';
        }

        if (cartItemsSection) {
            cartItemsSection.style.display = 'none';
        }

        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
    },

    // Update cart header
    updateCartHeader(cart) {
        const cartHeader = document.querySelector('.cart-header');
        if (cartHeader) {
            const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
            const totalItems = document.querySelector('.cart-total-items');
            if (totalItems) {
                totalItems.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
            }
        }
    },

    // Create HTML for a cart item
    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-product">
                    <div class="cart-product-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="cart-product-info">
                        <h3 class="product-name">${item.name}</h3>
                        <p class="product-category">${item.category}</p>
                    </div>
                </div>
                <div class="cart-price">
                    ${this.formatCurrency(item.price)}
                    ${item.originalPrice ? `<div class="original-price">${this.formatCurrency(item.originalPrice)}</div>` : ''}
                </div>
                <div class="cart-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-action="decrease" data-product-id="${item.id}">−</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-product-id="${item.id}">
                        <button class="quantity-btn" data-action="increase" data-product-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="cart-total">
                    ${this.formatCurrency(item.price * item.quantity)}
                </div>
                <button class="remove-btn" data-product-id="${item.id}" aria-label="Remove ${item.name}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3 9.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-1z"/>
                        <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-1z"/>
                        <path fill-rule="evenodd" d="M6.5 2a.5.5 0 0 0-.5.5v1.5H4.5a.5.5 0 0 0 0 1H5.5v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H6.5V3a.5.5 0 0 0-.5-.5z"/>
                    </svg>
                </button>
            </div>
        `;
    },

    // Bind event listeners
    bindEvents() {
        // Quantity change events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                this.handleQuantityChange(e);
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                this.handleQuantityInput(e);
            }
        });

        // Remove item events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
                this.handleRemoveItem(e);
            }
        });

        // Clear cart
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('clear-cart-btn')) {
                this.clearCart();
            }
        });

        // Continue shopping
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('continue-shopping-btn')) {
                window.location.href = 'index.html';
            }
        });

        // Checkout button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('checkout-btn')) {
                this.proceedToCheckout();
            }
        });
    },

    // Handle quantity change via buttons
    handleQuantityChange(e) {
        const productId = parseInt(e.target.dataset.productId);
        const action = e.target.dataset.action;
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (action === 'increase') {
                item.quantity = Math.min(item.quantity + 1, 99);
            } else if (action === 'decrease') {
                item.quantity = Math.max(item.quantity - 1, 1);
            }

            this.saveCart(cart);
            this.updateCartItemDisplay(productId, item);
            this.updateSummary();
        }
    },

    // Handle quantity change via direct input
    handleQuantityInput(e) {
        const productId = parseInt(e.target.dataset.productId);
        let quantity = parseInt(e.target.value);

        // Validate quantity
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        } else if (quantity > 99) {
            quantity = 99;
        }

        // Update input value
        e.target.value = quantity;

        // Update cart
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            item.quantity = quantity;
            this.saveCart(cart);
            this.updateCartItemDisplay(productId, item);
            this.updateSummary();
        }
    },

    // Update individual cart item display
    updateCartItemDisplay(productId, item) {
        const cartItem = document.querySelector(`[data-product-id="${productId}"]`);
        if (cartItem) {
            // Update quantity input
            const quantityInput = cartItem.querySelector('.quantity-input');
            if (quantityInput) {
                quantityInput.value = item.quantity;
            }

            // Update total price
            const totalElement = cartItem.querySelector('.cart-total');
            if (totalElement) {
                totalElement.textContent = this.formatCurrency(item.price * item.quantity);
            }
        }
    },

    // Handle remove item
    handleRemoveItem(e) {
        const productId = parseInt(e.target.dataset.productId || e.target.closest('[data-product-id]').dataset.productId);
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item && confirm(`Remove "${item.name}" from cart?`)) {
            const updatedCart = cart.filter(item => item.id !== productId);
            this.saveCart(updatedCart);
            
            // Remove item from DOM with animation
            const cartItem = document.querySelector(`[data-product-id="${productId}"]`);
            if (cartItem) {
                cartItem.style.transform = 'translateX(-100%)';
                cartItem.style.opacity = '0';
                setTimeout(() => {
                    this.renderCartItems();
                    this.updateSummary();
                }, 300);
            }
        }
    },

    // Clear entire cart
    clearCart() {
        if (confirm('Are you sure you want to clear your entire cart?')) {
            this.saveCart([]);
            this.renderCartItems();
            this.updateSummary();
            this.showToast('Cart cleared successfully');
        }
    },

    // Proceed to checkout
    proceedToCheckout() {
        const cart = this.getCart();
        if (cart.length === 0) {
            this.showToast('Your cart is empty', 'error');
            return;
        }
        window.location.href = 'checkout.html';
    },

    // Update cart summary
    updateSummary() {
        const cart = this.getCart();
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const shipping = subtotal >= 50 ? 0 : 9.99;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        // Update summary elements
        const subtotalElement = document.getElementById('cart-subtotal');
        if (subtotalElement) {
            subtotalElement.textContent = this.formatCurrency(subtotal);
        }

        const shippingElement = document.getElementById('cart-shipping');
        if (shippingElement) {
            shippingElement.textContent = shipping === 0 ? 'Free' : this.formatCurrency(shipping);
        }

        const taxElement = document.getElementById('cart-tax');
        if (taxElement) {
            taxElement.textContent = this.formatCurrency(tax);
        }

        const totalElement = document.getElementById('cart-total');
        if (totalElement) {
            totalElement.textContent = this.formatCurrency(total);
        }

        const itemCountElement = document.getElementById('cart-item-count');
        if (itemCountElement) {
            itemCountElement.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
        }

        // Update checkout button state
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = cart.length === 0;
            checkoutBtn.textContent = cart.length === 0 ? 'Cart is Empty' : `Checkout - ${this.formatCurrency(total)}`;
        }
    },

    // Format currency (Ghana Cedis)
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-GH', {
            style: 'currency',
            currency: 'GHS',
            minimumFractionDigits: 2
        }).format(amount);
    },

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// ============================================
// Wishlist Module (for future implementation)
// ============================================
const Wishlist = {
    getWishlist() {
        const wishlist = localStorage.getItem('buysmart_wishlist');
        return wishlist ? JSON.parse(wishlist) : [];
    },

    addToWishlist(product) {
        const wishlist = this.getWishlist();
        if (!wishlist.find(item => item.id === product.id)) {
            wishlist.push(product);
            localStorage.setItem('buysmart_wishlist', JSON.stringify(wishlist));
            CartPage.showToast(`${product.name} added to wishlist`);
        }
    },

    removeFromWishlist(productId) {
        const wishlist = this.getWishlist();
        const updatedWishlist = wishlist.filter(item => item.id !== productId);
        localStorage.setItem('buysmart_wishlist', JSON.stringify(updatedWishlist));
    },

    isInWishlist(productId) {
        const wishlist = this.getWishlist();
        return wishlist.some(item => item.id === productId);
    }
};

// ============================================
// Recently Viewed Module (for future implementation)
// ============================================
const RecentlyViewed = {
    getRecentlyViewed() {
        const recentlyViewed = localStorage.getItem('buysmart_recently_viewed');
        return recentlyViewed ? JSON.parse(recentlyViewed) : [];
    },

    addToRecentlyViewed(product) {
        let recentlyViewed = this.getRecentlyViewed();
        
        // Remove if already exists
        recentlyViewed = recentlyViewed.filter(item => item.id !== product.id);
        
        // Add to beginning
        recentlyViewed.unshift(product);
        
        // Keep only last 10 items
        recentlyViewed = recentlyViewed.slice(0, 10);
        
        localStorage.setItem('buysmart_recently_viewed', JSON.stringify(recentlyViewed));
    }
};

// ============================================
// Cart Analytics Module
// ============================================
const CartAnalytics = {
    trackAddToCart(product, quantity = 1) {
        const event = {
            event: 'add_to_cart',
            product_id: product.id,
            product_name: product.name,
            category: product.category,
            price: product.price,
            quantity: quantity,
            timestamp: new Date().toISOString()
        };
        
        // In production, send to analytics service
        console.log('Add to cart event:', event);
        
        // Store locally for reporting
        const events = JSON.parse(localStorage.getItem('buysmart_analytics_events') || '[]');
        events.push(event);
        localStorage.setItem('buysmart_analytics_events', JSON.stringify(events));
    },

    trackRemoveFromCart(productId, productName) {
        const event = {
            event: 'remove_from_cart',
            product_id: productId,
            product_name: productName,
            timestamp: new Date().toISOString()
        };
        
        console.log('Remove from cart event:', event);
        
        const events = JSON.parse(localStorage.getItem('buysmart_analytics_events') || '[]');
        events.push(event);
        localStorage.setItem('buysmart_analytics_events', JSON.stringify(events));
    },

    trackCheckout(cart) {
        const event = {
            event: 'checkout',
            cart_value: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
            item_count: cart.reduce((total, item) => total + item.quantity, 0),
            timestamp: new Date().toISOString()
        };
        
        console.log('Checkout event:', event);
        
        const events = JSON.parse(localStorage.getItem('buysmart_analytics_events') || '[]');
        events.push(event);
        localStorage.setItem('buysmart_analytics_events', JSON.stringify(events));
    }
};

// ============================================
// Cart Persistence Module
// ============================================
const CartPersistence = {
    init() {
        this.setupPersistence();
        this.handleStorageEvents();
    },

    setupPersistence() {
        // Save cart state before page unload
        window.addEventListener('beforeunload', () => {
            this.saveCartState();
        });

        // Restore cart state on page load
        window.addEventListener('load', () => {
            this.restoreCartState();
        });
    },

    saveCartState() {
        const cart = CartPage.getCart();
        const cartState = {
            cart: cart,
            timestamp: Date.now(),
            page: window.location.pathname
        };
        
        localStorage.setItem('buysmart_cart_state', JSON.stringify(cartState));
    },

    restoreCartState() {
        const savedState = localStorage.getItem('buysmart_cart_state');
        if (savedState) {
            try {
                const cartState = JSON.parse(savedState);
                
                // Only restore if less than 24 hours old
                if (Date.now() - cartState.timestamp < 24 * 60 * 60 * 1000) {
                    localStorage.setItem('buysmart_cart', JSON.stringify(cartState.cart));
                    CartPage.updateCartCount();
                }
            } catch (error) {
                console.error('Error restoring cart state:', error);
            }
        }
    },

    handleStorageEvents() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'buysmart_cart') {
                // Cart was modified in another tab
                CartPage.renderCartItems();
                CartPage.updateSummary();
                CartPage.updateCartCount();
            }
        });
    }
};

// ============================================
// Cart Recommendations Module (for future implementation)
// ============================================
const CartRecommendations = {
    getRecommendations(currentCart) {
        // Simple recommendation logic based on current cart items
        const recommendations = [];
        
        currentCart.forEach(item => {
            // Get similar products from same category
            const similarProducts = SampleData.featuredProducts.filter(product => 
                product.category === item.category && product.id !== item.id
            );
            
            recommendations.push(...similarProducts.slice(0, 2));
        });
        
        // Remove duplicates and limit to 4 recommendations
        const uniqueRecommendations = recommendations.filter((product, index, self) => 
            index === self.findIndex(p => p.id === product.id)
        ).slice(0, 4);
        
        return uniqueRecommendations;
    },

    renderRecommendations() {
        const cart = CartPage.getCart();
        if (cart.length === 0) return;
        
        const recommendations = this.getRecommendations(cart);
        const container = document.getElementById('cart-recommendations');
        
        if (container && recommendations.length > 0) {
            container.innerHTML = `
                <div class="recommendations-header">
                    <h3>You might also like</h3>
                </div>
                <div class="recommendations-grid">
                    ${recommendations.map(product => `
                        <div class="recommendation-card">
                            <img src="${product.image}" alt="${product.name}">
                            <h4>${product.name}</h4>
                            <p class="price">${this.formatCurrency(product.price)}</p>
                            <button class="btn btn-outline btn-small add-to-cart-recommendation" data-product-id="${product.id}">
                                Add to Cart
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
};

// ============================================
// Initialize Cart Page
// ============================================
const initCartPage = () => {
    // Only initialize if we're on the cart page
    if (document.getElementById('cart-items')) {
        CartPage.init();
        CartPersistence.init();
        CartRecommendations.renderRecommendations();
        
        // Add analytics tracking for cart page views
        const event = {
            event: 'view_cart',
            cart_items: CartPage.getCart().length,
            timestamp: new Date().toISOString()
        };
        console.log('Cart page view event:', event);
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartPage);
} else {
    initCartPage();
}

// Export modules for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        CartPage, 
        Wishlist, 
        RecentlyViewed, 
        CartAnalytics, 
        CartPersistence,
        CartRecommendations 
    };
}
