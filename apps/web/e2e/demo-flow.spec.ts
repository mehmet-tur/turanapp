import { expect, test } from '@playwright/test';

test('demo kullanıcı rezervasyon ve görüşme odası akışını tamamlar', async ({ page }) => {
  await page.goto('/login');

  await page.getByPlaceholder('E-posta').fill('demo@unluapp.local');
  await page.getByPlaceholder('Şifre').fill('Password123!');
  await page.getByRole('button', { name: 'Giriş Yap', exact: true }).click();

  await page.waitForURL('**/bookings');
  await page.goto('/talents');
  await page.getByRole('link', { name: 'Profili İncele' }).first().click();


  await page.getByText('dk').first().click();
  await page.getByRole('button', { name: 'Rezervasyon Oluştur' }).click();

  await page.waitForURL('**/bookings/*');
  await expect(page.getByText('Rezervasyon Detayı')).toBeVisible();
  await page.getByRole('button', { name: 'Görüşme Odasına Git' }).click();

  await page.waitForURL('**/call/*');

  await expect(page.getByRole('button', { name: 'Görüşmeye Katıl' })).toBeVisible();
});
