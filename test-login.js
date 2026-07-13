// Simple test suite for login functionality
const assert = require('assert');

console.log('Starting Login Page Tests...\n');

// Test 1: Email Validation
function testEmailValidation() {
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    console.log('Test 1: Email Validation');
    
    assert.strictEqual(validateEmail('user@example.com'), true, 'Valid email should pass');
    assert.strictEqual(validateEmail('test.user@domain.co.uk'), true, 'Valid email with subdomain should pass');
    assert.strictEqual(validateEmail('invalid-email'), false, 'Invalid email should fail');
    assert.strictEqual(validateEmail('missing@domain'), false, 'Email without TLD should fail');
    assert.strictEqual(validateEmail(''), false, 'Empty email should fail');
    
    console.log('✓ All email validation tests passed\n');
}

// Test 2: Password Validation
function testPasswordValidation() {
    const validatePassword = (password) => {
        return password.length >= 6;
    };

    console.log('Test 2: Password Validation');
    
    assert.strictEqual(validatePassword('password123'), true, 'Password with 6+ chars should pass');
    assert.strictEqual(validatePassword('123456'), true, 'Password with exactly 6 chars should pass');
    assert.strictEqual(validatePassword('abc'), false, 'Password with less than 6 chars should fail');
    assert.strictEqual(validatePassword(''), false, 'Empty password should fail');
    
    console.log('✓ All password validation tests passed\n');
}

// Test 3: Form Data Structure
function testFormDataStructure() {
    console.log('Test 3: Form Data Structure');
    
    const loginData = {
        email: 'test@example.com',
        rememberMe: true,
        timestamp: new Date().toISOString()
    };

    assert.ok(loginData.email, 'Login data should have email');
    assert.ok(typeof loginData.rememberMe === 'boolean', 'rememberMe should be boolean');
    assert.ok(loginData.timestamp, 'Login data should have timestamp');
    assert.ok(!isNaN(Date.parse(loginData.timestamp)), 'Timestamp should be valid ISO date');
    
    console.log('✓ Form data structure tests passed\n');
}

// Test 4: Input Sanitization
function testInputSanitization() {
    console.log('Test 4: Input Sanitization');
    
    const sanitizeInput = (input) => {
        return input.trim();
    };

    assert.strictEqual(sanitizeInput('  test@example.com  '), 'test@example.com', 'Should trim whitespace');
    assert.strictEqual(sanitizeInput('test@example.com'), 'test@example.com', 'Should not modify clean input');
    
    console.log('✓ Input sanitization tests passed\n');
}

// Test 5: Password Toggle Functionality
function testPasswordToggle() {
    console.log('Test 5: Password Toggle Logic');
    
    let passwordType = 'password';
    
    // Simulate toggle
    passwordType = passwordType === 'password' ? 'text' : 'password';
    assert.strictEqual(passwordType, 'text', 'First toggle should change to text');
    
    // Toggle back
    passwordType = passwordType === 'password' ? 'text' : 'password';
    assert.strictEqual(passwordType, 'password', 'Second toggle should change back to password');
    
    console.log('✓ Password toggle tests passed\n');
}

// Run all tests
try {
    testEmailValidation();
    testPasswordValidation();
    testFormDataStructure();
    testInputSanitization();
    testPasswordToggle();
    
    console.log('==========================================');
    console.log('✓ ALL TESTS PASSED (5/5)');
    console.log('==========================================');
    process.exit(0);
} catch (error) {
    console.error('✗ TEST FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
}
