import { test, expect } from '@playwright/test';

//Test1
test('Test', async ({ page }) => {
  test.setTimeout(2000);

  // await page.goto('https://myworkplace-edu.bmwgroup.net/iwp/#/dashboard/proflex');
  // await page.waitForTimeout(1000);
  // await page.locator('[id="idToken4_2"]').click();
  // await page.waitForTimeout(1000);
  // await page.locator('[id="idToken2"]').fill('q516590');
  // await page.waitForTimeout(1000);
  // await page.keyboard.press('Enter');
  // await page.waitForTimeout(1000);
  // await page.locator('[id="idToken1"]').fill('9423');
  // //manuell auf Yubikey drücken
  // await page.pause();
  // await page.waitForLoadState("networkidle");
  // await page.getByText(' Volumes (PRMG)').click();
  // await page.waitForLoadState();
  // const [newPage] = await Promise.all([
  //     await page.waitForEvent('popup')
  // ])
  // await newPage.waitForLoadState();
  // await newPage.locator('[id="showVolumes"]').click();
  // //await page.waitForTimeout(5000);
  // await newPage.waitForLoadState('networkidle');

  const fs = require('fs');

  var propertiesReader = require('properties-reader');
    var properties = propertiesReader('C:\\Users\\Q516590\\Desktop\\YubikeyCreation\\src\\resources\\hotp.properties');

    let yubiKeyCode : string = "" + properties.get('hotpCode');
    console.log("YubiKey-Code:\t", yubiKeyCode);

    if(yubiKeyCode.length<6){
        yubiKeyCode = "0" + yubiKeyCode
        console.log("YubiKey-Code corrected:\t" , yubiKeyCode)
    }

  async function readFromJSONFile() {
    try {
      const jsonData = await fs.promises.readFile(jsonFilePath, 'utf8');
      return JSON.parse(jsonData);
    } catch (error) {
      console.log('Error while trying to read JSON-file!');
      return null;
    }
  }
  let jsonFilePath = 'C:\\01_FG-790\\FrontendTesting\\tests\\outputRowCount.json';
  let jsonData = await readFromJSONFile();
  const inputValueRowCount = jsonData.output;
  console.log("Rows: " + inputValueRowCount);

  jsonFilePath = 'C:\\01_FG-790\\FrontendTesting\\tests\\outputColumnCount.json';
  jsonData = await readFromJSONFile();
  const inputValueColumnCount = jsonData.output;
  console.log("Columns: " + inputValueColumnCount);

  jsonFilePath = 'C:\\01_FG-790\\FrontendTesting\\tests\\outputColumnContent.json';
  jsonData = await readFromJSONFile();
  let inputValueColumnContent = jsonData.output;
  const targetDates : string [] = Array.from(inputValueColumnContent.split(", "));
  console.log("Dates: " + inputValueColumnContent);
});