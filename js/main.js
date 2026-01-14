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
