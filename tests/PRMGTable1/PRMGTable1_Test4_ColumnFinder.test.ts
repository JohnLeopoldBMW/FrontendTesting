import { test, expect } from '@playwright/test';

//Test1
test('T1', async ({ page }) => {
  test.setTimeout(2000);

  var propertiesReader = require('properties-reader');
    var properties = propertiesReader('C:\\Users\\Q516590\\Desktop\\YubikeyCreation\\src\\resources\\hotp.properties');

    let yubiKeyCode : string = "" + properties.get('hotpCode');
    console.log("YubiKey-Code:\t", yubiKeyCode);

    if(yubiKeyCode.length<6){
        yubiKeyCode = "0" + yubiKeyCode
        console.log("YubiKey-Code corrected:\t" , yubiKeyCode)
    }
    
    await page.goto('https://myworkplace-edu.bmwgroup.net/iwp/#/dashboard/proflex');
    await page.waitForTimeout(1000);
    await page.locator('[id="idToken4_2"]').click();
    await page.waitForTimeout(1000);
    await page.locator('[id="idToken2"]').fill('QDCDDC1');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.locator('[id="idToken1"]').fill('5201');
    await page.waitForTimeout(1000);
    await page.locator('[id="idToken2"]').fill(yubiKeyCode);
    console.log("YubiKey-Code was:\t", yubiKeyCode);
    await page.keyboard.press('Enter');
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

  // const years : string [] = ["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"]
  const years : string [] = ["2023", "2024", "2025", "2026"]
  const months : string [] = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
  const numberY : number = years.length
  const numberM : number = months.length
  let dates : string [] = []
  let percent : number = 0

  for(let y=0; y<years.length; y++){
    for(let m=0; m<months.length; m++){
      percent = ((((y*numberM+1) + (m+1) - 1)) / (numberY*numberM)) * 100;
      //div[@aria-rowindex="1"]//div[@col-id="2024-01"]
      let target = "//div[@aria-rowindex=" + "\"" + "1" + "\"" + "]//div[@col-id=" + "\"" + years[y] + "-" + months[m] + "\"" + "]";
      try {
      (await newPage.waitForSelector(`${target}`, {timeout: 500})).scrollIntoViewIfNeeded();
      let dynamicLocator = await newPage.locator(`${target}`);
      await dynamicLocator.waitFor({ timeout: 100 });
      if (await dynamicLocator.isVisible()) {
          (dates.push(years[y] + "-" + months[m]), {timeout: 100});
      }
      } catch (error) {
      //console.error(`comp-id=${i} nicht gefunden!`);
      }
      console.log("Test running ... " + percent.toFixed(2) + "%");
    }
  }

  const fs = require('fs');
  let jsonFilePath = 'C:\\01_FG-790\\FrontendTesting\\tests\\outputColumnCount.json';

  async function writeToJSONFile(outputValue) {
    const jsonData = {
      output: outputValue
    };
    await fs.promises.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2));
    }
    await writeToJSONFile(dates.length);

    jsonFilePath = 'C:\\01_FG-790\\FrontendTesting\\tests\\outputColumnContent.json';
    await writeToJSONFile(dates.join(", "));
});