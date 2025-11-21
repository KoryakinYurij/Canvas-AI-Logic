from playwright.sync_api import Page, expect, sync_playwright

def verify_editing_and_persistence(page: Page):
    # 1. Go to app
    page.goto("http://localhost:5173")

    # 2. Generate graph (if empty)
    # We need to clear storage first to be sure, but this script runs in a fresh browser context usually.

    # If we are already on the canvas (persistence from previous run), we might skip generation
    # But to be robust, let's check for the prompt input.

    if page.get_by_role("button", name="Generate Graph").is_visible():
        page.get_by_placeholder("e.g., A sales funnel for a SaaS product...").fill("Test Graph")
        page.get_by_role("button", name="Generate Graph").click()
        # Wait for generation
        expect(page.get_by_text("Lead Capture")).to_be_visible(timeout=10000)
    else:
        # If we are already on canvas, ensure we have the node we want
        if not page.get_by_text("Lead Capture").is_visible():
            # Try to reset or just fail?
            # If we are on canvas but Lead Capture is missing, maybe it was edited or deleted.
            # Let's try to proceed if we see ANY node, or fail.
            pass

    # 3. Verify double click to edit
    # Wait explicitly for the node to be stable
    node = page.get_by_text("Lead Capture").first
    expect(node).to_be_visible()

    # Force a click first to ensure focus/layout
    node.click()
    page.wait_for_timeout(500)
    node.dblclick(force=True)

    # 4. Edit title
    # Input should appear with value "Lead Capture"
    input_field = page.locator("input[value='Lead Capture']")
    expect(input_field).to_be_visible()
    input_field.fill("Edited Node Title")

    # 5. Save (Enter + Meta or clicking Save button)
    save_button = page.get_by_role("button", name="Save")
    save_button.click()

    # 6. Verify update
    expect(page.get_by_text("Edited Node Title")).to_be_visible()
    expect(page.get_by_text("Lead Capture")).not_to_be_visible()

    # 7. Verify persistence (Reload)
    page.reload()

    # 8. Check if "Edited Node Title" is still there
    expect(page.get_by_text("Edited Node Title")).to_be_visible(timeout=5000)

    page.screenshot(path="verification/editing_persistence.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_editing_and_persistence(page)
        finally:
            browser.close()
