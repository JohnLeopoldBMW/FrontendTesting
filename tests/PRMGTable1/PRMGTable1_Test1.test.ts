import { test, expect } from '@playwright/test';

//Access PRMG with manual Yubikey Press (Debug mode)
test('PRMGTable1', async ({ page }) => {
  test.setTimeout(300000);

  await page.goto('https://myworkplace-edu.bmwgroup.net/iwp/#/dashboard/proflex');
  await page.locator('[id="idToken4_2"]').click();
  await page.locator('[id="idToken2"]').fill('q516590');
  await page.keyboard.press('Enter');
  await page.locator('[id="idToken1"]').fill('9423');
  //manuell auf Yubikey drücken
  await page.pause();
  await page.getByText(' Volumes (PRMG)').click()
  const [newPage] = await Promise.all([
    await page.waitForEvent('popup')
  ])
  await newPage.waitForLoadState();
  await page.pause();
  await newPage.locator('[id="showVolumes"]').click();
  await page.pause();
});