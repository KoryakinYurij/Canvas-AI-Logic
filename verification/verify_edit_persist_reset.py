from playwright.sync_api import Page, expect, sync_playwright

def verify_editing_and_persistence(page: Page):
    # 1. Go to app
    page.goto("http://localhost:5173")

    # 2. Handle State
    # If we see the chat button, it means we have a graph. We should clear it to start fresh.
    chat_button = page.get_by_label("Open Chat")
    if chat_button.is_visible():
        chat_button.click()
        # Handle confirm dialog
        page.once("dialog", lambda dialog: dialog.accept())
        page.get_by_title("Clear Canvas").click()
        # Wait for prompt input
        expect(page.get_by_placeholder("e.g., A sales funnel for a SaaS product...")).to_be_visible()

    # 3. Generate graph
    page.get_by_placeholder("e.g., A sales funnel for a SaaS product...").fill("Test Graph")
    page.get_by_role("button", name="Generate Graph").click()
    # Wait for generation
    expect(page.get_by_text("Lead Capture")).to_be_visible(timeout=15000)

    # 4. Verify double click to edit
    # Wait explicitly for the node to be stable
    node = page.get_by_text("Lead Capture").first
    expect(node).to_be_visible()

    # Force a click first to ensure focus/layout
    node.click()
    page.wait_for_timeout(500)
    node.dblclick(force=True)

    # 5. Edit title
    # Input should appear with value "Lead Capture"
    input_field = page.locator("input[value='Lead Capture']")
    expect(input_field).to_be_visible()
    input_field.fill("Edited Node Title")

    # 6. Save (Enter + Meta or clicking Save button)
    save_button = page.get_by_role("button", name="Save")
    save_button.click()

    # 7. Verify update
    expect(page.get_by_text("Edited Node Title")).to_be_visible()
    expect(page.get_by_text("Lead Capture")).not_to_be_visible()

    # 8. Verify persistence (Reload)
    page.reload()

    # 9. Check if "Edited Node Title" is still there
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
