import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');
  });

  test('Добавление ингредиента в конструктор', async ({ page }) => {
    const addButton = page.locator('button:has-text("Добавить")').first();
    await addButton.click();
    await expect(
      page.locator('[class*="constructor-element"]').first()
    ).toBeVisible();
  });

  test('Открытие и закрытие модального окна ингредиента', async ({ page }) => {
    const ingredientLink = page.locator('a[href^="/ingredients/"]').first();
    const ingredientName = await ingredientLink.textContent();
    await ingredientLink.click();
    const modal = page.locator('#modals');
    if (ingredientName) {
      const name = ingredientName.replace(/^\d+/, '').trim();
      await expect(modal).toContainText(name);
    }
    await modal.locator('button').last().click();
    await expect(modal).toBeHidden();
  });

  test('Создание заказа', async ({ page, context }) => {
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);
    await page.addInitScript(() =>
      localStorage.setItem('refreshToken', 'test-refresh-token')
    );

    await page.routeFromHAR('./tests/hars/auth.har', {
      url: '**/api/auth/user'
    });
    await page.routeFromHAR('./tests/hars/order.har', { url: '**/api/orders' });

    await page.goto('/');

    const bun = page.locator('a[href*="643d69a5c3f7b9001cfa093c"]').first();
    await bun.locator('..').locator('button:has-text("Добавить")').click();

    const cutlet = page.locator('a[href*="643d69a5c3f7b9001cfa0941"]').first();
    await cutlet.locator('..').locator('button:has-text("Добавить")').click();

    await bun.locator('..').locator('button:has-text("Добавить")').click();
    await expect(
      page.locator('[class*="constructor-element"]').first()
    ).toBeVisible();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.locator('text=5167')).toBeVisible({ timeout: 10000 });
    await page.locator('#modals button').last().click();
    await expect(page.locator('#modals')).toBeHidden();
    await expect(
      page.locator('[class*="constructor-element"]')
    ).not.toBeVisible();
  });
});
