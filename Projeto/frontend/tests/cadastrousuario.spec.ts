import { test, expect } from '@playwright/test';

test('deve cadastrar um novo usuário e redirecionar para o login', async ({ page }) => {
  await page.goto('https://alugaaize.local/login');

  // Clica no link "Criar uma conta"
  await page.getByRole('link', { name: 'Criar uma conta' }).click();

  // Aguarda a tela de cadastro carregar
  await expect(page.getByText('Cadastro')).toBeVisible();

  // Preenche os campos (use email único para evitar duplicidade)
  const email = `teste${Date.now()}@gmail.com`;

  await page.getByPlaceholder('Nome').fill('Teste Criar usuário');
  await page.getByPlaceholder('E-mail').fill('teste@gmail.com');
  await page.getByPlaceholder('CPF').fill('32642019098');
  const camposSenha = page.locator('input[type="password"]');
  await camposSenha.nth(0).fill('Senha@123'); // Campo "Senha"
  await camposSenha.nth(1).fill('Senha@123'); // Campo "Confirme sua senha"

  // Clica no botão cadastrar
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  // Espera redirecionar para tela de login
  await page.waitForURL('**/login');

  // Verifica se a tela de login foi carregada
  await expect(page.getByText('Login')).toBeVisible();
});
