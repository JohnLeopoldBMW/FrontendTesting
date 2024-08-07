import { test, expect } from '@playwright/test';

//PRMG numbers displayed
test('PRMGTable1', async ({ page }) => {
    test.setTimeout(2000);

    await page.goto('https://myworkplace-edu.bmwgroup.net/iwp/#/dashboard/proflex');
    await page.setDefaultTimeout(5000);
    await page.locator('[id="idToken4_2"]').click();
    await page.setDefaultTimeout(5000);
    await page.locator('[id="idToken2"]').fill('q516590');
    await page.setDefaultTimeout(5000);
    await page.keyboard.press('Enter');
    await page.setDefaultTimeout(5000);
    await page.locator('[id="idToken1"]').fill('9423');
    await page.setDefaultTimeout(5000);
    //manuell auf Yubikey drücken
    await page.pause();
    await page.getByText(' Volumes (PRMG)').click()
    const [newPage] = await Promise.all([
        await page.waitForEvent('popup')
    ])
    await newPage.waitForLoadState();
    //await newPage.waitForTimeout(5000);
    await newPage.locator('[id="showVolumes"]').click();
    // await page.pause();

    let matrixText: string[] = []
    let matrixCompIdNotFound: number[] = [];
    let matrixCompIdFound: number[] = [];
    let matrixDiff: number[] = []

    for (let i = 1; i < 300; i++) {
        const target = "[comp-id=" + "\"" + i + "\"" + "]";
        try {
        const dynamicLocator = await newPage.locator(`${target}`);
        await dynamicLocator.waitFor({ timeout: 50 });
        if (await dynamicLocator.isVisible()) {
            const textContent = (await dynamicLocator.textContent()) || '[NO DATA]';
            matrixText.push(textContent);
            matrixCompIdFound.push(i);
        } else {
            //console.error(`comp-id=${i} ist nicht sichtbar!`);
        }
        } catch (error) {
        //console.error(`comp-id=${i} nicht gefunden!`);
        matrixCompIdNotFound.push(i);
        }
    }

    const matrixCompIdRequire = [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 
        109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 
        151, 152, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 188, 189, 190, 191, 192, 193, 194, 
        195, 196, 197, 198, 199, 200, 201, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216]

    for (let i = 0; i < matrixCompIdRequire.length; i++) {
        if (!matrixCompIdFound.includes(matrixCompIdRequire[i])) {
        matrixDiff.push(matrixCompIdRequire[i]);
        }
    }
    
    for (let i = 0; i < matrixCompIdFound.length; i++) {
        if (!matrixCompIdRequire.includes(matrixCompIdFound[i])) {
        matrixDiff.push(matrixCompIdFound[i]);
        }
    }

    for (let i=0; i<300; i++){
      console.log(matrixText[i])
    }

    console.log("Gefundene comp-ids:\n" + matrixCompIdFound.join("\t"));
    console.log("Nicht gefundene comp-ids:\n" + matrixCompIdNotFound.join("\t"));

    if(matrixDiff.length != 0){
        if(matrixCompIdRequire.length == matrixCompIdFound.length){
        throw new Error("Die Anzeige von PRMG ist leider nicht richtig. Böses FG-790 Team!\n--> Comp-IDs nicht erwartet.\nDifferences:\t" + matrixDiff.join("\t"));
        }
        else if (matrixCompIdRequire.length > matrixCompIdFound.length ){
        throw new Error("Die Anzeige von PRMG ist leider nicht richtig. Böses FG-790 Team!\n--> Zu wenige Comp-IDs werden angezeigt.\nDifferences:\t" + matrixDiff.join("\t"));
        }
        else if (matrixCompIdRequire.length < matrixCompIdFound.length){
        throw new Error("Die Anzeige von PRMG ist leider nicht richtig. Böses FG-790 Team!\n--> Zu viele Comp-IDs werden angezeigt.\nDifferences:\t" + matrixDiff.join("\t"));
        }
    }
});