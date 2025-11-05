import { test, expect } from '@playwright/test';

test.describe('Email Sign In', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('should display login form', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Sign In/i);

    // Check heading
    await expect(page.locator('h1')).toHaveText('Welcome Back');

    // Check form fields
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="rememberMe"]')).toBeVisible();

    // Check submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Sign In');

    // Check links
    await expect(page.locator('a[href="/auth/forgot-password"]')).toBeVisible();
    await expect(page.locator('text=Don\'t have an account?')).toBeVisible();
    await expect(page.locator('a[href="/auth/register"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Submit empty form
    await page.click('button[type="submit"]');

    // Check for error messages
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show error for invalid email', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');
    
    // Enter invalid email
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    // Check for error message
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = page.locator('button[aria-label*="password"]');

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

  test('should toggle remember me checkbox', async ({ page }) => {
    const rememberMeCheckbox = page.locator('input[name="rememberMe"]');

    // Initially unchecked
    await expect(rememberMeCheckbox).not.toBeChecked();

    // Check the checkbox
    await rememberMeCheckbox.check();
    await expect(rememberMeCheckbox).toBeChecked();

    // Uncheck the checkbox
    await rememberMeCheckbox.uncheck();
    await expect(rememberMeCheckbox).not.toBeChecked();
  });

  test('should disable submit button while submitting', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');

    // Fill in form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await submitButton.click();

    // Button should be disabled
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toContainText('Signing in...');
  });

  test('should have accessible labels and error announcements', async ({ page }) => {
    // Check that all inputs have proper accessibility
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    await expect(emailInput).toHaveAttribute('aria-invalid', 'false');
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'false');

    // Submit empty form to trigger errors
    await page.click('button[type="submit"]');

    // Check that inputs are marked as invalid
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    await expect(passwordInput).toHaveAttribute('aria-invalid', 'true');

    // Check that errors have proper IDs and are associated
    await expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
    await expect(page.locator('#email-error')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    // Click sign-up link
    await page.click('a[href="/auth/register"]');

    // Should navigate to register page
    await expect(page).toHaveURL('/auth/register');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // Click forgot password link
    await page.click('a[href="/auth/forgot-password"]');

    // Should navigate to forgot password page
    await expect(page).toHaveURL('/auth/forgot-password');
  });
});

test.describe('Login Form Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
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

  test('should allow clicking remember me label', async ({ page }) => {
    const rememberMeCheckbox = page.locator('input[name="rememberMe"]');
    const rememberMeLabel = page.locator('label[for="rememberMe"]');

    // Initially unchecked
    await expect(rememberMeCheckbox).not.toBeChecked();

    // Click the label
    await rememberMeLabel.click();

    // Checkbox should be checked
    await expect(rememberMeCheckbox).toBeChecked();
  });
});

test.describe('Responsive Behavior', () => {
  test('should display correctly on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/auth/login');

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
    await page.goto('/auth/login');

    // Check that form is visible
    await expect(page.locator('form')).toBeVisible();
  });

  test('should display correctly on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/auth/login');

    // Check that form is visible and centered
    await expect(page.locator('form')).toBeVisible();
  });
});

test.describe('Default Landing Page', () => {
  test('should redirect to login page from root', async ({ page }) => {
    // Navigate to root
    await page.goto('/');

    // Should be redirected to login page
    await expect(page).toHaveURL('/auth/login');
  });
});
