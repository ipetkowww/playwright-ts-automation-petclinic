import {expect, Locator, test} from "@playwright/test";

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.getByRole('button', {name: 'Owners'}).click();
    await page.getByRole('link', {name: 'Search'}).click();

    await expect(page.locator('#ownersTable')).toBeVisible();
    await expect(page.getByRole('heading')).toHaveText('Owners');
})

test('TC1: Validate selected pet types from the list', async ({page}) => {
    await page.getByRole('row', {name: 'George Franklin'}).locator('.ownerFullName > a').click();
    await expect(page.locator('.ownerFullName')).toHaveText('George Franklin');

    await page.locator('app-pet-list', {hasText: 'Leo'}).getByRole('button', {name: 'Edit Pet'}).click();
    await expect(page.getByRole('heading')).toHaveText('Pet');
    await expect(page.locator('#owner_name')).toHaveValue('George Franklin');

    const petTypeField: Locator = page.locator("#type1");
    await expect(petTypeField).toHaveValue('cat');

    for (const petType of await page.locator("#type option").allTextContents()) {
        await page.locator('#type').selectOption(petType)
        await expect(petTypeField).toHaveValue(petType);
    }
})

test('TC2: Validate the pet type update', async ({page}) => {
    await page.getByRole('row', {name: 'Eduardo Rodriquez'}).locator('.ownerFullName > a').click();
    await page.locator('app-pet-list', {hasText: 'Rosy'}).getByRole('button', {name: 'Edit Pet'}).click();
    await expect(page.locator('input#name')).toHaveValue('Rosy');

    const petTypeField: Locator = page.locator("#type1");
    const petTypeDropdown: Locator = page.locator('#type');
    await expect(petTypeField).toHaveValue('cat');
    await petTypeDropdown.selectOption('bird')

    await expect(petTypeField).toHaveValue('bird');
    await page.getByRole('button', {name: 'Update Pet'}).click();

    await expect(page.locator('app-pet-list', {hasText: 'Rosy'})
        .locator('dt:has-text("Type") + dd')).toHaveText('bird');

    await page.locator('app-pet-list', {hasText: 'Rosy'}).getByRole('button', {name: 'Edit Pet'}).click();
    await expect(page.locator('input#name')).toHaveValue('Rosy');
    await expect(petTypeField).toHaveValue('bird');
    await petTypeDropdown.selectOption('cat')
    await expect(petTypeField).toHaveValue('cat');
    await page.getByRole('button', {name: 'Update Pet'}).click();
    await expect(page.locator('app-pet-list', {hasText: 'Rosy'})
        .locator('dt:has-text("Type") + dd')).toHaveText('cat');
})