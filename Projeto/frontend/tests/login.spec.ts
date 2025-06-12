import { test, expect } from '@playwright/test';

test('login com usuário válido', async ({ page }) => {
  await page.goto('http://localhost:8080/login');

  // Aguarda que o botão "Entrar" esteja visível (garantia de que a tela carregou)
  await expect(page.getByText('Entrar')).toBeVisible();

  // Preenche os campos
  await page.getByPlaceholder('E-mail').fill('gustavo@gmail.com');
  await page.getByPlaceholder('Senha').fill('Senha@123');

  // Clica no botão de login
  await page.getByRole('button', { name: 'Entrar' }).click();

  // Espera que a navegação para a home ocorra
  await page.waitForURL('**/home');

  // Verifica se há algo visível na home (ex: "Bem-vindo", ou o nome do projeto)
  await expect(page.getByText('Bem-vindo')).toBeVisible();
});
