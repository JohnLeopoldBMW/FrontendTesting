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

    //console.log(await (newPage.locator('[col-id="2024-01"]').and(newPage.locator('[comp-id="80"]'))).textContent());
    let matrixCol2024_01N: number [] = [];
    let matrixCol2024_01S: string [] = []

    const comIdCounter = 6000;

    for(let i=0; i<comIdCounter; i++){
        if(i % (comIdCounter*0.001) == 0){
            console.log(((i/comIdCounter)*100) + "%");
        }
        const target = "[comp-id=" + "\"" + i + "\"" + "]";
        try {
            const dynamicLocator = await (newPage.locator(`${target}`).and(newPage.locator('[col-id="2024-01"]')));
            await dynamicLocator.waitFor({ timeout: 200 });
            if (await dynamicLocator.isVisible()) {
                matrixCol2024_01N.push(i);
            } else {
                //console.error(`comp-id=${i} ist nicht sichtbar!`);
            }
        } catch (error) {
            //console.error(`comp-id=${i} nicht gefunden!`);
        }
    }

    for(let i=0; i<matrixCol2024_01N.length; i++){
        const target = "[comp-id=" + "\"" + matrixCol2024_01N[i] + "\"" + "]";
        try {
        const dynamicLocator = await newPage.locator(`${target}`);
        await dynamicLocator.waitFor({ timeout: 50 });
        if (await dynamicLocator.isVisible()) {
            const textContent = (await dynamicLocator.textContent()) || '[NO DATA]';
            matrixCol2024_01S.push(textContent);
        } else {
            //console.error(`comp-id=${i} ist nicht sichtbar!`);
        }
        } catch (error) {
        //console.error(`comp-id=${i} nicht gefunden!`);
        }
    }
    
    console.log("comp-IDs: " + matrixCol2024_01N.join("\t"));
    console.log("Länge comp-IDs: " + matrixCol2024_01N.length)
    console.log("text: " + matrixCol2024_01S.join("\t"));
    console.log("Länge Text: " + matrixCol2024_01S.length)
    if(matrixCol2024_01N.length == matrixCol2024_01S.length){
        console.log("Testfall positiv. Alle Objekte von 2024-01 gefunden.");
    }
    else{
        throw new Error("Nicht alle Objekte von 2024-01 werden angezeigt.");
    }
});