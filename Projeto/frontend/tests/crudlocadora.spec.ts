import { test, expect } from '@playwright/test';

test('Criar, editar e excluir uma locadora', async ({ page }) => {
  await page.goto('http://localhost:8080/login');

  await page.getByPlaceholder('E-mail').fill('gustavo@gmail.com');
  await page.getByPlaceholder('Senha').fill('Senha@123');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.waitForURL('**/home');

  await page.getByRole('link', { name: 'Locadoras' }).click();
  await page.waitForURL('**/locadoras');

  await page.getByRole('button', { name: /adicionar/i }).click();
  await page.getByPlaceholder('Nome').fill('Locadora Zé');
  await page.getByPlaceholder('Cidade').fill('Campo Mourão');
  await page.getByPlaceholder('Estado').fill('PR');
  await page.getByRole('button', { name: /salvar/i }).click();

  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('Locadora Zé')).toBeVisible();

  const row = page.locator('tr', { hasText: 'Locadora Zé' });
  await row.getByTitle('Editar').click();
  await page.getByPlaceholder('Nome').fill('Locadora Zé Atualizada');
  await page.getByPlaceholder('Cidade').fill('Maringá');
  await page.getByPlaceholder('Estado').fill('PR');
  await page.getByRole('button', { name: /salvar/i }).click();

  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('Locadora Zé Atualizada')).toBeVisible();

  const updatedRow = page.locator('tr', { hasText: 'Locadora Zé Atualizada' });
  await updatedRow.getByTitle('Excluir').click();

  // Aguarda o SweetAlert aparecer com um timeout maior
  const confirmarBtn = page.getByRole('button', { name: 'Sim, excluir' });
  await confirmarBtn.waitFor({ timeout: 5000 });
  await confirmarBtn.click();

  // Aguarda modal de sucesso pós-exclusão
  const okBtn = page.getByRole('button', { name: 'OK' });
  await okBtn.waitFor({ timeout: 5000 });
  await okBtn.click();

  // Verifica que a locadora foi excluída
  await expect(page.getByText('Locadora Zé Atualizada')).not.toBeVisible();
});
