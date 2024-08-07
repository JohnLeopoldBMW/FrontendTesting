//import { test, expect } from '@playwright/test';
const {test, expect} = require('@playwright/test')

//Test1 zu Anmeldung auf Demo-Seite
test('Anmeldescript', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page).toHaveScreenshot("C:/Desktop/image1.png");
});


//Test2 Suche von Mitarbeiter "Kai Hemmer" in BMW Contacts
test('BMWContacts', async ({ page }) => {
  await page.goto('https://contacts.bmwgroup.net/search');
  await page.locator('[id="idToken4_1"]').click();
  await page.locator('[id="surname"]').click();
  await page.locator('[id="surname"]').fill('Hemmer');
  await page.locator('[id="givenName"]').click();
  await page.locator('[id="givenName"]').fill('Kai');
  await page.keyboard.press('Enter');
  await expect(page).toHaveScreenshot("C:/Desktop/Kai.png");
});

//Test3 Vergleich von PRMG Daily Tablelle auf Confluence
const day = "05";
const month = "06";
const year = "2024";
const link1 = "https://atc.bmwgroup.net/confluence/display/PSVP/" + year + "." + month + "." + day + "+PLT+PRMG+Daily";
const link2 = "id-" + year + "." + month + "." + day + "PLTPRMGDaily-KeyIndicatorsCurrentSprint";

test('PRMGDaily', async ({ page }) => {
  await page.goto(link1);
  await page.locator('[class="sc-ifAKCX kqqTha"]').click();
  await page.locator('[id="idToken4_1"]').click();
  await page.locator('text=Team Performance').scrollIntoViewIfNeeded();
  await page.locator('text=Team Performance').scrollIntoViewIfNeeded();
  await page.pause();
  await expect(page).toHaveScreenshot("PRMG0506.png");
  await page.pause();
});


//Test4 Vergleich Tabelle auf eigener Confluence-Seite
test('OwnConfluence', async({page}) => {
  await page.goto('https://atc.bmwgroup.net/confluence/display/~q516590/John+Leopold+%28PE-301%29s+Startseite');
  await page.locator('[class="sc-ifAKCX kqqTha"]').click();
  await page.locator('[id="idToken4_1"]').click();
  await expect(page).toHaveScreenshot({ maxDiffPixels: 10000 });
  await page.pause();
});

/*
//Test5 Text von Snapshot
test('GetTextFromSnapshot', async({page}) => {
  await page.goto('https://atc.bmwgroup.net/confluence/display/~q516590/John+Leopold+%28PE-301%29s+Startseite');
  await page.locator('[class="sc-ifAKCX kqqTha"]').click();
  await page.locator('[id="idToken4_1"]').click();
  await test.step('Extract text from image', async () => {
    //await expect(page).toHaveScreenshot()
    await ConvertToText('GetTextFromSnapshot-1-chromium-win32.png')
    await page.pause();
  })
});
*/

//Test6 Text from content
test('GetTextFromContent', async({page}) => {

  test.setTimeout(300000);

  const matrixExpected = [["Date     ", "N1", "N2"], ["2024/06/05", 1, 2], ["2024/06/05", 3, 4], ["2024/06/05", 5, 6]];
  const matrixActual = [["Date     ", "N1", "N2"], ["2024/06/05", 0, 0], ["2024/06/05", 0, 0], ["2024/06/05", 0, 0]];
  const matrixErrors = ["Errors:"]

  //Output array "matrixExpected"
  for (let row of matrixExpected){
    const rowString = row.join('\t|\t');
    console.log(rowString);
  }

  //Access confluence page, read displayed numbers and save in array "matrixAcutal"
  await page.goto('https://atc.bmwgroup.net/confluence/display/~q516590/John+Leopold+%28PE-301%29s+Startseite');
  await page.locator('[class="sc-ifAKCX kqqTha"]').click();
  await page.locator('[id="idToken4_1"]').click();

  matrixActual[1][1] = await page.locator('[class="num11 confluenceTd"]').textContent();
  matrixActual[1][2] = await page.locator('[class="num12 confluenceTd"]').textContent();
  matrixActual[2][1] = await page.locator('[class="num21 confluenceTd"]').textContent();
  matrixActual[2][2] = await page.locator('[class="num22 confluenceTd"]').textContent();
  matrixActual[3][1] = await page.locator('[class="num31 confluenceTd"]').textContent();
  matrixActual[3][2] = await page.locator('[class="num32 confluenceTd"]').textContent();

  /*
  //IN PROGRESS ...
  //Read numbers from website and save them in array "matrixActual"
  for (let i1=1; i1<=3; i1++){
    for (let i2=1; i2<=2; i2++){
        const target = '[class="num' + i1 + i2 + ' confluenceTd"]';
        const targetString = "'" + target + "'";
        console.log(targetString);
        matrixActual[i1][i2] = await page.locator(targetString).textContent();
    }
  }
    */

  //Output array "matrixActual"
  for (let row of matrixActual){
    const rowString = row.join('\t|\t');
    console.log(rowString);
  }

  //Loop for comparison "matrixExpected" with "matrixActual" ans ouput error if not equal
  for (let i1=1; i1<=3; i1++){
    for (let i2=1; i2<=2; i2++){
        if (matrixExpected[i1][i2] != matrixActual[i1][i2]){
          console.log("Error!! Expected: " + matrixExpected[i1][i2] + " but was: " +  matrixActual[i1][i2] + " for VOLUME: num" + i1 + i2);
          matrixErrors.push("num" + i1 + i2)
          test.fail()
          //throw new Error("Error!! Expected: " + matrixExpected[i1][i2] + " but was: " +  matrixActual[i1][i2] + " for VOLUME: num" + i1 + i2)
        }
        /*
        //Optional ...
        //For output correctly displayed numbers on confluence site
        else{
          console.log("Number correct. \n Volume: num" + i1 + i2);
        }
        */
    }
  }
  //Output array "Errors"
  console.log(matrixErrors);
});