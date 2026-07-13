// Login form functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const successMessage = document.getElementById('successMessage');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Password validation
    function validatePassword(password) {
        return password.length >= 6;
    }

    // Clear error on input
    emailInput.addEventListener('input', function() {
        emailError.textContent = '';
        emailInput.classList.remove('error');
    });

    passwordInput.addEventListener('input', function() {
        passwordError.textContent = '';
        passwordInput.classList.remove('error');
    });

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validate email
        if (!email) {
            emailError.textContent = 'Email is required';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('error');
            isValid = false;
        }

        // Validate password
        if (!password) {
            passwordError.textContent = 'Password is required';
            passwordInput.classList.add('error');
            isValid = false;
        } else if (!validatePassword(password)) {
            passwordError.textContent = 'Password must be at least 6 characters';
            passwordInput.classList.add('error');
            isValid = false;
        }

        // If validation passes
        if (isValid) {
            // Show success message
            successMessage.classList.remove('hidden');
            
            // Store login data (in real app, this would be sent to backend)
            const loginData = {
                email: email,
                rememberMe: document.getElementById('rememberMe').checked,
                timestamp: new Date().toISOString()
            };
            
            console.log('Login successful:', loginData);
            
            // Simulate redirect after 2 seconds
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 2000);
        }
    });

    // Social login buttons
    const googleButton = document.querySelector('.social-button.google');
    const githubButton = document.querySelector('.social-button.github');

    googleButton.addEventListener('click', function() {
        console.log('Google login clicked');
        alert('Google OAuth integration would happen here');
    });

    githubButton.addEventListener('click', function() {
        console.log('GitHub login clicked');
        alert('GitHub OAuth integration would happen here');
    });

    // Forgot password link
    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset functionality would be implemented here');
    });

    // Sign up link
    document.querySelector('.signup-link a').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Sign up page would be shown here');
    });
});
