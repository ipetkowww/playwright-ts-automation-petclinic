import {expect, Locator, test} from "@playwright/test";

test('TC1: Validate selected specialities', async ({page}) => {
    await page.goto('/');

    // 1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    // 2. Add assertion of the "Veterinarians" text displayed above the table with the list of Veterinarians
    await expect(page.getByRole('heading')).toHaveText('Veterinarians');
    // 3. Select the veterinarian "Helen Leary" and click "Edit Vet" button
    await page.getByRole('row', { name: 'Helen Leary'}).getByRole('button', { name: 'Edit Vet' }).click();
    // 4. Add assertion of the "Specialties" field. The value "radiology" is displayed
    const selectedSpecialtiesDropDown: Locator = page.locator('.selected-specialties');
    await expect(selectedSpecialtiesDropDown).toHaveText('radiology');
    // 5. Click on the "Specialties" drop-down menu
    await selectedSpecialtiesDropDown.click();
    // 6. Add assertion that "radiology" specialty is checked
    const radiologyCheckbox: Locator = page.locator('#radiology');
    const surgeryCheckbox: Locator = page.locator('#surgery');
    const dentistryCheckbox: Locator = page.locator('#dentistry');

    await expect(radiologyCheckbox).toBeChecked();
    // 7. Add assertion that "surgery" and "dentistry" specialties are unchecked
    await expect(surgeryCheckbox).not.toBeChecked();
    await expect(dentistryCheckbox).not.toBeChecked();
    // 8. Check the "surgery" item specialty and uncheck the "radiology" item speciality
    await surgeryCheckbox.check();
    await radiologyCheckbox.uncheck();
    // 9. Add assertion of the "Specialties" field displayed value "surgery"
    await expect(selectedSpecialtiesDropDown).toHaveText('surgery');
    // 10. Check the "dentistry" item specialty
    await dentistryCheckbox.check();
    // 11. Add assertion of the "Specialties" field. The value "surgery, dentistry" is displayed
    await expect(selectedSpecialtiesDropDown).toHaveText('surgery, dentistry');
})

test('TC2: Select all specialties', async ({page}) => {
    await page.goto('/');

    // 1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    await expect(page.getByRole('heading')).toHaveText('Veterinarians');
    // 2. Select the veterinarian "Rafael Ortega" and click "Edit Vet" button
    await page.getByRole('row', { name: 'Rafael Ortega'}).getByRole('button', { name: 'Edit Vet' }).click();
    // 3. Add assertion that "Specialties" field is displayed value "surgery"
    const selectedSpecialtiesDropDown: Locator = page.locator('.selected-specialties');
    await expect(selectedSpecialtiesDropDown).toHaveText('surgery');
    // 4. Click on the "Specialties" drop-down menu
    await selectedSpecialtiesDropDown.click();
    // 5. Check all specialties from the list
    const allCheckboxes: Locator[] = await page.getByRole('checkbox').all();
    for (const checkbox of allCheckboxes) {
        await checkbox.check();
    }
    // 6. Add assertion that all specialties are checked
    for (const checkbox of allCheckboxes) {
        await expect(checkbox).toBeChecked();
    }
    // 7. Add assertion that all checked specialities are displayed in the "Specialties" field
    await expect(selectedSpecialtiesDropDown).toHaveText('surgery, radiology, dentistry');
})

test('TC3: Unselect all specialties', async ({page}) => {
    await page.goto('/');
    // 1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    await expect(page.getByRole('heading')).toHaveText('Veterinarians');
    // 2. Select the veterinarian "Linda Douglas" and click "Edit Vet" button
    await page.getByRole('row', { name: 'Linda Douglas'}).getByRole('button', { name: 'Edit Vet' }).click();
    // 3. Add assertion of the "Specialties" field displayed value "surgery, dentistry"
    const selectedSpecialtiesDropDown: Locator = page.locator('.selected-specialties');
    await expect(selectedSpecialtiesDropDown).toHaveText('dentistry, surgery');
    // 4. Click on the "Specialties" drop-down menu
    await selectedSpecialtiesDropDown.click();
    // 5. Uncheck all specialties from the list
    const allCheckboxes: Locator[] = await page.getByRole('checkbox').all();
    for (const checkbox of allCheckboxes) {
        await checkbox.uncheck();
    }
    // 6. Add assertion that all specialties are unchecked
    for (const checkbox of allCheckboxes) {
        await expect(checkbox).not.toBeChecked();
    }
    // 7. Add assertion that "Specialties" field is empty
    await expect(selectedSpecialtiesDropDown).toBeEmpty();
})