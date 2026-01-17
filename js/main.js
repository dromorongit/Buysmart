// Main JavaScript File
console.log("Buysmart Enterprise E-Commerce Website");

// Mobile Navigation Toggle
function toggleMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Prevent scrolling when mobile menu is open
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
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
    console.log("Initializing Buysmart Enterprise Website");
    
    // Add event listeners
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', toggleMobileNav);
    }
    
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', searchProducts);
    }
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const hamburger = document.querySelector('.hamburger');
            const navLinksContainer = document.querySelector('.nav-links');
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// Run initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Back to Top functionality
function setupBackToTop() {
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
}

// Newsletter form submission
function setupNewsletter() {
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if (email) {
            alert('Thank you for subscribing to Buysmart Enterprise newsletter!');
            emailInput.value = '';
        }
    });
}
}

// Animate elements on scroll
function setupScrollAnimations() {
const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(animateOnScroll, {
    threshold: 0.1
});

// Observe elements that should animate
document.querySelectorAll('.product-card, .category-card, .badge, .testimonial-section, .newsletter-section').forEach(el => {
    observer.observe(el);
});
}

// Enhanced initialization
function enhancedInit() {
console.log("Initializing Buysmart Enterprise Enhanced Features");

// Set up all modern features
setupBackToTop();
setupNewsletter();
setupScrollAnimations();
}

// Run enhanced initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', enhancedInit);

// Carousel functionality
function setupCarousels() {
    const carousels = document.querySelectorAll('.image-carousel');
    
    carousels.forEach((carousel, index) => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        
        // Show first slide
        slides[0].classList.add('active');
        
        // Auto-advance slides every 3 seconds
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000);
    });
}

// Countdown timer functionality
function setupCountdownTimer() {
    const timerElement = document.getElementById('flashSaleTimer');
    
    if (timerElement) {
        // Set countdown time (4 hours from now for demo)
        let countdownTime = 4 * 60 * 60; // 4 hours in seconds
        
        const countdown = setInterval(() => {
            // Calculate hours, minutes, seconds
            const hours = Math.floor(countdownTime / 3600);
            const minutes = Math.floor((countdownTime % 3600) / 60);
            const seconds = countdownTime % 60;
            
            // Update timer display
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            
            // Decrement countdown
            countdownTime--;
            
            // If countdown is finished
            if (countdownTime < 0) {
                clearInterval(countdown);
                timerElement.innerHTML = '<span>FLASH SALE ENDED!</span>';
            }
        }, 1000);
    }
}

// Enhanced initialization with carousels and countdown
function enhancedInit() {
    console.log("Initializing Buysmart Enterprise Enhanced Features");
    
    // Set up all modern features
    setupBackToTop();
    setupNewsletter();
    setupScrollAnimations();
    setupCarousels();
    setupCountdownTimer();
}

// Run enhanced initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', enhancedInit);

// Modal functionality for MTN Mobile Money
function openMtnModal() {
    const modal = document.getElementById('mtnModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeMtnModal() {
    const modal = document.getElementById('mtnModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Modal functionality for Payment Proof Upload
function openProofModal() {
    const modal = document.getElementById('proofModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeProofModal() {
    const modal = document.getElementById('proofModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Handle payment method selection
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    if (paymentMethods) {
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                if (this.value === 'mtn' && this.checked) {
                    openMtnModal();
                }
            });
        });
    }
}

// Global variable to store payment proof URL
let paymentProofUrl = null;

// Handle payment proof submission
async function submitPaymentProof() {
    const fileInput = document.getElementById('payment-proof');
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('paymentProof', file);

        try {
            const response = await fetch('/api/products/upload-payment-proof', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                paymentProofUrl = result.url;
                alert('Payment proof uploaded successfully! Your order will be processed.');
                closeProofModal();
                closeMtnModal();
            } else {
                alert('Failed to upload payment proof. Please try again.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload payment proof. Please try again.');
        }
    } else {
        alert('Please select a file to upload as payment proof.');
    }
}

// Handle form submission
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
            if (selectedPayment) {
                if (selectedPayment.value === 'delivery') {
                    // Handle payment on delivery
                    alert('Order placed successfully! You will pay on delivery.');
                    submitOrderToWhatsApp();
                } else if (selectedPayment.value === 'mtn') {
                    // Check if payment proof was uploaded
                    const fileInput = document.getElementById('payment-proof');
                    if (fileInput && fileInput.files.length > 0) {
                        alert('Order placed successfully! Your payment is being processed.');
                        submitOrderToWhatsApp();
                    } else {
                        alert('Please upload your payment proof before placing the order.');
                        openMtnModal();
                    }
                }
            }
        });
    }
}

// Handle contact form submission
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            const whatsappMessage = `New Contact Message from Buysmart Enterprise:\n\n` +
                                   `Name: ${name}\n` +
                                   `Email: ${email}\n` +
                                   `Subject: ${subject}\n` +
                                   `Message: ${message}`;

            const whatsappUrl = `https://wa.me/233244380498?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');

            // Reset form
            contactForm.reset();
            alert('Message sent successfully!');
        });
    }
}

// Submit order to WhatsApp
function submitOrderToWhatsApp() {
    const fullName = document.getElementById('full-name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    let message = `New Order from Buysmart Enterprise:\n\n` +
                  `Customer Name: ${fullName}\n` +
                  `Phone: ${phone}\n` +
                  `Address: ${address}\n` +
                  `Payment Method: ${paymentMethod === 'delivery' ? 'Payment on Delivery' : 'MTN Mobile Money'}\n` +
                  `Order Details: ${getOrderDetails()}`;

    if (paymentMethod === 'mtn' && paymentProofUrl) {
        message += `\nPayment Proof: ${paymentProofUrl}`;
    }

    const whatsappUrl = `https://wa.me/233244380498?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Get order details from cart
function getOrderDetails() {
    // This would be implemented based on your cart structure
    return "Order details would be populated from cart";
}

// Enhanced initialization with checkout functionality
function enhancedInit() {
    console.log("Initializing Buysmart Enterprise Enhanced Features");

    // Set up all modern features
    setupBackToTop();
    setupNewsletter();
    setupScrollAnimations();
    setupCarousels();
    setupCountdownTimer();
    setupPaymentMethods();
    setupCheckoutForm();
    setupContactForm();
}
