/**
 * Frontend Integration - Connects static pages to backend API
 * Handles dynamic product loading and UI updates
 */

// Wait for API client to be available
document.addEventListener('DOMContentLoaded', async () => {
  // Wait a moment for the API client to initialize
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (typeof window.buysmartAPI !== 'undefined') {
    initializeFrontendIntegration();
  } else {
    console.error('BuySmart API client not loaded');
  }
});

async function initializeFrontendIntegration() {
  const api = window.buysmartAPI;

  try {
    // Load featured products on homepage
    if (document.getElementById('featured-products-container')) {
      await loadFeaturedProducts(api);
    }

    // Load popular products on homepage
    if (document.getElementById('popular-products-container')) {
      await loadPopularProducts(api);
    }


    // Setup search functionality
    setupSearch(api);

    console.log('Frontend integration initialized successfully');
  } catch (error) {
    console.error('Frontend integration error:', error);
  }
}

async function loadFeaturedProducts(api) {
  const container = document.getElementById('featured-products-container');
  if (!container) return;
  
  try {
    // Show loading state
    container.innerHTML = '<div class="loading-spinner">Loading featured products...</div>';
    
    // Fetch featured products
    const featuredProducts = await api.getFeaturedProducts();
    
    if (featuredProducts.length === 0) {
      container.innerHTML = '<p class="no-products">No featured products available.</p>';
      return;
    }
    
    // Render products
    api.renderProducts('#featured-products-container', featuredProducts);
    
  } catch (error) {
    console.error('Error loading featured products:', error);
    container.innerHTML = '<p class="error-message">Failed to load featured products. Please try again later.</p>';
  }
}

async function loadPopularProducts(api) {
  const container = document.getElementById('popular-products-container');
  if (!container) return;

  try {
    // Show loading state
    container.innerHTML = '<div class="loading-spinner">Loading popular products...</div>';

    // Fetch popular products
    const popularProducts = await api.getPopularProducts();

    if (popularProducts.length === 0) {
      container.innerHTML = '<p class="no-products">No popular products available.</p>';
      return;
    }

    // Render products
    api.renderProducts('#popular-products-container', popularProducts);

  } catch (error) {
    console.error('Error loading popular products:', error);
    container.innerHTML = '<p class="error-message">Failed to load popular products. Please try again later.</p>';
  }
}


function setupSearch(api) {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  
  if (!searchInput || !searchButton) return;
  
  async function performSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm.length < 2) {
      alert('Please enter at least 2 characters to search');
      return;
    }
    
    try {
      const results = await api.searchProducts(searchTerm);
      
      if (results.length === 0) {
        alert('No products found matching your search');
        return;
      }
      
      // Store results and redirect to search results page
      localStorage.setItem('searchResults', JSON.stringify(results));
      window.location.href = 'categories.html?search=' + encodeURIComponent(searchTerm);
      
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    }
  }
  
  // Search on button click
  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    performSearch();
  });
  
  // Search on Enter key
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });
}

// Add CSS for loading spinner if not already present
function addLoadingSpinnerCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      font-style: italic;
      color: #666;
    }
    
    .loading-spinner::after {
      content: '...';
      animation: dots 1.5s steps(4, end) infinite;
    }
    
    @keyframes dots {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }
    
    .no-products {
      text-align: center;
      padding: 20px;
      color: #666;
      font-style: italic;
    }
    
    .error-message {
      text-align: center;
      padding: 20px;
      color: #e74c3c;
      background-color: #fadbd8;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
}

// Initialize when script loads
addLoadingSpinnerCSS();