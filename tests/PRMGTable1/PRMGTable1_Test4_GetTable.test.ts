import { test, expect } from '@playwright/test';

//Test1
test('T1', async ({ page }) => {
  test.setTimeout(30000);
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
    
  await page.goto('https://myworkplace-edu.bmwgroup.net/iwp/#/dashboard/proflex');
  await page.waitForTimeout(1000);
  await page.locator('[id="idToken4_2"]').click();
  await page.waitForTimeout(1000);
  await page.locator('[id="idToken2"]').fill('Q516590');
  //await page.locator('[id="idToken2"]').fill('QDCDDC1');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.locator('[id="idToken1"]').fill('9423');
  // await page.locator('[id="idToken1"]').fill('5201');
  //await page.waitForTimeout(1000);
  // await page.locator('[id="idToken2"]').fill(yubiKeyCode);
  // console.log("YubiKey-Code was:\t", yubiKeyCode);
  // await page.keyboard.press('Enter');
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

  let matrix2024: string [] = [];
  let matrix2024E : string [] = [];

  let percent : number = 0;

  for(let i1=0; i1<inputValueRowCount; i1++){
    for (let i2 = 0; i2 < targetDates.length; i2++) {
      percent = ((((i1*targetDates.length+1) + (i2+1) - 1)) / (targetDates.length*inputValueRowCount)) * 100;
      let target = "//div[@row-id=" + "\"" + i1 + "\"" + "]//div[@col-id=\"" + targetDates[i2] + "\"]";
      try {
      (await newPage.waitForSelector(`${target}`, {timeout: 5000})).scrollIntoViewIfNeeded();
      let dynamicLocator = await newPage.locator(`${target}`);
      await dynamicLocator.waitFor({ timeout: 100 });
      if (await dynamicLocator.isVisible()) {
          let textContent = (await dynamicLocator.textContent()) || '[NO DATA]';
          (matrix2024.push(targetDates[i2] + ":" + i1 + ": " + textContent), {timeout: 100});
      }
      } catch (error) {
      //console.error(`comp-id=${i} nicht gefunden!`);
      (matrix2024E.push(targetDates[i2] + ":" + i1), {timeout: 100});
      }
    }
    console.log("Test running ... " + percent.toFixed(2) + "%");
  }

  console.log(matrix2024.join("\t\t"));
  console.log("Anzahl gefundene Elemente:\t" + matrix2024.length);
  console.log(matrix2024E.join("\t\t"));
  console.log("Anzahl nicht gefundene Elemente:\t" + matrix2024E.length);
});