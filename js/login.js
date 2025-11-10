// Login form functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = document.querySelector('.login-button');
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Basic validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Simulate login process
        simulateLogin(email, password);
    });
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show error message
    function showError(message) {
        // Remove existing error message if any
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            background: #FEF2F2;
            color: #DC2626;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            border: 1px solid #FECACA;
        `;
        errorElement.textContent = message;
        
        // Insert error message before the form
        loginForm.insertBefore(errorElement, loginForm.firstChild);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }
    
    // Login process with MongoDB API
    async function simulateLogin(email, password) {
        // Show loading state
        loginButton.innerHTML = 'Logging in...';
        loginButton.disabled = true;
        
        try {
            // Call the API
            const response = await API.login({
                email: email,
                password: password
            });
            
            if (response.success) {
                // Show success message
                const successElement = document.createElement('div');
                successElement.className = 'success-message';
                successElement.style.cssText = `
                    background: #F0FDF4;
                    color: #16A34A;
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    border: 1px solid #BBF7D0;
                `;
                successElement.textContent = 'Login successful! Redirecting...';
                
                loginForm.insertBefore(successElement, loginForm.firstChild);
                
                // Redirect to homepage after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                throw new Error(response.message || 'Login failed');
            }
            
        } catch (error) {
            // Reset button state
            loginButton.innerHTML = 'Log In';
            loginButton.disabled = false;
            
            // Show error message
            showError(error.message || 'Login failed. Please check your credentials and try again.');
        }
    }
    
    // Social login button handlers
    const googleButton = document.querySelector('.social-button.google');
    const appleButton = document.querySelector('.social-button.apple');
    
    googleButton.addEventListener('click', function() {
        // Implement Google OAuth login
        alert('Google login would be implemented here');
    });
    
    appleButton.addEventListener('click', function() {
        // Implement Apple OAuth login
        alert('Apple login would be implemented here');
    });
    
    // Input field animations
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});