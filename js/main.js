// Main JavaScript File
console.log("BuySmart Enterprise E-Commerce Website");

// Mobile Navigation Toggle
function toggleMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Search Functionality
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();
    
    // Filter products based on search term
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Initialize the website
function init() {
    console.log("Initializing BuySmart Enterprise Website");
    
    // Add event listeners
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', toggleMobileNav);
    }
    
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', searchProducts);
    }
}

// Run initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
