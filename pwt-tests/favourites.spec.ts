import { test, expect } from '@playwright/test';

test.describe('Favorites page and button tests -- unauthorized', () => {
  test('should redirect to login page if unauthorized', async ({ page }) => {

    await page.goto('./Favourites');
    await page.waitForURL('./login');

    expect(`${page.url()}`).toBe('http://localhost:5173/login');
    console.log(page.url())
  });

})


test.describe('Favourites page and button tests -- authorized', () => {

  test('should add to favorites if authorized on offer-page', async ({ page }) => {

    await page.goto('./login');
    await page.fill('input[name=email]', 'test-1-fovurite-correct@example.com');
    await page.fill('input[name=password]', 'test-correct1410');
    await page.click('button[type=submit]');
    await page.waitForURL('./');

    await page.waitForSelector('.cities__card');
    await page.waitForSelector('.header__nav');
    await page.getByTestId('place--title__test').first().click();
    await page.waitForSelector('.offer__gallery');

    const favoriteCount = page.locator('.header__favorite-count');
    await expect(favoriteCount).toHaveText('0');

    const bookmarkButton = page.locator('button.offer__bookmark-button.button');
    await bookmarkButton.click();
    await expect(bookmarkButton).toHaveClass(/offer__bookmark-button--active/);

    await expect(favoriteCount).toHaveText('1');

    const profileLink = page.locator('nav.header__nav >> a.headernav-link.headernav-link--profile');
    await profileLink.click();

    console.log(page.url());
    await expect(page).toHaveURL('./Favourites');

    const favoritesSection = page.locator('section.favorites');
    await expect(favoritesSection).not.toHaveClass(/favorites--empty/);

  });

  test('should add to favorites if authorized on main-page', async ({ page }) => {

    await page.goto('./login');
    await page.fill('input[name=email]', 'test-2-fovurite-correct@example.com');
    await page.fill('input[name=password]', 'test-correct1410');
    await page.click('button[type=submit]');
    await page.waitForURL('./');

    await page.waitForSelector('.cities__card');
    await page.waitForSelector('.header__nav');

    const favoriteCount = page.locator('.header__favorite-count');
    await expect(favoriteCount).toHaveText('0');

    const bookmarkButton = page.locator('button.place-card__bookmark-button.button').first();
    await bookmarkButton.click();
    await expect(bookmarkButton).toHaveClass(/place-card__bookmark-button--active/);

    await expect(favoriteCount).toHaveText('1');

    const profileLink = page.locator('nav.header__nav >> a.headernav-link.headernav-link--profile');
    await profileLink.click();

    await expect(page).toHaveURL('./Favourites');

    const favoritesSection = page.locator('section.favorites');
    await expect(favoritesSection).not.toHaveClass(/favorites--empty/);

  });

  test('should be empty favourites if didn\'t add', async ({ page }) => {

    await page.goto('./login');
    await page.fill('input[name=email]', 'test-3-fovurite-correct@example.com');
    await page.fill('input[name=password]', 'test-correct1410');
    await page.click('button[type=submit]');
    await page.waitForURL('./');

    await page.waitForSelector('.cities__card');
    await page.waitForSelector('.header__nav');

    const favoriteCount = page.locator('.header__favorite-count');
    await expect(favoriteCount).toHaveText('0');

    const profileLink = page.locator('nav.header__nav >> a.headernav-link.headernav-link--profile');
    await profileLink.click();

    await expect(page).toHaveURL('./Favourites');

    const favoritesSection = page.locator('section.favorites');
    await expect(favoritesSection).toHaveClass(/favorites--empty/);

  });
})
