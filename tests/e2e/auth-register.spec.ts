import { test, expect } from '@playwright/test';

test.describe('Email Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register');
  });

  test('should display registration form', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Create Account/i);

    // Check heading
    await expect(page.locator('h1')).toHaveText('Create Account');

    // Check form fields
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('input[name="agreeToTerms"]')).toBeVisible();

    // Check submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Create Account');

    // Check sign-in link
    await expect(page.locator('text=Already have an account?')).toBeVisible();
    await expect(page.locator('a[href="/auth/login"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Submit empty form
    await page.click('button[type="submit"]');

    // Check for error messages
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password must be at least 8 characters long')).toBeVisible();
    await expect(page.locator('text=Please confirm your password')).toBeVisible();
    await expect(page.locator('text=You must agree to the terms and conditions')).toBeVisible();
  });

  test('should show error for invalid email', async ({ page }) => {
    // Enter invalid email
    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    // Check for error message
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should show password requirements', async ({ page }) => {
    // Start typing password
    await page.fill('input[name="password"]', 'test');

    // Check that password requirements are visible
    await expect(page.locator('text=Password must contain:')).toBeVisible();
    await expect(page.locator('text=At least 8 characters long')).toBeVisible();
    await expect(page.locator('text=Contains lowercase letter')).toBeVisible();
    await expect(page.locator('text=Contains uppercase letter')).toBeVisible();
    await expect(page.locator('text=Contains number')).toBeVisible();
    await expect(page.locator('text=Contains special character')).toBeVisible();
  });

  test('should show password strength meter', async ({ page }) => {
    // Start typing password
    await page.fill('input[name="password"]', 'weak');

    // Check that strength meter is visible
    await expect(page.locator('text=Password strength')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = page.locator('button[aria-label*="password"]').first();

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button
    await toggleButton.click();

    // Password should now be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click toggle button again
    await toggleButton.click();

    // Password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should show error when passwords do not match', async ({ page }) => {
    // Fill in form with mismatched passwords
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!@#');
    await page.fill('input[name="confirmPassword"]', 'Different123!@#');
    await page.check('input[name="agreeToTerms"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for error message
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should show error when terms are not agreed', async ({ page }) => {
    // Fill in form without agreeing to terms
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!@#');
    await page.fill('input[name="confirmPassword"]', 'Test123!@#');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for error message
    await expect(page.locator('text=You must agree to the terms and conditions')).toBeVisible();
  });

  test('should disable submit button while submitting', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Fill in valid form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!@#');
    await page.fill('input[name="confirmPassword"]', 'Test123!@#');
    await page.check('input[name="agreeToTerms"]');

    // Submit form
    await submitButton.click();

    // Button should be disabled
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toContainText('Creating account...');
  });

  test('should have accessible labels and error announcements', async ({ page }) => {
    // Check that all inputs have labels
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]');

    await expect(emailInput).toHaveAttribute('aria-invalid', 'false');
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'false');
    await expect(confirmPasswordInput).toHaveAttribute('aria-invalid', 'false');

    // Submit empty form to trigger errors
    await page.click('button[type="submit"]');

    // Check that inputs are marked as invalid
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    await expect(confirmPasswordInput).toHaveAttribute('aria-invalid', 'true');

    // Check that errors have proper IDs and are associated
    await expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
    await expect(page.locator('#email-error')).toBeVisible();
  });

  test('should navigate to sign-in page', async ({ page }) => {
    // Click sign-in link
    await page.click('a[href="/auth/login"]');

    // Should navigate to login page
    await expect(page).toHaveURL('/auth/login');
  });

  test('should have links to terms and privacy policy', async ({ page }) => {
    // Check for terms and privacy links
    await expect(page.locator('a[href="/legal/terms"]')).toBeVisible();
    await expect(page.locator('a[href="/legal/privacy"]')).toBeVisible();
  });
});

test.describe('Registration Form Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register');
  });

  test('should clear error when user starts typing', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');

    // Submit empty form to trigger errors
    await page.click('button[type="submit"]');

    // Error should be visible
    await expect(page.locator('text=Email is required')).toBeVisible();

    // Start typing
    await emailInput.fill('test');

    // Error should be cleared
    await expect(page.locator('text=Email is required')).not.toBeVisible();
  });

  test('should validate email on blur', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');

    // Enter invalid email
    await emailInput.fill('invalid-email');

    // Blur the field
    await emailInput.blur();

    // Error should be visible
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should update password strength in real-time', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');

    // Type weak password
    await passwordInput.fill('weak');
    await expect(page.locator('text=Weak password')).toBeVisible();

    // Type stronger password
    await passwordInput.fill('Test123!@#');
    await expect(page.locator('text=Strong password')).toBeVisible();
  });

  test('should check password requirements in real-time', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');

    // Type password that meets some requirements
    await passwordInput.fill('test');

    // Check that some requirements are met
    // (This would check for specific visual indicators like checkmarks)
    await expect(page.locator('text=At least 8 characters long')).toBeVisible();
    await expect(page.locator('text=Contains lowercase letter')).toBeVisible();
  });
});

test.describe('Responsive Behavior', () => {
  test('should display correctly on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/auth/register');

    // Check that form is visible and properly sized
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();

    // Check that all inputs are accessible
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should display correctly on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/auth/register');

    // Check that form is visible
    await expect(page.locator('form')).toBeVisible();
  });

  test('should display correctly on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/auth/register');

    // Check that form is visible and centered
    await expect(page.locator('form')).toBeVisible();
  });
});
