import {expect, Locator, test} from "@playwright/test";

let heading: Locator;

test.beforeEach(async ({page}) => {
    await page.goto('https://petclinic.bondaracademy.com/');
    // 1. Select the PET TYPES menu item in the navigation bar
    await page.getByRole('link', {name: 'Pet Types'}).click();
    // 2. Add assertion of the "Pet Types" text displayed above the table with the list of pet types
    heading = page.getByRole('heading');
    await expect(heading).toHaveText('Pet Types');
});


test('TC1: Update pet type', async ({page}) => {
    const rabbit: string = 'rabbit';
    const cat: string = 'cat';

    // 3. Click on "Edit" button for the "cat" pet type
    let firstPetTypeRow: Locator = page.locator('tbody tr').first();
    let editButton: Locator = firstPetTypeRow.getByRole('button', {name: 'Edit'});
    await editButton.click();
    // 4. Add assertion of the "Edit Pet Type" text displayed
    await expect(heading).toHaveText('Edit Pet Type');
    // 5. Change the pet type name from "cat" to "rabbit" and click "Update" button
    let nameField: Locator = page.getByRole('textbox');
    await expect(nameField).toHaveValue(cat);
    let updateButton: Locator = page.getByRole('button', {name: "Update"});
    await nameField.clear();
    await nameField.fill(rabbit)
    await updateButton.click();
    // 6. Add the assertion that the first pet type in the list of types has a value "rabbit"
    await expect(firstPetTypeRow.getByRole('textbox')).toHaveValue(rabbit);
    // 7. Click on "Edit" button for the same "rabbit" pet type
    await firstPetTypeRow.getByRole('button', {name: 'Edit'}).click();
    // 8. Change the pet type name back from "rabbit" to "cat" and click "Update" button
    await expect(nameField).toHaveValue(rabbit);
    await nameField.clear();
    await nameField.fill(cat)
    await updateButton.click();
    // 9. Add the assertion that the first pet type in the list of names has a value "cat"
    await expect(firstPetTypeRow.getByRole('textbox')).toHaveValue(cat);
})

test('TC2: Cancel pet type update', async ({page}) => {
    const dog: string = 'dog';
    const moose: string = 'moose';

    // 3. Click on "Edit" button for the "dog" pet type
    let dogRow: Locator = page.getByRole('row', {name: dog});
    await dogRow.getByRole('button', {name: 'Edit'}).click();
    // 4. Type the new pet type name "moose"
    let nameField: Locator = page.getByRole('textbox');
    await expect(nameField).toHaveValue(dog)
    await nameField.clear();
    await nameField.fill(moose)
    // 5. Add assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page
    await expect(nameField).toHaveValue(moose)
    // 6. Click on "Cancel" button
    await page.getByRole('button', {name: "Cancel"}).click();
    // 7. Add the assertion the value "dog" is still displayed in the list of pet types
    await expect(dogRow.getByRole('textbox')).toHaveValue(dog);
})

test('Validation of Pet type name is required', async ({page}) => {
    const lizard: string = 'lizard';

    // 3. Click on "Edit" button for the "lizard" pet type
    let lizardRow: Locator = page.getByRole('row', {name: lizard});
    await lizardRow.getByRole('button', {name: 'Edit'}).click();
    // 4. On the Edit Pet Type page, clear the input field
    let pageUrl: string = page.url();
    let nameField: Locator = page.getByRole('textbox');
    await expect(nameField).toHaveValue(lizard)
    await nameField.clear();
    // 5. Add the assertion for the "Name is required" message below the input field
    await expect(page.getByText('Name is required')).toBeVisible();
    // 6. Click on "Update" button
    await page.getByRole('button', {name: 'Update'}).click();
    let pageUrlAfterUpdate: string = page.url();
    // 7. Add assertion that "Edit Pet Type" page is still displayed
    await expect(page.getByRole('heading')).toHaveText('Edit Pet Type');
    expect(pageUrlAfterUpdate).toEqual(pageUrl);
    // 8. Click on the "Cancel" button
    await page.getByRole('button', {name: 'Cancel'}).click();
    // 9. Add assertion that "Pet Types" page is displayed
    await expect(page.getByRole('heading')).toHaveText('Pet Types');
    expect(page.url()).toContain('/pettypes');
})