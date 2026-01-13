// Cart JavaScript File
console.log("Buysmart Enterprise Cart System");

// Cart Functions
function addToCart(productId, productName, productPrice) {
    // Retrieve the current cart from LocalStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        // If the product exists, increment the quantity
        existingProduct.quantity += 1;
    } else {
        // If the product does not exist, add it to the cart
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    // Save the updated cart to LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update the cart count in the UI
    updateCartCount();
    
    console.log(`Added ${productName} to cart`);
}

// Update the cart count in the UI
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Remove a product from the cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Filter out the product with the given ID
    cart = cart.filter(item => item.id !== productId);
    
    // Save the updated cart to LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update the cart count in the UI
    updateCartCount();
    
    console.log(`Removed product with ID ${productId} from cart`);
}

// Initialize the cart system
function initCart() {
    console.log("Initializing Buysmart Enterprise Cart System");
    
    // Update the cart count when the page loads
    updateCartCount();
}

// Run initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', initCart);
