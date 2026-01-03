/**
 * BuySmart Enterprise - Main JavaScript
 * Version: 1.0
 * Handles navigation, mobile menu, and general functionality
 */

// ============================================
// Global Variables and Configuration
// ============================================
const AppConfig = {
    // API endpoints (for future backend integration)
    api: {
        baseUrl: '/api',
        products: '/products',
        categories: '/categories',
        cart: '/cart'
    },
    
    // Animation durations
    animations: {
        fast: 150,
        normal: 300,
        slow: 500
    },
    
    // Local Storage keys
    storage: {
        cart: 'buysmart_cart',
        user: 'buysmart_user'
    }
};

// Sample data for demo purposes (will be replaced with API calls)
const SampleData = {
    categories: [
        { id: 1, name: 'Household Appliances', count: 45, icon: '🏠' },
        { id: 2, name: 'Kitchen Appliances', count: 32, icon: '🍳' },
        { id: 3, name: 'Luxury Products', count: 28, icon: '💎' },
        { id: 4, name: 'Men Products', count: 67, icon: '👨' },
        { id: 5, name: 'Women Products', count: 89, icon: '👩' },
        { id: 6, name: 'Supplements', count: 34, icon: '💊' },
        { id: 7, name: 'Gadgets', count: 56, icon: '📱' },
        { id: 8, name: 'General Goods', count: 123, icon: '📦' }
    ],
    
    featuredProducts: [
        {
            id: 1,
            name: 'Premium Air Fryer XL',
            category: 'Kitchen Appliances',
            price: 1850.00,
            originalPrice: 2469.00,
            image: 'assets/images/products/air-fryer.jpg',
            badge: 'Best Seller'
        },
        {
            id: 2,
            name: 'Wireless Charging Station',
            category: 'Gadgets',
            price: 554.00,
            originalPrice: 799.00,
            image: 'assets/images/products/charging-station.jpg',
            badge: 'New'
        },
        {
            id: 3,
            name: 'Luxury Silk Scarf',
            category: 'Luxury Products',
            price: 1230.00,
            originalPrice: 1538.00,
            image: 'assets/images/products/silk-scarf.jpg',
            badge: 'Limited'
        },
        {
            id: 4,
            name: 'Smart Fitness Tracker',
            category: 'Gadgets',
            price: 984.00,
            originalPrice: 1230.00,
            image: 'assets/images/products/fitness-tracker.jpg',
            badge: 'Popular'
        },
        {
            id: 5,
            name: 'Premium Coffee Maker',
            category: 'Kitchen Appliances',
            price: 2154.00,
            originalPrice: 2770.00,
            image: 'assets/images/products/coffee-maker.jpg',
            badge: 'Premium'
        },
        {
            id: 6,
            name: 'Organic Vitamin Set',
            category: 'Supplements',
            price: 492.00,
            originalPrice: 615.00,
            image: 'assets/images/products/vitamin-set.jpg',
            badge: 'Health'
        },
        {
            id: 7,
            name: 'Designer Handbag',
            category: 'Women Products',
            price: 3694.00,
            originalPrice: 4923.00,
            image: 'assets/images/products/designer-handbag.jpg',
            badge: 'Designer'
        },
        {
            id: 8,
            name: 'Premium Leather Watch',
            category: 'Men Products',
            price: 4923.00,
            originalPrice: 6154.00,
            image: 'assets/images/products/leather-watch.jpg',
            badge: 'Luxury'
        }
    ],
    
    whyBuySmart: [
        {
            icon: '🚚',
            title: 'Free Fast Delivery',
            description: 'Free shipping on orders over $50. Express delivery available.'
        },
        {
            icon: '💳',
            title: 'Secure Payment',
            description: 'Your payment information is always protected and secure.'
        },
        {
            icon: '↩️',
            title: 'Easy Returns',
            description: '30-day hassle-free returns and money-back guarantee.'
        },
        {
            icon: '🎧',
            title: '24/7 Support',
            description: 'Our customer service team is here to help you anytime.'
        }
    ],
    
    trustStats: [
        { number: '50,000+', label: 'Happy Customers' },
        { number: '10,000+', label: 'Products' },
        { number: '99%', label: 'Satisfaction Rate' },
        { number: '24/7', label: 'Customer Support' }
    ]
};

// ============================================
// Utility Functions
// ============================================
const Utils = {
    // Format currency (Ghana Cedis)
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-GH', {
            style: 'currency',
            currency: 'GHS',
            minimumFractionDigits: 2
        }).format(amount);
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
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
    },
    
    // Scroll to element smoothly
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// ============================================
// Navigation Module
// ============================================
const Navigation = {
    init() {
        this.setupMobileMenu();
        this.setActiveNavItem();
        this.handleNavScroll();
    },
    
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navList = document.querySelector('.nav-list');
        
        if (mobileMenuBtn && navList) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                navList.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            // Close menu when clicking on nav links
            navList.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    mobileMenuBtn.classList.remove('active');
                    navList.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !navList.contains(e.target)) {
                    mobileMenuBtn.classList.remove('active');
                    navList.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    },
    
    setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    },
    
    handleNavScroll() {
        const header = document.querySelector('.header');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll (optional)
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        }, 100));
    }
};

// ============================================
// Cart Module
// ============================================
const Cart = {
    init() {
        this.updateCartCount();
        this.bindEvents();
    },
    
    getCart() {
        const cart = localStorage.getItem(AppConfig.storage.cart);
        return cart ? JSON.parse(cart) : [];
    },
    
    saveCart(cart) {
        localStorage.setItem(AppConfig.storage.cart, JSON.stringify(cart));
        this.updateCartCount();
    },
    
    addItem(product, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                category: product.category,
                quantity: quantity
            });
        }
        
        this.saveCart(cart);
        Utils.showToast(`${product.name} added to cart!`);
    },
    
    removeItem(productId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        this.saveCart(updatedCart);
    },
    
    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }
        
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity = quantity;
            this.saveCart(cart);
        }
    },
    
    getTotalItems() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },
    
    getTotalPrice() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = this.getTotalItems();
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    },
    
    bindEvents() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                e.preventDefault();
                const productId = parseInt(e.target.dataset.productId);
                const product = SampleData.featuredProducts.find(p => p.id === productId);
                
                if (product) {
                    this.addItem(product, 1);
                }
            }
        });
    }
};

// ============================================
// Dynamic Content Module
// ============================================
const DynamicContent = {
    init() {
        this.renderFeaturedCategories();
        this.renderFeaturedProducts();
        this.renderWhyBuySmart();
        this.renderTrustStats();
    },
    
    renderFeaturedCategories() {
        const container = document.getElementById('featured-categories');
        if (!container) return;
        
        const categories = SampleData.categories.slice(0, 8);
        
        container.innerHTML = categories.map(category => `
            <div class="category-card" onclick="window.location.href='pages/category-${category.name.toLowerCase().replace(/\s+/g, '-')}.html'">
                <div class="category-icon">${category.icon}</div>
                <h3 class="category-name">${category.name}</h3>
                <p class="category-count">${category.count} products</p>
            </div>
        `).join('');
    },
    
    renderFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (!container) return;
        
        container.innerHTML = SampleData.featuredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-badge">${product.badge}</div>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        ${Utils.formatCurrency(product.price)}
                        ${product.originalPrice ? `<span class="original-price">${Utils.formatCurrency(product.originalPrice)}</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                        <a href="pages/product-details.html?id=${product.id}" class="btn btn-outline">
                            View More
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    renderWhyBuySmart() {
        const container = document.getElementById('why-buysmart');
        if (!container) return;
        
        container.innerHTML = SampleData.whyBuySmart.map(feature => `
            <div class="feature-card">
                <div class="feature-icon">${feature.icon}</div>
                <h3 class="feature-title">${feature.title}</h3>
                <p class="feature-description">${feature.description}</p>
            </div>
        `).join('');
    },
    
    renderTrustStats() {
        const container = document.getElementById('trust-stats');
        if (!container) return;
        
        container.innerHTML = SampleData.trustStats.map(stat => `
            <div class="trust-item">
                <div class="trust-number">${stat.number}</div>
                <div class="trust-label">${stat.label}</div>
            </div>
        `).join('');
    }
};

// ============================================
// Search Module (for future implementation)
// ============================================
const Search = {
    init() {
        this.setupSearch();
    },
    
    setupSearch() {
        // Placeholder for search functionality
        // This will be implemented when backend integration is ready
        console.log('Search module initialized');
    }
};

// ============================================
// Form Validation Module
// ============================================
const FormValidation = {
    init() {
        this.setupValidation();
    },
    
    setupValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    },
    
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Check if required field is empty
        if (required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value && !Utils.validateEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        // Phone validation
        if (type === 'tel' && value && !/^\+?[\d\s-()]+$/.test(value)) {
            this.showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
        
        return true;
    },
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    },
    
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
};

// ============================================
// Animation Module
// ============================================
const Animations = {
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    },
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    },
    
    setupHoverEffects() {
        // Add hover effects to cards and buttons
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('product-card') || 
                e.target.classList.contains('category-card')) {
                e.target.style.transform = 'translateY(-5px)';
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('product-card') || 
                e.target.classList.contains('category-card')) {
                e.target.style.transform = 'translateY(0)';
            }
        });
    }
};

// ============================================
// Performance Module
// ============================================
const Performance = {
    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
    },
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    },
    
    preloadCriticalResources() {
        // Preload critical images and resources
        const criticalImages = [
            'assets/images/products/air-fryer.jpg',
            'assets/images/products/charging-station.jpg',
            'assets/images/hero-bg.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
};

// ============================================
// Accessibility Module
// ============================================
const Accessibility = {
    init() {
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
        this.setupFocusManagement();
    },
    
    setupKeyboardNavigation() {
        // Enable keyboard navigation for custom elements
        document.addEventListener('keydown', (e) => {
            // ESC key closes mobile menu
            if (e.key === 'Escape') {
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                const navList = document.querySelector('.nav-list');
                
                if (mobileMenuBtn && navList && navList.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    navList.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    },
    
    setupAriaLabels() {
        // Add ARIA labels to interactive elements
        const cartButtons = document.querySelectorAll('.cart-btn');
        cartButtons.forEach(btn => {
            btn.setAttribute('aria-label', 'Shopping cart');
        });
        
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(btn => {
            btn.setAttribute('aria-label', 'Add product to cart');
        });
    },
    
    setupFocusManagement() {
        // Manage focus for better accessibility
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        // Trap focus in mobile menu when open
        document.addEventListener('keydown', (e) => {
            const navList = document.querySelector('.nav-list');
            if (navList && navList.classList.contains('active') && e.key === 'Tab') {
                const focusable = Array.from(navList.querySelectorAll(focusableElements));
                const firstFocusable = focusable[0];
                const lastFocusable = focusable[focusable.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
};

// ============================================
// App Initialization
// ============================================
const BuySmart = {
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeModules();
            });
        } else {
            this.initializeModules();
        }
    },
    
    initializeModules() {
        try {
            // Initialize all modules
            Navigation.init();
            Cart.init();
            DynamicContent.init();
            Search.init();
            FormValidation.init();
            Animations.init();
            Performance.init();
            Accessibility.init();
            
            console.log('BuySmart app initialized successfully');
        } catch (error) {
            console.error('Error initializing BuySmart app:', error);
        }
    }
};

// ============================================
// Start the Application
// ============================================
BuySmart.init();

// ============================================
// Global Error Handler
// ============================================
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, send error to logging service
});

// ============================================
// Unhandled Promise Rejection Handler
// ============================================
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, send error to logging service
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BuySmart, Utils, Navigation, Cart, DynamicContent };
}
