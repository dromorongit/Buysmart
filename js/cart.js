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
    
    // Update the cart display
    updateCartDisplay();
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
    
    // Update the cart display
    updateCartDisplay();
}

// Initialize the cart system
function initCart() {
    console.log("Initializing Buysmart Enterprise Cart System");
    
    // Update the cart count and display when the page loads
    updateCartCount();
    updateCartDisplay();
}

// Format price with GHS currency
function formatPrice(price) {
    return `GHS ${price.toFixed(2)}`;
}

// Update the cart display with items and totals
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsElement = document.getElementById('cart-items');
    
    if (cartItemsElement) {
        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<p>Your cart is empty.</p>';
            document.getElementById('cart-subtotal').textContent = '0.00';
            document.getElementById('cart-total').textContent = '0.00';
        } else {
            let cartHTML = '';
            let subtotal = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                cartHTML += `
                <div class="cart-item">
                    <h3>${item.name}</h3>
                    <p>Price: ${formatPrice(item.price)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Total: ${formatPrice(itemTotal)}</p>
                    <button class="button" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
                `;
            });
            
            cartItemsElement.innerHTML = cartHTML;
            document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
            document.getElementById('cart-total').textContent = subtotal.toFixed(2);
        }
    }
}

// Update the order summary on checkout page
function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsElement = document.getElementById('order-items');
    
    if (orderItemsElement) {
        if (cart.length === 0) {
            orderItemsElement.innerHTML = '<p>No items in your order.</p>';
        } else {
            let orderHTML = '';
            let subtotal = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                orderHTML += `
                <div class="order-item">
                    <p>${item.name} x ${item.quantity} - ${formatPrice(itemTotal)}</p>
                </div>
                `;
            });
            
            orderItemsElement.innerHTML = orderHTML;
            
            // Calculate shipping (free for orders over GHS 500, otherwise GHS 20)
            const shipping = subtotal > 500 ? 0 : 20;
            const total = subtotal + shipping;
            
            document.getElementById('order-subtotal').textContent = subtotal.toFixed(2);
            document.getElementById('order-shipping').textContent = shipping.toFixed(2);
            document.getElementById('order-total').textContent = total.toFixed(2);
        }
    }
}

// Handle checkout form submission
function handleCheckoutFormSubmission(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zipCode: document.getElementById('zip-code').value,
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        total: document.getElementById('order-total').textContent
    };
    
    // Store order data
    localStorage.setItem('orderData', JSON.stringify(formData));
    
    // Clear cart after successful order
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Redirect to confirmation page or show success message
    alert('Order placed successfully! Thank you for shopping with Buysmart Enterprise.');
    
    // Update cart display
    updateCartCount();
    updateOrderSummary();
}

// Initialize checkout page
function initCheckout() {
    console.log("Initializing Buysmart Enterprise Checkout System");
    
    // Update order summary when the page loads
    updateOrderSummary();
    
    // Add event listener to checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutFormSubmission);
    }
}

// Run initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    
    // Check if this is the checkout page
    if (window.location.pathname.endsWith('checkout.html')) {
        initCheckout();
    }
});
