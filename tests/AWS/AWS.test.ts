import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// const fs = require('fs');
// const path = require('path');

//Test1
test('Test', async ({ page }) => {
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

});