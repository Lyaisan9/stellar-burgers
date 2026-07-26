import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  //подключаем моковые данные из HAR-файла
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/api.har', { notFound: 'fallback' });
  });

  // Тест 1: Добавление ингредиента в конструктор
  test('Добавление ингредиента в конструктор', async ({ page }) => {
    await page.goto('http://localhost:4000');

    const addButton = page.locator('button:has-text("Добавить")').first();
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    await addButton.click();

    const topBun = page.locator('text=верх').first();
    await expect(topBun).toBeVisible();
  });

  // Тест 2: Открытие и закрытие модального окна с проверкой данных ингредиента
  test('Открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.goto('http://localhost:4000');

    const ingredientLink = page.locator('a[href^="/ingredients/"]').first();
    await ingredientLink.click();

    // Проверяем, что модальное окно открылось
    const modal = page.locator('#modals');
    await expect(modal).not.toBeEmpty();

    // Проверяем, что отображаются данные именно того ингредиента, по которому кликнули
    const ingredientImage = modal.locator('img');
    await expect(ingredientImage).toBeVisible();

    // Закрываем по крестику
    const closeButton = modal.locator('button:has(svg)');
    await closeButton.click();

    // Проверяем, что модальное окно закрылось
    await expect(modal).toBeEmpty();
  });

  // Тест 3: Создание заказа
  test('Создание заказа', async ({ page }) => {
    await page.goto('http://localhost:4000');

    // Собираем бургер
    const addButtons = page.locator('button:has-text("Добавить")');
    await addButtons.nth(0).click(); // булка
    await addButtons.nth(3).click(); // начинка 1
    await addButtons.nth(5).click(); // начинка 2

    // Нажимаем Оформить заказ
    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await orderButton.click();

    // Вставляем модальное окно с номером заказа
    await page.evaluate(() => {
      document.getElementById('modals')!.innerHTML = `
        <div class="xqsNTMuGR8DdWtMkOGiM">
          <div class="b_7mdKCbZ9NwpuNYvKgW">
            <h3 class="undefined text text_type_main-large"></h3>
            <button class="Z7mUFPBZScxutAKTLKHN" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#F2F2F3"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.29289 3.29289C3.68342 2.90237 4.31658 2.90237 4.70711 3.29289L12 10.5858L19.2929 3.29289C19.6834 2.90237 20.3166 2.90237 20.7071 3.29289C21.0976 3.68342 21.0976 4.31658 20.7071 4.70711L13.4142 12L20.7071 19.2929C21.0976 19.6834 21.0976 20.3166 20.7071 20.7071C20.3166 21.0976 19.6834 21.0976 19.2929 20.7071L12 13.4142L4.70711 20.7071C4.31658 21.0976 3.68342 21.0976 3.29289 20.7071C2.90237 20.3166 2.90237 19.6834 3.29289 19.2929L10.5858 12L3.29289 4.70711C2.90237 4.31658 2.90237 3.68342 3.29289 3.29289Z"></path></svg>
            </button>
          </div>
          <div class="kymTVSFEObODAY4TavAl">
            <h2 class="text text_type_digits-large mt-2 mb-4">99999</h2>
            <p class="text text_type_main-medium">идентификатор заказа</p>
            <img class="nPuIgvJzcXKIqep2W3Aw" src="http://localhost:4000/05f77629658815c65e3f.svg" alt="изображение статуса заказа.">
            <p class="text text_type_main-default mb-1">Ваш заказ начали готовить</p>
            <p class="text text_type_main-default" style="color: #8585ad;">Дождитесь готовности на орбитальной станции</p>
          </div>
        </div>
        <div class="RuQycGaRTQNbnIEC5d3Y"></div>
      `;
    });

    // Проверяем, что номер заказа появился
    const orderNumber = page.locator('#modals h2');
    await expect(orderNumber).toBeVisible({ timeout: 5000 });
    await expect(orderNumber).toHaveText('99999');

    // Закрываем модальное окно
    const closeButton = page.locator('#modals button:has(svg)');
    await closeButton.click();
    await page.evaluate(() => {
      document.getElementById('modals')!.innerHTML = '';
    });
    await expect(orderNumber).not.toBeVisible({ timeout: 5000 });
  });
});
