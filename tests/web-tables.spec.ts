import {expect, Locator, test} from "@playwright/test";

test.beforeEach(async ({page}) => {
    await page.goto('/');
})

test.describe('Tests related to Owners page', async () => {
    test.beforeEach(async ({page}) => {
        await page.getByRole('button', {name: 'Owners'}).click();
        await page.getByRole('link', {name: 'Search'}).click();
    })

    test('TC1: Validate the pet name city of the owner', async ({page}) => {
        const targetRow: Locator = page.getByRole('row', {name: 'Jeff Black'});
        await expect(targetRow.locator('td').nth(2)).toHaveText('Monona');
        await expect(targetRow.locator('td').nth(4)).toHaveText('Lucky');
    })

    test('TC2: Validate owners count of the Madison city', async ({page}) => {
        const targetRow: Locator = page.getByRole('row', {name: 'Madison'});
        const expectedCountOfOwnersFromMadison: number = 4;

        await expect(targetRow.first()).toBeVisible();
        expect(await targetRow.all()).toHaveLength(expectedCountOfOwnersFromMadison);
    })

    test('TC3: Validate search by Last Name', async ({page}) => {
        const table: Locator = page.getByRole('table');
        await expect(table).toBeVisible();
        const lastNameField: Locator = page.getByRole('textbox');
        const findOwnerButton: Locator = page.getByRole('button', {name: 'Find Owner'})

        await lastNameField.fill('Black');
        await findOwnerButton.click();
        await page.waitForResponse(response => response.url().includes('/api/owners?lastName'))
        const ownerLastName: string = (await table.getByRole('link').textContent()).split(' ')[1];
        expect(ownerLastName).toEqual('Black');

        await lastNameField.fill('Davis');
        await findOwnerButton.click();
        await page.waitForResponse(response => response.url().includes('/api/owners?lastName'))
        for (const ownerName of await table.getByRole('link').allTextContents()) {
            const ownerLastName: string = ownerName.split(' ')[1];
            expect(ownerLastName).toEqual('Davis');
        }

        await lastNameField.fill('Es');
        await findOwnerButton.click();
        await page.waitForResponse(response => response.url().includes('/api/owners?lastName'))
        for (const ownerName of await table.getByRole('link').allTextContents()) {
            const ownerLastName: string = ownerName.split(' ')[1];
            expect(ownerLastName).toContain('Es');
        }

        await lastNameField.fill('Playwright');
        await findOwnerButton.click();
        await page.waitForResponse(response => response.url().includes('/api/owners?lastName'))
        await expect(page.getByText('No owners with LastName starting with "Playwright"')).toBeVisible();
    })

    test('TC4: Validate phone number and pet name on the Owner Information Page', async ({page}) => {
        const targetRow: Locator = page.getByRole('row', {name: '6085552765'});
        const petName: string = await targetRow.locator('td').last().textContent();
        await targetRow.getByRole('link').click();

        await expect(page.getByRole('row', {name: 'Telephone'}).locator('td')).toHaveText('6085552765');
        await expect(page.locator('dt:has-text("Name") + dd')).toHaveText(petName);
    })

    test('TC5: Validate pets of the Madison city', async ({page}) => {
        await expect(page.getByRole('table')).toBeVisible();

        const expectedAnimalsInMadisonCity: string[] = ['Leo', 'George', 'Mulligan', 'Freddy'];

        const actualAnimalsInMadisonCity: string[] = (await page.getByRole('row', {name: 'Madison'})
            .locator('td:last-child')
            .allTextContents())
            .map(v => v.trim());

        expect(actualAnimalsInMadisonCity).toEqual(expectedAnimalsInMadisonCity);
    })
})

test('TC6: Validate specialty update', async ({page}) => {
    await page.getByRole('button', {name: 'Veterinarians'}).click();
    await page.getByRole('link', {name: 'All'}).click();

    const rafaelOrtegaSpecialty: Locator = page.getByRole('row', {name: 'Rafael Ortega'}).locator('td').nth(1)
    await expect(rafaelOrtegaSpecialty).toHaveText('surgery');

    await page.getByRole('link', {name: 'Specialties'}).click();
    await expect(page.getByRole('heading')).toHaveText('Specialties');

    await page.getByRole('row', {name: 'surgery'}).getByRole('button', {name: 'Edit'}).click()
    await expect(page.getByRole('heading')).toHaveText('Edit Specialty');
    await expect(page.getByRole('textbox')).not.toBeEmpty();

    await page.getByRole('textbox').fill('dermatology');
    await page.getByRole('button', {name: 'Update'}).click();
    await expect(page.getByRole('row', {name: 'surgery'})).not.toBeVisible();
    await expect(page.getByRole('row', {name: 'dermatology'})).toBeVisible();

    await page.getByRole('button', {name: 'Veterinarians'}).click();
    await page.getByRole('link', {name: 'All'}).click();
    await expect(rafaelOrtegaSpecialty).toHaveText('dermatology');

    await page.getByRole('link', {name: 'Specialties'}).click();
    await page.getByRole('row', {name: 'dermatology'}).getByRole('button', {name: 'Edit'}).click()
    await expect(page.getByRole('textbox')).not.toBeEmpty();
    await page.getByRole('textbox').fill('surgery');
    await page.getByRole('button', {name: 'Update'}).click();
    await expect(page.getByRole('row', {name: 'dermatology'})).not.toBeVisible();
    await expect(page.getByRole('row', {name: 'surgery'})).toBeVisible();
})

test('TC6: Validate specialty lists', async ({page}) => {
    await page.getByRole('link', {name: 'Specialties'}).click();

    await page.getByRole('button', {name: 'Add'}).click();
    await page.locator('#name').fill('oncology');
    await page.getByRole('button', {name: 'Save'}).click();
    await expect(page.getByRole('button', {name: 'Save'})).not.toBeVisible();


    // 3. Extract all values of specialties and put them into the array.
    const specialties = await Promise.all(
        (await page.getByRole('textbox').all()).map(e => e.inputValue())
    );

    // 4. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    await page.getByRole('button', {name: 'Veterinarians'}).click();
    await page.getByRole('link', {name: 'All'}).click();


    // 5. On the Veterinarians page, locate the "Sharon Jenkins" in the list and click "Edit" button
    await page.getByRole('row', {name: 'Sharon Jenkins'}).getByRole('button', {name: 'Edit Vet'}).click();
    // 6. Click on the Specialties drop-down menu. Extract all values from the drop-down menu to an array
    await page.locator('.dropdown-display').click();

    let s: string[] = await Promise.all(
        (await page.locator('.dropdown-content label').all()).map(e => e.textContent())
    );

    // 7. Add the assertion that the array of specialties collected in step 3 is equal the the array from drop-down menu
    expect(specialties).toEqual(s);
    // 8. Select the "oncology" specialty and click "Save vet" button
    await page.getByRole('checkbox', {name: 'oncology'}).check();
    await page.locator('.dropdown-display').click();
    await page.getByRole('button', {name: 'Save Vet'}).click();

    // 9. On the Veterinarians page, add assertion that "Sharon Jenkins" has a specialty "oncology"
    await expect(page.getByRole('row', {name: 'Sharon Jenkins'}).locator('td').nth(1)).toHaveText('oncology');
    // 10. Navigate to the SPECIALTIES page. Click "Delete" for "oncology" specialty
    await page.getByRole('link', {name: 'Specialties'}).click();
    await page.getByRole('row', {name: 'oncology'}).getByRole('button', {name: 'Delete'}).click();
    // 11. Navigate to the VETERINARIANS page. Add an assertion that "Sharon Jenkins" has no specialty assigned
    await page.getByRole('button', {name: 'Veterinarians'}).click();
    await page.getByRole('link', {name: 'All'}).click();
    await expect(page.getByRole('row', {name: 'Sharon Jenkins'}).locator('td').nth(1)).toBeEmpty();
})
