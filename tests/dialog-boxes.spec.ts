import {expect, Locator, test} from "@playwright/test";

test('TC1: Add and delete pet type', async ({page}) => {
    await page.goto('/');

    await page.getByRole('link', {name: 'Pet Types'}).click();
    await expect(page.getByRole('heading')).toHaveText('Pet Types');
    await page.getByRole('button', {name: 'Add'}).click();

    const newPetTypeSection: Locator = page.locator('app-pettype-add');
    await expect(newPetTypeSection.getByRole('heading')).toHaveText('New Pet Type');
    await expect(newPetTypeSection.locator('label', {hasText: 'Name'})).toBeVisible();
    await expect(newPetTypeSection.getByRole('textbox')).toBeVisible();

    await newPetTypeSection.getByRole('textbox').fill('pig');
    await newPetTypeSection.getByRole('button', {name: 'Save'}).click();
    await expect(newPetTypeSection).not.toBeVisible();

    const lastRowInPetTypesTable: Locator = page.getByRole('row').last();
    await expect(lastRowInPetTypesTable.getByRole('textbox')).toHaveValue('pig');
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Delete the pet type?');
        dialog.accept();
    })
    await lastRowInPetTypesTable.getByRole('button', {name: 'Delete'}).click();

    await expect(lastRowInPetTypesTable.getByRole('textbox')).not.toHaveValue('pig');
})