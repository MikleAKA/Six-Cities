import { test, expect } from '@playwright/test';

const textReview = "Текст для формы комментария длиной больше пятидесяти символов чтобы он наверняка прошёл AUNKERE TEST";
const rateReview = "perfect";

test.describe('Review sending tests', () => {

  test('should not submit review to an unauthorized user', async ({ page }) => {

    await page.goto('./');

    await page.getByTestId('place--title__test').first().click();
    await page.waitForSelector('.offer__gallery');

    const isVisible = await page.locator('.reviews__form').isVisible();
    expect(isVisible).toBeTruthy();

    await page.fill('[name="review"]', textReview);
    await page.getByTitle(rateReview).click();

    const submitButton = page.locator('button.reviews__submit.form__submit.button');
    await expect(submitButton).toBeDisabled();

  });

  test('should submit review to an authorized user', async ({ page }) => {

    await page.goto('./login');

    await page.fill('input[name=email]', 'test-correct@example.com');
    await page.fill('input[name=password]', 'test-correct1410');
    await page.click('button[type=submit]');
    await page.waitForURL('./');
    expect(page.url()).toBe('http://localhost:5173/');

    await page.getByTestId('place--title__test').first().click();
    await page.waitForSelector('.offer__gallery');

    const isVisible = await page.locator('.reviews__form').isVisible();
    expect(isVisible).toBeTruthy();

    await page.fill('[name="review"]', textReview);
    await page.getByTitle(rateReview).click();

    const submitButton = page.locator('button.reviews__submit.form__submit.button');
    await expect(submitButton).not.toBeDisabled();

    await Promise.all([
      page.waitForResponse(
        (response) => response.url().includes('/comments') && response.status() === 201
      ),
      page.click('button[type="submit"]'),
    ]);

    await page.waitForSelector('.offer__gallery');

    const reviewTextFetched = await page.locator('.reviews__text').first().textContent();
    const authorName = await page.locator('.reviews__user-name').first().textContent();
    const rating = await page.locator('.reviews__stars>span').first().getAttribute('style');

    expect(reviewTextFetched).toBe(textReview);
    expect(authorName).toBe('test-correct');
    expect(rating).toBe('width: 100%;');
  });

})
