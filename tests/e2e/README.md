# Playwright E2E Tests - Developer Guide

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Install Playwright Browsers
```bash
npx playwright install
```

### Run Tests
```bash
# Run all tests
npm run test:e2e

# Or directly with Playwright
npx playwright test
```

---

## 📖 Available Commands

### Basic Test Execution

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/e2e/daily-steps.spec.ts

# Run tests for specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run mobile tests
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### Interactive Testing

```bash
# Run tests in UI mode (recommended for debugging)
npx playwright test --ui

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run specific test in debug mode
npx playwright test --debug tests/e2e/daily-steps.spec.ts
```

### Test Reports

```bash
# Generate HTML report
npx playwright test --reporter=html

# View last test report
npx playwright show-report

# Run tests with list reporter (detailed output)
npx playwright test --reporter=list
```

### Useful Options

```bash
# Run tests in a specific file matching pattern
npx playwright test daily-steps

# Run only tests with specific tag
npx playwright test --grep "@smoke"

# Run tests excluding specific tag
npx playwright test --grep-invert "@slow"

# Run tests with specific timeout
npx playwright test --timeout=60000

# Run tests with specific number of workers
npx playwright test --workers=2
```

---

## 🎯 Writing New Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('load');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const element = page.locator('[data-testid="element"]');
    
    // Act
    await element.click();
    
    // Assert
    await expect(element).toBeVisible();
  });
});
```

### Best Practices

1. **Use data-testid attributes** for stable selectors
   ```tsx
   <div data-testid="my-component">Content</div>
   ```

2. **Wait for elements** before interacting
   ```typescript
   await page.waitForSelector('[data-testid="element"]');
   ```

3. **Use auto-waiting assertions**
   ```typescript
   await expect(page.locator('[data-testid="element"]')).toBeVisible();
   ```

4. **Handle async operations**
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

5. **Group related tests**
   ```typescript
   test.describe('Layout', () => {
     test('test 1', async ({ page }) => {});
     test('test 2', async ({ page }) => {});
   });
   ```

---

## 🔍 Debugging Tests

### Method 1: UI Mode (Recommended)

```bash
npx playwright test --ui
```

Features:
- Visual test execution
- Step-by-step debugging
- Time travel through test steps
- Screenshot capture
- Network inspection

### Method 2: Debug Mode

```bash
npx playwright test --debug
```

Features:
- Pauses test execution
- Opens Playwright Inspector
- Step through test code
- Evaluate expressions

### Method 3: Screenshots and Videos

Add to test:
```typescript
test('my test', async ({ page }) => {
  // Take screenshot
  await page.screenshot({ path: 'screenshot.png' });
  
  // Full page screenshot
  await page.screenshot({ path: 'full-page.png', fullPage: true });
});
```

Enable video recording in `playwright.config.ts`:
```typescript
use: {
  video: 'on-first-retry',
  screenshot: 'only-on-failure',
}
```

### Method 4: Console Logs

```typescript
test('my test', async ({ page }) => {
  // Listen to console messages
  page.on('console', msg => console.log(msg.text()));
  
  // Log page errors
  page.on('pageerror', err => console.log(err.message));
});
```

---

## 🏗️ Project Structure

```
app/
├── tests/
│   └── e2e/
│       ├── daily-steps.spec.ts      # Daily steps tests
│       ├── TEST_REPORT.md           # Detailed test report
│       ├── SUMMARY.md               # Test summary
│       └── README.md                # This file
├── playwright.config.ts             # Playwright configuration
└── package.json                     # Test scripts
```

---

## ⚙️ Configuration

### playwright.config.ts

Key configuration options:

```typescript
export default defineConfig({
  testDir: './tests/e2e',           // Test directory
  fullyParallel: true,               // Run tests in parallel
  retries: process.env.CI ? 2 : 0,  // Retry failed tests
  workers: 4,                        // Number of parallel workers
  
  use: {
    baseURL: 'http://localhost:3000',  // Base URL
    trace: 'on-first-retry',           // Trace on retry
    screenshot: 'only-on-failure',     // Screenshot on failure
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  
  webServer: {
    command: 'npm run dev',            // Start dev server
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
```

---

## 📦 NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "test:e2e:chromium": "playwright test --project=chromium",
    "test:e2e:firefox": "playwright test --project=firefox",
    "test:e2e:webkit": "playwright test --project=webkit",
    "test:e2e:mobile": "playwright test --project='Mobile Chrome' --project='Mobile Safari'"
  }
}
```

---

## 🎨 Test Selectors

### Recommended Selectors (Priority Order)

1. **data-testid** (Best - most stable)
   ```typescript
   page.locator('[data-testid="daily-steps-card"]')
   ```

2. **ARIA labels**
   ```typescript
   page.getByLabel('Daily steps')
   page.getByRole('button', { name: 'Submit' })
   ```

3. **Text content**
   ```typescript
   page.getByText('Hello World')
   ```

4. **CSS classes** (Use as last resort)
   ```typescript
   page.locator('.daily-steps-card')
   ```

### Adding test IDs to Components

```tsx
// React/Next.js Component
export default function MyComponent() {
  return (
    <div data-testid="my-component">
      <button data-testid="submit-button">Submit</button>
    </div>
  );
}
```

---

## 🔧 Common Patterns

### Waiting for Elements

```typescript
// Wait for selector
await page.waitForSelector('[data-testid="element"]');

// Wait for load state
await page.waitForLoadState('load');
await page.waitForLoadState('networkidle');

// Wait for timeout
await page.waitForTimeout(1000);

// Wait for function
await page.waitForFunction(() => document.readyState === 'complete');
```

### Interacting with Elements

```typescript
// Click
await page.click('[data-testid="button"]');
await page.locator('[data-testid="button"]').click();

// Type
await page.fill('[data-testid="input"]', 'text');
await page.type('[data-testid="input"]', 'text');

// Select
await page.selectOption('[data-testid="select"]', 'value');

// Check
await page.check('[data-testid="checkbox"]');
await page.uncheck('[data-testid="checkbox"]');

// Hover
await page.hover('[data-testid="element"]');
```

### Assertions

```typescript
// Visibility
await expect(page.locator('[data-testid="element"]')).toBeVisible();
await expect(page.locator('[data-testid="element"]')).toBeHidden();

// Text content
await expect(page.locator('[data-testid="element"]')).toContainText('text');
await expect(page.locator('[data-testid="element"]')).toHaveText('exact text');

// Attributes
await expect(page.locator('[data-testid="element"]')).toHaveAttribute('aria-label', 'value');

// Count
await expect(page.locator('[data-testid="item"]')).toHaveCount(3);

// URL
await expect(page).toHaveURL('http://localhost:3000/dashboard');
```

### Mobile Testing

```typescript
test('mobile test', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  
  // Simulate touch
  await page.tap('[data-testid="button"]');
  
  // Check mobile-specific elements
  const isMobile = await page.locator('.mobile-menu').isVisible();
});
```

### Network Mocking

```typescript
test('with network mock', async ({ page }) => {
  // Mock API response
  await page.route('**/api/steps/**', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ stepCount: 8000 })
    });
  });
  
  await page.goto('/dashboard');
});
```

---

## 🐛 Troubleshooting

### Common Issues

1. **Test timeout**
   ```bash
   # Increase timeout
   npx playwright test --timeout=60000
   ```

2. **Element not found**
   ```typescript
   // Add explicit wait
   await page.waitForSelector('[data-testid="element"]', { timeout: 10000 });
   ```

3. **Flaky tests**
   ```typescript
   // Use auto-waiting assertions
   await expect(page.locator('[data-testid="element"]')).toBeVisible();
   
   // Instead of
   expect(await page.locator('[data-testid="element"]').isVisible()).toBe(true);
   ```

4. **Dev server not starting**
   ```bash
   # Check if port is already in use
   lsof -i :3000
   
   # Kill process if needed
   kill -9 <PID>
   ```

---

## 📚 Resources

### Official Documentation
- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-test)

### Useful Links
- [Playwright Discord](https://discord.gg/playwright-807756831384403968)
- [GitHub Issues](https://github.com/microsoft/playwright/issues)
- [Example Tests](https://github.com/microsoft/playwright/tree/main/tests)

---

## 🤝 Contributing

### Adding New Tests

1. Create test file in `tests/e2e/`
2. Follow naming convention: `feature-name.spec.ts`
3. Add data-testid to components
4. Write comprehensive test cases
5. Run tests locally before committing
6. Update documentation

### Code Review Checklist

- [ ] Tests follow naming conventions
- [ ] Tests use stable selectors (data-testid)
- [ ] Tests are isolated (no dependencies)
- [ ] Tests clean up after themselves
- [ ] Tests have descriptive names
- [ ] Tests cover edge cases
- [ ] Tests pass on all browsers
- [ ] Documentation updated

---

## ✅ Test Quality Guidelines

### Good Test Characteristics

1. **Independent** - Can run in any order
2. **Deterministic** - Same result every time
3. **Fast** - Complete quickly
4. **Clear** - Easy to understand
5. **Maintainable** - Easy to update
6. **Comprehensive** - Cover all scenarios

### Test Coverage Goals

- 🎯 **UI Components**: 95%+
- 🎯 **User Interactions**: 90%+
- 🎯 **Error Scenarios**: 100%
- 🎯 **Responsive Layouts**: 100%
- 🎯 **Accessibility**: 90%+

---

*Last Updated: November 5, 2025*  
*Maintained by: Development Team*  
*Framework: Playwright*
