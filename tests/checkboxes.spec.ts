import {expect, Locator, test} from "@playwright/test";

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.getByRole('button', {name: 'Veterinarians'}).click();
    await page.getByRole('link', {name: 'All'}).click();
    await expect(page.getByRole('heading')).toHaveText('Veterinarians');
})

test('TC1: Validate selected specialities', async ({page}) => {
    await page.getByRole('row', {name: 'Helen Leary'}).getByRole('button', {name: 'Edit Vet'}).click();

    const selectedSpecialtiesDropDown: Locator = page.locator('.selected-specialties');
    await expect(selectedSpecialtiesDropDown).toHaveText('radiology');
    await selectedSpecialtiesDropDown.click();

    const radiologyCheckbox: Locator = page.getByRole('checkbox', {name: 'radiology'});
    const surgeryCheckbox: Locator = page.getByRole('checkbox', {name: 'surgery'});
    const dentistryCheckbox: Locator = page.getByRole('checkbox', {name: 'dentistry'});
    await expect(radiologyCheckbox).toBeChecked();
    await expect(surgeryCheckbox).not.toBeChecked();
    await expect(dentistryCheckbox).not.toBeChecked();

    await surgeryCheckbox.check();
    await radiologyCheckbox.uncheck();
    await expect(selectedSpecialtiesDropDown).toHaveText('surgery');

    await dentistryCheckbox.check();
    await expect(selectedSpecialtiesDropDown).toHaveText('surgery, dentistry');
})

test('TC2: Select all specialties', async ({page}) => {
    await page.getByRole('row', {name: 'Rafael Ortega'}).getByRole('button', {name: 'Edit Vet'}).click();
    const selectedSpecialtiesDropDown: Locator = page.locator('.selected-specialties');
    await expect(selectedSpecialtiesDropDown).toHaveText('surgery');

    await selectedSpecialtiesDropDown.click();
    const allCheckboxes: Locator[] = await page.getByRole('checkbox').all();
    for (const checkbox of allCheckboxes) {
        await checkbox.check();
        await expect(checkbox).toBeChecked();
    }

    await expect(selectedSpecialtiesDropDown).toHaveText('surgery, radiology, dentistry');
})

test('TC3: Unselect all specialties', async ({page}) => {
    await page.getByRole('row', {name: 'Linda Douglas'}).getByRole('button', {name: 'Edit Vet'}).click();

    const selectedSpecialtiesDropDown: Locator = page.locator('.selected-specialties');
    await expect(selectedSpecialtiesDropDown).toHaveText('dentistry, surgery');

    await selectedSpecialtiesDropDown.click();
    const allCheckboxes: Locator[] = await page.getByRole('checkbox').all();
    for (const checkbox of allCheckboxes) {
        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
    }

    await expect(selectedSpecialtiesDropDown).toBeEmpty();
})