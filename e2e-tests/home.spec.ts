import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the correct title', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle('Tailspin Toys - Crowdfunding your new favorite game!');
  });

  test('should display the main heading', async ({ page }) => {
    // Check that the main page heading is present
    await expect(page.getByRole('heading', { name: 'Welcome to Tailspin Toys', exact: true })).toBeVisible();
  });

  test('should display the site branding in header', async ({ page }) => {
    // Check that the site branding is present in the header (no longer an h1)
    await expect(page.getByText('Tailspin Toys').first()).toBeVisible();
  });

  test('should display the welcome message', async ({ page }) => {
    // Check that the welcome message is present using more specific locator
    await expect(page.getByText('Find your next game! And maybe even back one! Explore our collection!')).toBeVisible();
  });

  test('should filter games by category and publisher', async ({ page }) => {
    await test.step('Apply category and publisher filters', async () => {
      await page.getByRole('checkbox', { name: 'Strategy' }).check();
      await page.getByTestId('publisher-filter').selectOption('CodeForge Studios');
    });

    await test.step('Verify only matching games remain visible', async () => {
      const visibleCards = page.locator('[data-testid="game-card"]:not([hidden])');
      await expect(visibleCards).toHaveCount(1);
      await expect(visibleCards.first()).toContainText('DevOps Dominion');
      await expect(page.getByTestId('filter-results-status')).toContainText('1 game match the current filters.');
    });

    await test.step('Clear filters and confirm the full catalog returns', async () => {
      await page.getByTestId('clear-filters-button').click();
      await expect(page.getByRole('checkbox', { name: 'Strategy' })).not.toBeChecked();
      await expect(page.getByTestId('publisher-filter')).toHaveValue('all');
      await expect(page.locator('[data-testid="game-card"]:not([hidden])').first()).toBeVisible();
    });
  });
});
