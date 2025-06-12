import { test, expect } from '@playwright/test';

test('Criar, editar e excluir categoria SUV', async ({ page }) => {
  // 1. Login
  await page.goto('https://alugaaize.local/login');
  await page.getByPlaceholder('E-mail').fill('gustavo@gmail.com');
  await page.getByPlaceholder('Senha').fill('Senha@123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('**/home');

  // 2. Vai para Categorias
  await page.getByRole('link', { name: 'Categorias' }).click();
  await page.waitForURL('**/categorias');

  // 3. Cadastra a categoria "SUV"
  await page.getByRole('button', { name: /adicionar/i }).click();
  await page.getByPlaceholder('Nome da Categoria').fill('SUV');
  await page.getByRole('button', { name: /salvar/i }).click();

  // 4. Aguarda o modal de sucesso e clica em "OK"
  await page.getByText('Categoria cadastrada com sucesso!', { exact: false });
  await page.getByRole('button', { name: 'OK' }).click();

  // 5. Verifica que a categoria aparece na lista
  await expect(page.getByText('SUV')).toBeVisible();

  // 6. Edita a categoria para "SUV Atualizado"
  const row = page.locator('tr', { hasText: 'SUV' });
  await row.getByTitle('Editar').click();
  await page.getByPlaceholder('Nome da Categoria').fill('SUV Atualizado');
  await page.getByRole('button', { name: /salvar/i }).click();

  // 7. Aguarda o modal de sucesso e clica em "OK"
  await page.getByText('Categoria atualizada com sucesso!', { exact: false });
  await page.getByRole('button', { name: 'OK' }).click();

  // 8. Verifica a categoria atualizada
  await expect(page.getByText('SUV Atualizado')).toBeVisible();

  // 9. Exclui a categoria
  const updatedRow = page.locator('tr', { hasText: 'SUV Atualizado' });
  await updatedRow.getByTitle('Excluir').click();

  // 10. Confirma o SweetAlert de exclusão
  await page.getByRole('button', { name: 'Sim, excluir!' }).click();

  // 11. Aguarda o modal de sucesso e clica em "OK"
  await page.getByText('Categoria excluída com sucesso!', { exact: false });
  await page.getByRole('button', { name: 'OK' }).click();

  // 12. Verifica que a categoria foi removida
  await expect(page.getByText('SUV Atualizado')).not.toBeVisible();
});
