import { test, expect } from '@playwright/test';
import { isContext } from 'vm';

//Test1 - Get Dimensions from PRMG
test('DimensionsPRMGReal', async ({ page }) => {
  test.setTimeout(300000);
  await page.goto('https://myworkplace-edu.bmwgroup.net/iwp/#/');
  await page.locator('[id="idToken4_1"]').click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.locator('[data-testid="filter-input"]').fill('ProFlex');
  await page.locator('#cdk-overlay-0 mwp-widgets-dashboard-search-card div').filter({ hasText: 'PROFLEX (UAT)' }).nth(2).click();
  await page.pause();
});


//Test2 - Get Dimensions from PRMG
test('DimensionsPRMGFake', async ({ page }) => {
    test.setTimeout(300000);
    await page.goto('file:///C:/Users/Q516590/Desktop/PRMGWeb/PrmgUi.html');
    await page.pause();
  });


//Test3 - Get Dimensions from PRMG
test('DimensionsPRMGFakeFake', async ({ page }) => {
  test.setTimeout(300000);
  await page.goto('https://mucaaf.bmwgroup.net:8443/login');
  //await page.locator('[id="_username"]').click();
  await page.locator('[id="_username"]').fill('q516590');
  await page.keyboard.press('Enter');
  //manuell auf Yubikey drücken
  await page.pause();
  //await page.locator('[id="answer"]').click();
  await page.locator('[id="answer"]').fill('9423');
  await page.keyboard.press('Enter');
  //Fortsetzung PRMG Umgebung
  async ({ page2 }) => {
      await page2.goto('https://myworkplace-edu.bmwgroup.net/iwp/#/dashboard/proflex');
  }
  await page.pause();

  // await page2.goto('https://myworkplace-edu.bmwgroup.net/iwp/#/dashboard/proflex');
  // await page.locator('[id="idToken4_1"]').click();
  // await page.locator('[id="idToken2"]').click();
  // await page.locator('[id="idToken2"]').fill('q516590');
  // await page.getByPlaceholder('User Name').click();
  // await page.getByPlaceholder('User Name').fill('q516590');
  // await page.keyboard.press('W');
  // await page.keyboard.press('U');
  // await page.keyboard.press('R');
  // await page.keyboard.press('S');
  // await page.keyboard.press('T');
  // await page.keyboard.press('Enter');
});

//Test4 - Get Dimensions from PRMG
test('DimensionsPRMGLink', async ({ page }) => {
  test.setTimeout(300000);
  await page.goto('https://vofapl-int-prmg03.bmwgroup.net/?strongAuthService=strongAuth7000Service&deviceType=1&env=workplace&lang=en&locale=en-GB&mwpOrigin=https%3A%2F%2Fmyworkplace-edu.bmwgroup.net&strongAuth=7000#/?programScenarioId=45912&productType=1');
  await page.pause();
});

//Test5 - Get Dimensions from PRMG
test('PRMGNewTab', async ({ page, context }) => {
  test.setTimeout(300000);
  const context1 = await context.newPage();
});