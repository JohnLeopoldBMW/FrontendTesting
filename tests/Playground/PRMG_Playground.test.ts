import { test, expect } from '@playwright/test';

//Test1
test('Test', async ({ page }) => {
  test.setTimeout(2000);

  await page.goto('https://myworkplace-edu.bmwgroup.net/iwp/#/dashboard/proflex');
    await page.waitForTimeout(1000);
    await page.locator('[id="idToken4_2"]').click();
    await page.waitForTimeout(1000);
    await page.locator('[id="idToken2"]').fill('q516590');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.locator('[id="idToken1"]').fill('9423');
    //manuell auf Yubikey drücken
    await page.pause();
    await page.waitForLoadState("networkidle");
    await page.getByText(' Volumes (PRMG)').click();
    await page.waitForLoadState();
    const [newPage] = await Promise.all([
        await page.waitForEvent('popup')
    ])
    await newPage.waitForLoadState();
    await newPage.locator('[id="showVolumes"]').click();
    //await page.waitForTimeout(5000);
    await newPage.waitForLoadState('networkidle');
});