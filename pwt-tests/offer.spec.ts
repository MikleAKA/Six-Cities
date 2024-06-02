import { test, expect } from '@playwright/test';

test.describe('Offer transition test', () => {
  test('should correctly transit to page of an offer', async ({ page }) => {

    await page.goto('./');

    await page.waitForResponse(
      (resp) => resp.url().includes('/offers') && resp.status() === 200
    );

    const firstCardTitle = await page.getByTestId('place--title__test').first().textContent();
    console.log(firstCardTitle);

    const firstCardPrice = await page.locator('.place-card__price-value').first().textContent();
    console.log(firstCardPrice);

    const offerLink = page.getByTestId('place--title__test').first();
    const href = await offerLink.getAttribute('to');
    console.log(`Link href before click: ${href}`);

    await page.getByTestId('place--title__test').first().click();

    const response: any = await page.evaluate(async () => {
      const res = await fetch('https://14.design.htmlacademy.pro/six-cities/offers');
      return res.json();
    });

    console.log(response[0]);

    const firstId = response[0].id;

    console.log(firstId);
    console.log(`${page.url()}`);

    expect(page.url()).toContain(`http://localhost:5173/offer/${firstId}`);

    await page.waitForSelector('.offer__name');

    const clickedCardTitle = await page.locator('.offer__name').textContent();
    const clickedCardPrice = await page.locator('.offer__price-value').textContent();

    expect(firstCardTitle).toBe(clickedCardTitle);
    expect(firstCardPrice).toBe(clickedCardPrice);

  });
});
