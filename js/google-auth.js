// Google OAuth Integration for Universal BuckeyeRide Platform
// This replaces the OSU-specific authentication with Google OAuth

// Google OAuth configuration
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with actual Google Client ID
const GOOGLE_REDIRECT_URI = window.location.origin + '/dashboard/profile.html';

// Initialize Google OAuth
function initializeGoogleAuth() {
    // Load Google OAuth script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    script.onload = () => {
        setupGoogleSignIn();
    };
}

// Setup Google Sign-In buttons
function setupGoogleSignIn() {
    // For login page
    const loginContainer = document.getElementById('google-login-container');
    if (loginContainer) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleLogin
        });
        
        google.accounts.id.renderButton(
            loginContainer,
            { theme: 'outline', size: 'large', text: 'signin_with' }
        );
    }
    
    // For signup page
    const signupContainer = document.getElementById('google-signup-container');
    if (signupContainer) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleSignup
        });
        
        google.accounts.id.renderButton(
            signupContainer,
            { theme: 'outline', size: 'large', text: 'signup_with' }
        );
    }
}

// Handle Google login callback
function handleGoogleLogin(response) {
    const credential = response.credential;
    const userData = parseJwt(credential);
    
    // Store user data
    const user = {
        id: userData.sub,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('buckeyeride_user', JSON.stringify(user));
    window.location.href = 'dashboard/profile.html';
}

// Handle Google signup callback
function handleGoogleSignup(response) {
    const credential = response.credential;
    const userData = parseJwt(credential);
    
    // Create new user account
    const user = {
        id: userData.sub,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        signupTime: new Date().toISOString(),
        profileComplete: false
    };
    
    localStorage.setItem('buckeyeride_user', JSON.stringify(user));
    window.location.href = 'dashboard/profile.html';
}

// Parse JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
}

// Initialize Google Auth
document.addEventListener('DOMContentLoaded', initializeGoogleAuth);

// Export for use in other scripts
window.GoogleAuth = {
    initializeGoogleAuth,
    handleGoogleLogin,
    handleGoogleSignup
};
