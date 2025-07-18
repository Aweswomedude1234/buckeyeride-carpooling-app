// Authentication JavaScript for BuckeyeRide
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

// Initialize authentication functionality
function initializeAuth() {
    setupAuthForms();
    checkAuthState();
    setupPasswordValidation();
    setupEmailValidation();
}

// Setup form event listeners
function setupAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        setupPasswordConfirmation();
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');
        
        // Validate inputs
        if (!validateEmail(email)) {
            showFieldError(document.getElementById('email'), 'Please enter a valid OSU email address');
            return;
        }
        
        if (!password || password.length < 8) {
            showFieldError(document.getElementById('password'), 'Password must be at least 8 characters');
            return;
        }
        
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;
        
        // Simulate login process
        setTimeout(() => {
            // In a real app, this would make an API call
            const loginSuccess = simulateLogin(email, password);
            
            if (loginSuccess) {
                // Store user session
                const userData = {
                    email: email,
                    name: email.split('@')[0],
                    loginTime: new Date().toISOString(),
                    remember: remember
                };
                
                if (remember) {
                    localStorage.setItem('buckeyeride_user', JSON.stringify(userData));
                } else {
                    sessionStorage.setItem('buckeyeride_user', JSON.stringify(userData));
                }
                
                // Show success message
                showSuccessMessage('Login successful! Redirecting...');
                
                // Redirect to dashboard or return URL
                setTimeout(() => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const returnUrl = urlParams.get('return') || 'dashboard/profile.html';
                    window.location.href = decodeURIComponent(returnUrl);
                }, 1500);
                
            } else {
                showErrorMessage('Invalid email or password. Please try again.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        showErrorMessage('Login failed. Please try again.');
    }
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const userType = formData.get('userType');
        const terms = formData.get('terms');
        
        // Validate all fields
        let isValid = true;
        
        if (!firstName.trim()) {
            showFieldError(document.getElementById('firstName'), 'First name is required');
            isValid = false;
        }
        
        if (!lastName.trim()) {
            showFieldError(document.getElementById('lastName'), 'Last name is required');
            isValid = false;
        }
        
        if (!validateOSUEmail(email)) {
            showFieldError(document.getElementById('email'), 'Please use your OSU email address');
            isValid = false;
        }
        
        if (!validatePhone(phone)) {
            showFieldError(document.getElementById('phone'), 'Please enter a valid phone number');
            isValid = false;
        }
        
        if (!validatePassword(password)) {
            showFieldError(document.getElementById('password'), 'Password must be at least 8 characters long');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            showFieldError(document.getElementById('confirmPassword'), 'Passwords do not match');
            isValid = false;
        }
        
        if (!userType) {
            showFieldError(document.getElementById('userType'), 'Please select your affiliation');
            isValid = false;
        }
        
        if (!terms) {
            showFieldError(document.getElementById('terms'), 'You must agree to the terms of service');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        // Simulate signup process
        setTimeout(() => {
            // In a real app, this would make an API call
            const signupSuccess = simulateSignup({
                firstName,
                lastName,
                email,
                phone,
                userType,
                newsletter: formData.get('newsletter')
            });
            
            if (signupSuccess) {
                // Store user session
                const userData = {
                    email: email,
                    name: `${firstName} ${lastName}`,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    userType: userType,
                    signupTime: new Date().toISOString(),
                    profileComplete: false
                };
                
                localStorage.setItem('buckeyeride_user', JSON.stringify(userData));
                
                // Show success message
                showSuccessMessage('Account created successfully! Redirecting to complete your profile...');
                
                // Redirect to profile completion
                setTimeout(() => {
                    window.location.href = 'dashboard/profile.html';
                }, 2000);
                
            } else {
                showErrorMessage('Signup failed. This email may already be registered.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 1500);
        
    } catch (error) {
        console.error('Signup error:', error);
        showErrorMessage('Signup failed. Please try again.');
    }
}

// Setup password confirmation validation
function setupPasswordConfirmation() {
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    
    if (passwordField && confirmPasswordField) {
        confirmPasswordField.addEventListener('input', function() {
            if (this.value && passwordField.value !== this.value) {
                showFieldError(this, 'Passwords do not match');
            } else {
                clearFieldError({ target: this });
            }
        });
    }
}

// Setup password validation
function setupPasswordValidation() {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        if (field.name === 'password') {
            field.addEventListener('input', function() {
                const strength = getPasswordStrength(this.value);
                showPasswordStrength(this, strength);
            });
        }
    });
}

// Setup email validation
function setupEmailValidation() {
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value && !validateOSUEmail(this.value)) {
                showFieldError(this, 'Please use your OSU email address (@osu.edu)');
            }
        });
    });
}

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateOSUEmail(email) {
    const osuEmailRegex = /^[^\s@]+@osu\.edu$/i;
    return osuEmailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
}

function validatePassword(password) {
    return password && password.length >= 8;
}

function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

function showPasswordStrength(field, strength) {
    // Remove existing strength indicator
    const existingIndicator = field.parentNode.querySelector('.password-strength');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    if (field.value.length > 0) {
        const indicator = document.createElement('div');
        indicator.className = 'password-strength';
        
        const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength - 1] || 'Very Weak';
        const strengthColor = ['#ff4444', '#ff8800', '#ffaa00', '#88cc00', '#00cc44'][strength - 1] || '#ff4444';
        
        indicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill" style="width: ${strength * 20}%; background-color: ${strengthColor};"></div>
            </div>
            <span class="strength-text" style="color: ${strengthColor};">${strengthText}</span>
        `;
        
        indicator.style.cssText = `
            margin-top: 0.5rem;
            font-size: 0.8rem;
        `;
        
        const strengthBar = indicator.querySelector('.strength-bar');
        strengthBar.style.cssText = `
            width: 100%;
            height: 4px;
            background-color: #e0e0e0;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 0.25rem;
        `;
        
        const strengthFill = indicator.querySelector('.strength-fill');
        strengthFill.style.cssText = `
            height: 100%;
            transition: width 0.3s ease;
            border-radius: 2px;
        `;
        
        field.parentNode.appendChild(indicator);
    }
}

// Simulation functions (replace with real API calls)
function simulateLogin(email, password) {
    // Simulate successful login for demo purposes
    // In a real app, this would validate against a backend
    return validateOSUEmail(email) && password.length >= 8;
}

function simulateSignup(userData) {
    // Simulate successful signup for demo purposes
    // In a real app, this would create a user account via API
    return validateOSUEmail(userData.email);
}

// Check authentication state
function checkAuthState() {
    const user = getCurrentUser();
    if (user) {
        // User is logged in, update UI if needed
        updateAuthUI(user);
    }
}

// Get current user from storage
function getCurrentUser() {
    try {
        const userData = localStorage.getItem('buckeyeride_user') || 
                        sessionStorage.getItem('buckeyeride_user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

// Update authentication UI
function updateAuthUI(user) {
    // Update navigation if user is logged in
    const navList = document.querySelector('.nav-list');
    if (navList && user) {
        // Replace login/signup with user menu
        const loginLink = navList.querySelector('a[href="login.html"]');
        const signupLink = navList.querySelector('a[href="signup.html"]');
        
        if (loginLink && signupLink) {
            loginLink.textContent = `Hi, ${user.firstName || user.name}`;
            loginLink.href = 'dashboard/profile.html';
            
            signupLink.textContent = 'Dashboard';
            signupLink.href = 'dashboard/profile.html';
            signupLink.classList.remove('signup-btn');
        }
    }
}

// Logout function
function logout() {
    try {
        localStorage.removeItem('buckeyeride_user');
        sessionStorage.removeItem('buckeyeride_user');
        showSuccessMessage('Logged out successfully');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        console.error('Logout error:', error);
        showErrorMessage('Error logging out');
    }
}

// OSU login simulation
function loginWithOSU() {
    showNotification('OSU login integration coming soon!', 'info');
}

function signupWithOSU() {
    showNotification('OSU signup integration coming soon!', 'info');
}

// Utility functions for error handling
function showFieldError(field, message) {
    if (window.BuckeyeRide && window.BuckeyeRide.showFieldError) {
        // Use the main.js function if available
        window.BuckeyeRide.showFieldError(field, message);
    } else {
        // Fallback implementation
        field.classList.add('error');
        
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
}

function clearFieldError(event) {
    if (window.BuckeyeRide && window.BuckeyeRide.clearFieldError) {
        window.BuckeyeRide.clearFieldError(event);
    } else {
        const field = event.target;
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

function showErrorMessage(message) {
    if (window.BuckeyeRide && window.BuckeyeRide.showErrorMessage) {
        window.BuckeyeRide.showErrorMessage(message);
    } else {
        alert(message);
    }
}

function showSuccessMessage(message) {
    if (window.BuckeyeRide && window.BuckeyeRide.showSuccessMessage) {
        window.BuckeyeRide.showSuccessMessage(message);
    } else {
        alert(message);
    }
}

function showNotification(message, type) {
    if (window.BuckeyeRide && window.BuckeyeRide.showNotification) {
        window.BuckeyeRide.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Export functions for use in other scripts
window.BuckeyeRideAuth = {
    getCurrentUser,
    logout,
    validateOSUEmail,
    validatePhone,
    validatePassword,
    loginWithOSU,
    signupWithOSU
};
