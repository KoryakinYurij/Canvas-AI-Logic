import { test, expect } from '@playwright/test';

test.describe('Core User Flow', () => {
  test('User can generate a graph, verify nodes, and see export options', async ({ page }) => {
    // 1. Load the application
    await page.goto('/');

    // 2. Verify initial state (Prompt Input)
    await expect(page.getByText('What do you want to map?')).toBeVisible();
    const input = page.getByPlaceholder('e.g., A sales funnel for a SaaS product...');
    await expect(input).toBeVisible();

    // 3. Enter prompt and generate
    await input.fill('Test Graph Generation');
    const generateBtn = page.getByRole('button', { name: 'Generate Graph' });
    await expect(generateBtn).toBeEnabled();
    await generateBtn.click();

    // 4. Wait for graph generation (Mock connector is fast, but we wait for UI)
    // The loading state might appear briefly
    // We expect nodes to appear. VisualNodeCard has role="button" and aria-label starting with "Node:"
    // We wait for at least one node.
    const node = page.getByRole('button', { name: /Node:/ }).first();
    await expect(node).toBeVisible({ timeout: 10000 });

    // 5. Check accessibility of a node
    await expect(node).toHaveAttribute('tabindex', '0');

    // 6. Open Chat Sidebar
    const chatBtn = page.getByLabel('Open Chat');
    await expect(chatBtn).toBeVisible();
    await chatBtn.click();

    // 7. Verify Sidebar Content & Export Options
    await expect(page.getByText('AI Assistant')).toBeVisible();

    // Check Export Buttons
    const jsonBtn = page.getByTitle('Export JSON');
    await expect(jsonBtn).toBeVisible();

    const pngBtn = page.getByTitle('Export PNG');
    await expect(pngBtn).toBeVisible();

    // 8. Verify Clear Canvas
    const clearBtn = page.getByTitle('Clear Canvas');
    await expect(clearBtn).toBeVisible();
  });
});
