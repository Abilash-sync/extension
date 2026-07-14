document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const rememberCheckbox = document.getElementById('remember');

  // Handle form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;

    // Basic validation
    if (!email || !password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }

    // Simulate login process
    handleLogin(email, password, remember);
  });

  // Handle social login buttons
  const socialButtons = document.querySelectorAll('.btn-social');
  socialButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const provider = button.classList.contains('btn-google') ? 'Google' : 'GitHub';
      showMessage(`Redirecting to ${provider} authentication...`, 'success');
      
      // Simulate redirect delay
      setTimeout(() => {
        console.log(`Authenticating with ${provider}...`);
      }, 1000);
    });
  });

  // Forgot password link
  const forgotPasswordLink = document.querySelector('.forgot-password');
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    showMessage('Password reset link would be sent to your email', 'success');
  });

  // Sign up link
  const signupLink = document.querySelector('.signup-link');
  signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    showMessage('Redirecting to sign up page...', 'success');
  });

  // Handle login
  function handleLogin(email, password, remember) {
    // Add loading state
    const submitButton = loginForm.querySelector('.btn-login');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Signing in...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any login
      console.log('Login attempt:', { email, remember });
      
      // Store session if remember is checked
      if (remember) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Show success message
      showMessage('Login successful! Redirecting...', 'success');

      // Simulate redirect to main app
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 1500);
    }, 1000);
  }

  // Email validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show message
  function showMessage(message, type = 'success') {
    // Remove existing message if any
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}-message show`;
    messageEl.textContent = message;

    // Insert before form
    const form = document.querySelector('.login-form');
    form.insertBefore(messageEl, form.firstChild);

    // Auto remove after 4 seconds
    setTimeout(() => {
      messageEl.classList.remove('show');
      setTimeout(() => messageEl.remove(), 300);
    }, 4000);
  }

  // Load remembered email if exists
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    rememberCheckbox.checked = true;
  }

  // Add input focus effects
  const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
});
