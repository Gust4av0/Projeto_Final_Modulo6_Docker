import { test, expect } from '@playwright/test';

test('deve acessar a página inicial e verificar o título', async ({ page }) => {
  await page.goto('https://alugaaize.local/login');

  // Espera que algo da sua página esteja visível, por exemplo um título, texto ou botão
  await expect(page).toHaveTitle('Login - Aluga Aí Zé');

  await expect(page.getByText('Entrar')).toBeVisible(); // ajuste conforme o texto da sua home
});
