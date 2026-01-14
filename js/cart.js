// Cart JavaScript File
console.log("Buysmart Enterprise Cart System");

// Cart Functions
function addToCart(productId, productName, productPrice, productImage) {
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
            image: productImage || 'https://via.placeholder.com/80x80/ff0000/ffffff?text=Product',
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

// Increase quantity of a product in the cart
function increaseQuantity(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === productId);
    
    if (product) {
        product.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }
}

// Decrease quantity of a product in the cart
function decreaseQuantity(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === productId);
    
    if (product && product.quantity > 1) {
        product.quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }
}

// Clear the entire cart
function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    updateCartDisplay();
    console.log('Cart cleared');
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
                    <div class="cart-item-image">
                        <img src="${item.image || 'https://via.placeholder.com/80x80/ff0000/ffffff?text=Product'}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p>Price: ${formatPrice(item.price)}</p>
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="decreaseQuantity('${item.id}')">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="increaseQuantity('${item.id}')">+</button>
                        </div>
                        <p>Total: ${formatPrice(itemTotal)}</p>
                    </div>
                    <button class="button remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
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
    const orderTotalElement = document.getElementById('order-total');
    
    if (orderItemsElement && orderTotalElement) {
        if (cart.length === 0) {
            orderItemsElement.innerHTML = '<p>No items in your order.</p>';
            orderTotalElement.textContent = '0.00';
        } else {
            let orderHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                orderHTML += `
                <div class="order-item">
                    <p>${item.name} x ${item.quantity} - ${formatPrice(itemTotal)}</p>
                </div>
                `;
            });
            
            orderItemsElement.innerHTML = orderHTML;
            orderTotalElement.textContent = total.toFixed(2);
        }
    }
}

// Handle checkout form submission
function handleCheckoutFormSubmission(event) {
    event.preventDefault();
    
    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Get form data
    const formData = {
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        paymentMethod: paymentMethod,
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        total: document.getElementById('order-total').textContent
    };
    
    // Handle different payment methods
    if (paymentMethod === 'mtn') {
        // Show MTN Mobile Money modal
        openMtnModal();
    } else {
        // For payment on delivery, proceed with order
        submitOrderToWhatsApp(formData);
    }
}

// Open MTN Mobile Money modal
function openMtnModal() {
    document.getElementById('mtnModal').style.display = 'block';
}

// Close MTN Mobile Money modal
function closeMtnModal() {
    document.getElementById('mtnModal').style.display = 'none';
}

// Open payment proof upload modal
function openProofModal() {
    document.getElementById('proofModal').style.display = 'block';
}

// Close payment proof upload modal
function closeProofModal() {
    document.getElementById('proofModal').style.display = 'none';
}

// Submit payment proof
function submitPaymentProof() {
    const fileInput = document.getElementById('payment-proof');
    const file = fileInput.files[0];
    
    if (file) {
        // In a real application, you would upload the file to a server here
        // For this demo, we'll just proceed with the order
        const formData = JSON.parse(localStorage.getItem('orderData'));
        submitOrderToWhatsApp(formData);
        
        // Close the modal
        closeProofModal();
        
        // Clear cart after successful order
        localStorage.setItem('cart', JSON.stringify([]));
        
        // Update cart display
        updateCartCount();
        updateOrderSummary();
    } else {
        alert('Please select a file to upload as payment proof.');
    }
}

// Submit order to WhatsApp
function submitOrderToWhatsApp(formData) {
    // Prepare order details for WhatsApp message
    const orderItems = formData.cart.map(item =>
        `${item.name} x ${item.quantity} - GHS ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `
*New Order from Buysmart Enterprise*\n\n
*Customer Details:*\n
Name: ${formData.fullName}\n
Phone: ${formData.phone}\n
Email: ${formData.email}\n
Address: ${formData.address}\n
City: ${formData.city}\n\n
*Order Items:*\n
${orderItems}\n\n
*Total:* GHS ${formData.total}\n\n
*Payment Method:* ${formData.paymentMethod}
    `;
    
    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp business number
    const whatsappNumber = '233244380498';
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    alert('Order placed successfully! Thank you for shopping with Buysmart Enterprise. Please complete your payment if you chose MTN Mobile Money.');
    
    // Clear cart after successful order
    localStorage.setItem('cart', JSON.stringify([]));
    
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
