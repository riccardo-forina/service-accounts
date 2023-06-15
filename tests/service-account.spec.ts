import { test, expect, chromium } from '@playwright/test';

const username: string | undefined = process.env.TEST_USERNAME;
const password: string | undefined = process.env.TEST_PASSWORD;

if (username !== undefined && password !== undefined) {
  test('create service account', async () => {
    console.log(username)
    console.log(password)
    const browser = await chromium.launch();
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();
    await page.goto('https://stage.foo.redhat.com:1337/iam/service-accounts');
    await page.locator('#username-verification').fill(username);
    await page.locator('button', { hasText: 'Next' }).click();
    await page.locator('#password').fill(password);
    await page.click('#rh-password-verification-submit-button');
    await page.waitForSelector('[role=progressbar]', { timeout: 10000});
    await expect(page.locator('h1', { hasText: 'Service Accounts' })).toHaveCount(1);
    await page.getByText('Create service account').click();
    await page.locator('input[name="text-input-short-description"]').fill("test-service-account");
    await page.locator('button:text("Create")').click();
    await expect(page.getByText('Credentials successfully generated')).toHaveCount(1);

    await expect(page.locator('a', { hasText: 'Close' })).toBeDisabled();

    await page.locator('input[name="check1"]').check();

    await expect(page.locator('a', { hasText: 'Close' })).toBeEnabled();
    await page.locator('a', { hasText: 'Close' }).click();
    const table = await page.locator('[aria-label="List of created service accounts"]');
    await expect(table.getByText("description")).toHaveCount(1); 
  });
}
