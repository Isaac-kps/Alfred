# Research Report: Frontend End-to-End Testing with Playwright

**Date:** 2026-03-11
**Prepared by:** Alfred

---

## Overview

Playwright is a modern, open-source end-to-end testing framework developed by Microsoft that enables automated testing across Chromium, Firefox, and WebKit browsers with a single API. It has emerged as one of the leading alternatives to Selenium and Cypress, offering superior cross-browser support, excellent developer experience, and built-in features like auto-waiting and web-first assertions that reduce test flakiness. The framework unifies end-to-end, API, and component testing into one ecosystem, making it an attractive choice for teams modernising their test automation infrastructure.

## Key Findings

- **Auto-waiting mechanism**: Playwright automatically waits for elements to be actionable before performing actions, significantly reducing flaky tests compared to older frameworks like Selenium ([Playwright](https://playwright.dev/))
- **True cross-browser testing**: Unlike Cypress (Chrome-family and Firefox only), Playwright supports Chromium, Firefox, and WebKit out of the box, providing genuine multi-browser coverage without third-party plugins ([Thinksys](https://thinksys.com/qa-testing/playwright-vs-selenium-vs-cypress/))
- **Parallel execution**: Tests run in parallel by default across multiple browsers and machines, delivering significantly faster test execution ([Microsoft for Developers](https://developer.microsoft.com/blog/the-complete-playwright-end-to-end-story-tools-ai-and-real-world-workflows))
- **User-centric locators**: Role-based locators (`getByRole()`) are the recommended primary selector strategy, mirroring user interactions rather than coupling tests to implementation details ([BrowserStack](https://www.browserstack.com/guide/playwright-selectors))
- **Page Object Model support**: Encapsulating selectors and actions within page objects promotes code reuse and simplifies maintenance when UI changes occur ([Playwright Docs](https://playwright.dev/docs/pom))
- **Test isolation is critical**: Each test should run independently with its own local storage, session storage, and cookies ([Playwright Best Practices](https://playwright.dev/docs/best-practices))
- **Mobile testing limitations**: Playwright only supports emulated mobile devices, not real device testing ([Hypertest](https://www.hypertest.co/software-testing/playwright-automation))
- **Browser extension limitations**: Extensions generally do not work within Playwright's automation context ([WebScraping.AI](https://webscraping.ai/faq/playwright/what-are-the-limitations-of-playwright))

## Deep Dive

### What is Playwright?

Playwright is a framework for web testing and automation maintained by Microsoft that allows developers and QA engineers to test applications across multiple browsers using a single, unified API. It was designed to address pain points in Selenium (verbose setup, flaky tests, slow execution) and Cypress (limited browser support, architectural constraints).

**Core capabilities:**
- Multi-browser control: Chromium (Chrome/Edge), Firefox, and WebKit (Safari)
- Auto-waiting: Elements automatically waited for until actionable
- Web-first assertions: Built-in assertion retries that account for dynamic web behaviour
- Multiple contexts: Tests can span multiple tabs, origins, and user sessions
- Developer tools: Codegen (record tests), Trace Viewer (debug failures), UI Mode (interactive test runner), HTML reports

Works with JavaScript, TypeScript, Python, Java, and C# — TypeScript provides the most mature ecosystem.

---

### Playwright vs Alternatives

| Feature | Playwright | Cypress | Selenium |
|---|---|---|---|
| **Browser Support** | Chromium, Firefox, WebKit | Chrome-family, Firefox (experimental) | All browsers |
| **Setup Complexity** | Low | Very Low | High |
| **Performance** | Very Fast | Fast | Slower |
| **Parallel Execution** | Native | Requires orchestration | Requires grid |
| **Auto-waiting** | Built-in | Limited | Manual waits required |
| **Developer Experience** | Excellent (UI Mode, Codegen) | Excellent (interactive runner) | Learning curve |
| **Best For** | New projects needing cross-browser testing | Frontend teams on Chromium | Large enterprises with polyglot teams |

---

### Setup & Installation

```bash
npm init playwright@latest
```

This command:
1. Creates a project with sensible defaults
2. Prompts for language (TypeScript recommended)
3. Selects browsers (Chromium, Firefox, WebKit)
4. Sets up configuration and example tests
5. Installs browser binaries automatically

**Running tests:**
```bash
npx playwright test              # Run all tests headless in parallel
npx playwright test --headed     # Run with visible browser
npx playwright test --ui         # Interactive UI Mode (best for development)
npx playwright test file.spec.ts # Run single file
```

**Key config (`playwright.config.ts`):**
```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

### Core Concepts

**Test Structure:**
```typescript
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('https://app.example.com/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button:has-text("Sign In")');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

**Locator Priority (best to worst):**
```typescript
page.getByRole('button', { name: 'Sign In' })  // Best
page.getByLabel('Email')
page.getByPlaceholder('Enter your email')
page.getByText('Welcome to our app')
page.getByTestId('user-card')
page.locator('css=.button-primary')             // Last resort
```

**Web-First Assertions (auto-retry until timeout):**
```typescript
await expect(page.locator('.loading')).not.toBeVisible();
await expect(page.locator('[role="alert"]')).toContainText('Error');
await expect(page).toHaveURL(/\/dashboard/);
```

**Page Object Model:**
```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async navigate() { await this.page.goto('/login'); }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }
}
```

---

### Best Practices

1. **Selector hierarchy**: Role locators → Text content → Accessibility labels → Test IDs → CSS/XPath (last resort)
2. **Test isolation**: Each test must be fully independent — no shared state between tests
3. **Avoid external dependencies**: Do not test third-party pages or services
4. **Use web-first assertions**: Never use `waitForTimeout()` — it is flaky and slow
5. **Page Object Model**: Organise by page/component, not by action type
6. **Fixtures for setup/teardown**: Use `test.beforeEach` and `test.afterEach` consistently
7. **No test interdependencies**: Never chain tests that depend on previous test state

---

### CI/CD Integration

**GitHub Actions (`.github/workflows/playwright.yml`):**
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

**Key CI/CD practices:**
- Cache `node_modules` and browser binaries (200–400MB) to save 1–2 minutes per run
- Use single worker in CI (`workers: 1`) to avoid resource contention
- Capture screenshots and traces on failure for debugging
- Upload HTML reports as artifacts for post-run analysis

---

### Limitations & Gotchas

| Limitation | Detail |
|---|---|
| Requires coding knowledge | No no-code option; JS/TS/Python/Java/C# required |
| Mobile — emulation only | No real device support; physical hardware gaps may be missed |
| No Internet Explorer | IE reached EOL in 2022 |
| No browser extensions | Extensions do not work in automation context |
| Resource intensive | Full browser instances consume significant memory/CPU |
| Reporting gaps | No built-in cross-run dashboards; needs third-party (Currents, Replay.io) |
| Promise-based | All operations require `await`; easy to miss in complex tests |
| Canvas/custom UIs | Difficult to test non-standard component libraries |

---

## Recommendations

1. **Adopt Playwright as standard** — Best choice for TrustVC, TradeTrust, and OpenCerts given cross-browser requirements and modern developer experience
2. **Establish selector guidelines** — Mandate role-based locators; prohibit fragile CSS/dynamic class selectors in code reviews
3. **Enforce Page Object Model** — Include POM in the code quality POC as a repeatable, templatisable pattern
4. **CI/CD from day one** — Integrate GitHub Actions immediately to demonstrate production-readiness
5. **Focus on critical workflows** — Login, document verification, certificate issuance; not exhaustive coverage
6. **Document gotchas internally** — Create SOP on test isolation, external dependency avoidance, and selector best practices before team rollout
7. **Plan reporting layer** — Evaluate Currents.dev or Replay.io if historical trend analysis becomes needed
8. **Mobile strategy** — For mobile-heavy use cases, plan complementary device cloud testing; do not rely solely on Playwright emulation

---

## Sources

| # | Title | URL |
|---|---|---|
| 1 | Fast and reliable end-to-end testing for modern web apps | https://playwright.dev/ |
| 2 | The Complete Playwright End-to-End Story | https://developer.microsoft.com/blog/the-complete-playwright-end-to-end-story-tools-ai-and-real-world-workflows |
| 3 | How to perform End to End Testing using Playwright | https://www.browserstack.com/guide/end-to-end-testing-using-playwright |
| 4 | Playwright vs Selenium vs Cypress: A Detailed Comparison 2025 | https://thinksys.com/qa-testing/playwright-vs-selenium-vs-cypress/ |
| 5 | Playwright vs Selenium vs Cypress | https://testomat.io/blog/playwright-vs-selenium-vs-cypress-a-detailed-comparison/ |
| 6 | Playwright Selectors: Types and Best Practices | https://www.browserstack.com/guide/playwright-selectors |
| 7 | Page object models | https://playwright.dev/docs/pom |
| 8 | Best Practices | https://playwright.dev/docs/best-practices |
| 9 | Setting up CI | https://playwright.dev/docs/ci-intro |
| 10 | Best Playwright CI/CD Integrations | https://testdino.com/blog/playwright-ci-cd-integrations/ |
| 11 | Using Playwright? Here Are the Challenges You Need to Know | https://www.hypertest.co/software-testing/playwright-automation |
| 12 | What are the limitations of Playwright? | https://webscraping.ai/faq/playwright/what-are-the-limitations-of-playwright |
| 13 | State of Playwright AI Ecosystem in 2026 | https://currents.dev/posts/state-of-playwright-ai-ecosystem-in-2026 |
| 14 | 9 Playwright Best Practices: Reliable and Easy Tests | https://betterstack.com/community/guides/testing/playwright-best-practices/ |
| 15 | The Ultimate Playwright Guide for 2026 | https://www.pixelqa.com/blog/post/playwright-guide-installation-framework-structure-best-practices-ci-cd-setup |

## Confidence

**High** — Research gathered from official Playwright documentation, Microsoft's engineering blog, established testing platforms (BrowserStack, Better Stack, Testomat.io), and recent 2026 comparative analyses. Information is current and cross-validated across multiple independent sources.
