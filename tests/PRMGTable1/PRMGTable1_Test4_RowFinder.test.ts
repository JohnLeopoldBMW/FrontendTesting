import { test, expect } from '@playwright/test';
//const path = 'C:\\01_FG-790\FrontendTesting\\Playwright\\tests\\PRMGTable1';
const fs = require('fs');
const path = require('path');

//Test1
test('T1', async ({ page }) => {
    test.setTimeout(30000);

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

    let rowNumbersA : string [] = []
    let rowNumbersAErr : string [] = []
    let percent : number = 0
    const maxRows : number = 150;

    //await newPage.waitForTimeout(10000);

    const response = await newPage.waitForResponse(
        (response) => {
          return (
            response.url().includes('volumes-by-planning-view-state') &&
            response.request().method() === 'POST'
          );
        }
      );
   
    for(let i=0; i<maxRows; i++){
        percent = ((i+1) / maxRows) * 100;
        let target = "//div[@row-id=\"" + i + "\"]//button[@id=\"showMenuButton\"]";
        try {
        (await newPage.waitForSelector(`${target}`, {timeout: 500})).scrollIntoViewIfNeeded();
        let dynamicLocator = await newPage.locator(`${target}`);
        await dynamicLocator.waitFor({ timeout: 500 });
        if (await dynamicLocator.isVisible()) {
            rowNumbersA.push("" + i);
        }
        } catch (error) {
        //console.error(`comp-id=${i} nicht gefunden!`);
        rowNumbersAErr.push("" + i);
        }
        console.log("Test running ... " + percent.toFixed(2) + "%");
    }

    const fs = require('fs');
    let jsonFilePath = 'C:\\01_FG-790\\FrontendTesting\\tests\\outputRowCount.json';

    async function writeToJSONFile(outputValue) {
      const jsonData = {
        output: outputValue
      };
    await fs.promises.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2));
    }
    await writeToJSONFile(rowNumbersA.length);

    jsonFilePath = 'C:\\01_FG-790\\FrontendTesting\\tests\\outputRowContent.json';
    await writeToJSONFile(rowNumbersA.join(", "));

    // console.log("Found\nAmount: " + rowNumbersA.length);
    // console.log(rowNumbersA.join("\t"));
    // console.log("Not found\nAmountn: " + rowNumbersAErr.length);
    // console.log(rowNumbersAErr.join("\t"));
});