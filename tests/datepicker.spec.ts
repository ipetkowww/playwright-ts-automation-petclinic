import {expect, Locator, test} from "@playwright/test";

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.getByRole('button', {name: 'Owners'}).click();
    await page.getByRole('link', {name: 'Search'}).click();
})

test('TC1: Select the desired date in the calendar', async ({page}) => {
    await page.getByRole('link', {name: 'Harold Davis'}).click();
    await page.getByRole('button', {name: 'Add New Pet'}).click();

    await expect(page.locator('#name')).toContainClass('ng-invalid');
    await page.locator('#name').fill('Tom');
    await expect(page.locator('#name')).toContainClass('ng-valid');

    await page.locator('mat-datepicker-toggle button').click();

    const date = new Date(2014, 4, 2);
    const year: string = date.getFullYear().toString();
    const month: string = date.toLocaleString('en-US', {month: 'short'}).toUpperCase()
    const day: string = date.getDate().toString();

    const calendar: Locator = page.locator('mat-calendar');
    await calendar.locator('.mat-calendar-period-button').click();
    await calendar.locator('.mat-calendar-previous-button').click();
    await calendar.getByText(year, {exact: true}).click();
    await calendar.getByText(month, {exact: true}).click();
    await calendar.getByText(day, {exact: true}).click();

    const expectedYear = date.getFullYear();
    const expectedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const expectedDay = String(date.getDate()).padStart(2, '0');
    await expect(page.locator('.mat-datepicker-input')).toHaveValue(`${expectedYear}/${expectedMonth}/${expectedDay}`);

    await page.locator('#type').selectOption('dog');
    await page.getByRole('button', {name: 'Save Pet'}).click();

    const tomSection: Locator = page.locator('app-pet-list', {hasText: 'Tom'});
    await expect(tomSection.locator('dt:has-text("Birth Date") + dd'))
        .toHaveText(`${expectedYear}-${expectedMonth}-${expectedDay}`);

    await tomSection.getByRole('button', {name: 'Delete Pet'}).click();

    await page.waitForResponse(response => response.url().includes('/petclinic/api/pets/'));
    await expect(tomSection).not.toBeVisible();
})

test('TC2: Select the dates of visits and validate dates order', async ({page}) => {
    await page.goto('/');
    await page.getByRole('button', {name: 'Owners'}).click();
    await page.getByRole('link', {name: 'Search'}).click();

    await page.getByRole('link', {name: 'Jean Coleman'}).click();

    const samanthaSection: Locator = page.locator('app-pet-list', {hasText: 'Samantha'});
    await samanthaSection.getByRole('button', {name: 'Add Visit'}).click();

    await expect(page.getByRole('heading')).toHaveText('New Visit');
    await expect(page.locator('.table-striped').locator('td').first()).toHaveText('Samantha');
    await expect(page.locator('.table-striped').locator('td').last()).toHaveText('Jean Coleman');

    const calendarIcon: Locator = page.locator('[aria-label="Open calendar"]');
    const descriptionField: Locator = page.locator('#description');
    const addVisitButton: Locator = page.getByRole('button', {name: 'Add Visit'});

    const today: Date = new Date();

    await calendarIcon.click();
    await page.getByText(today.getDate().toString(), {exact: true}).click();

    let expectedYear: number = today.getFullYear()
    let expectedMonth: string = String(today.getMonth() + 1).padStart(2, '0');
    let expectedDay: string = String(today.getDate()).padStart(2, '0');
    await expect(page.locator('.mat-datepicker-input')).toHaveValue(`${expectedYear}/${expectedMonth}/${expectedDay}`);

    await descriptionField.fill('dermatologists visit');
    await addVisitButton.click();
    await page.waitForResponse(response => response.url().includes('/api/owners/'));

    const samanthaVisits: Locator = samanthaSection.locator('app-visit-list table > tr');
    let samanthaLatestVisit: Locator = samanthaVisits.first().locator('td').first();

    expect(await samanthaLatestVisit.textContent()).toEqual(`${expectedYear}-${expectedMonth}-${expectedDay}`);

    await samanthaSection.getByRole('button', {name: 'Add Visit'}).click();
    await expect(page.getByRole('heading')).toHaveText('New Visit');

    const date: Date = new Date();
    date.setDate(today.getDay() - 45);
    const month: string = date.toLocaleString('en-US', {month: 'short'}).toUpperCase()

    await calendarIcon.click();
    while ((await page.locator('.mat-calendar-body-label').textContent()).trim() !== month) {
        await page.locator('.mat-calendar-previous-button').click();
    }
    await page.getByText(date.getDate().toString(), {exact: true}).click();

    await descriptionField.fill('massage therapy');
    await addVisitButton.click();
    await page.waitForResponse(response => response.url().includes('/api/owners/'));

    let dateOfLastAddedVisit = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const latestVisit: Date = new Date(await samanthaLatestVisit.textContent());
    const lastAddedVisit: Date = new Date(dateOfLastAddedVisit);

    expect(latestVisit.getTime() > lastAddedVisit.getTime()).toBeTruthy();

    const samanthaLatestVisitRow: Locator = samanthaSection.locator('app-visit-list').getByRole('row', {name: await samanthaLatestVisit.textContent()});
    const samanthaLatestAddedVisitRow: Locator = samanthaSection.locator('app-visit-list').getByRole('row', {name: dateOfLastAddedVisit});

    await samanthaLatestVisitRow.getByRole('button', {name: 'Delete Visit'}).click();
    await samanthaLatestAddedVisitRow.getByRole('button', {name: 'Delete Visit'}).click();
    await page.waitForResponse(response => response.url().includes('/api/visits/'));

    await expect(samanthaLatestVisitRow).not.toBeVisible();
    await expect(samanthaLatestAddedVisitRow).not.toBeVisible();
})
