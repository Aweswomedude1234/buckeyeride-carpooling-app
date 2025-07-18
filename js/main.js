// Main JavaScript for BuckeyeRide
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupErrorHandling();
    setupMobileMenu();
    setupSmoothScrolling();
    setupFormValidation();
    setupAccessibility();
}

// Global error handling
function setupErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('Global error:', event.error);
        showErrorMessage('Something went wrong. Please try again.');
    });

    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        showErrorMessage('Something went wrong. Please try again.');
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const header = document.querySelector('.header');
    const navList = document.querySelector('.nav-list');
    
    // Create mobile menu button if screen is small
    if (window.innerWidth <= 768) {
        createMobileMenuButton();
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            createMobileMenuButton();
        } else {
            removeMobileMenuButton();
        }
    });
}

function createMobileMenuButton() {
    const header = document.querySelector('.header-content');
    const existingButton = document.querySelector('.mobile-menu-btn');
    
    if (!existingButton) {
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-btn';
        menuButton.innerHTML = '☰';
        menuButton.setAttribute('aria-label', 'Toggle navigation menu');
        menuButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            display: block;
        `;
        
        menuButton.addEventListener('click', toggleMobileMenu);
        header.appendChild(menuButton);
    }
}

function removeMobileMenuButton() {
    const menuButton = document.querySelector('.mobile-menu-btn');
    if (menuButton) {
        menuButton.remove();
    }
}

function toggleMobileMenu() {
    const navList = document.querySelector('.nav-list');
    const isOpen = navList.style.display === 'flex';
    
    if (isOpen) {
        navList.style.display = 'none';
    } else {
        navList.style.display = 'flex';
        navList.style.flexDirection = 'column';
        navList.style.position = 'absolute';
        navList.style.top = '100%';
        navList.style.left = '0';
        navList.style.right = '0';
        navList.style.backgroundColor = 'var(--black)';
        navList.style.padding = '1rem';
        navList.style.zIndex = '1000';
    }
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form validation setup
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    });
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    try {
        if (validateForm(form)) {
            // Form is valid, proceed with submission
            const formData = new FormData(form);
            console.log('Form submitted:', Object.fromEntries(formData));
            showSuccessMessage('Form submitted successfully!');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('Failed to submit form. Please try again.');
    }
}

// Validate entire form
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(event);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 8) {
            errorMessage = 'Password must be at least 8 characters long';
            isValid = false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Accessibility enhancements
function setupAccessibility() {
    // Add skip link
    addSkipLink();
    
    // Enhance keyboard navigation
    enhanceKeyboardNavigation();
    
    // Add ARIA labels where needed
    addAriaLabels();
}

function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-red);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

function enhanceKeyboardNavigation() {
    // Add keyboard support for custom elements
    document.querySelectorAll('[role="button"]').forEach(element => {
        element.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
}

function addAriaLabels() {
    // Add aria-labels to buttons without text
    document.querySelectorAll('button:empty').forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', 'Button');
        }
    });
    
    // Add aria-labels to form inputs without labels
    document.querySelectorAll('input:not([aria-label]):not([id])').forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder) {
            input.setAttribute('aria-label', placeholder);
        }
    });
}

// Utility functions
function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: var(--shadow-hover);
        animation: slideIn 0.3s ease;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'error':
            notification.style.backgroundColor = 'var(--primary-red)';
            break;
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        default:
            notification.style.backgroundColor = 'var(--gray-700)';
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Add click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Handle ride search form
function handleRideSearch() {
    const pickup = document.getElementById('pickup');
    const dropoff = document.getElementById('dropoff');
    const date = document.getElementById('date');
    const time = document.getElementById('time');
    
    try {
        // Validate inputs
        if (!pickup.value.trim()) {
            showFieldError(pickup, 'Please enter a pickup location');
            pickup.focus();
            return;
        }
        
        if (!dropoff.value.trim()) {
            showFieldError(dropoff, 'Please enter a dropoff location');
            dropoff.focus();
            return;
        }
        
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('buckeyeride_user');
        
        if (!isLoggedIn) {
            // Redirect to login with return URL
            const returnUrl = encodeURIComponent(window.location.href);
            window.location.href = `login.html?return=${returnUrl}`;
            return;
        }
        
        // Redirect to find matches page with search parameters
        const searchParams = new URLSearchParams({
            pickup: pickup.value,
            dropoff: dropoff.value,
            date: date.value || new Date().toISOString().split('T')[0],
            time: time.value || 'now'
        });
        
        window.location.href = `dashboard/findmatches.html?${searchParams.toString()}`;
        
    } catch (error) {
        console.error('Ride search error:', error);
        showErrorMessage('Failed to search for rides. Please try again.');
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for use in other scripts
window.BuckeyeRide = {
    showErrorMessage,
    showSuccessMessage,
    showNotification,
    validateField,
    validateForm,
    handleRideSearch
};
