from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_export_and_fixes(page: Page):
    # 1. Go to app
    page.goto("http://localhost:5173")

    # 2. Wait for stable state
    page.wait_for_timeout(3000)

    # 3. Check for crash (app_root or similar should be visible)
    # The prompt input or canvas should be visible.
    # If `di.ts` crashed, we'd see nothing or an error overlay.
    try:
        expect(page.locator("#root")).to_be_visible()
    except:
        print("Root not visible - Application might have crashed")
        page.screenshot(path="verification/crash.png")
        raise

    # 4. Check for Export buttons
    # They are in the Chat Sidebar, so we need to generate/open chat first if not open.
    # If we are in "Generate" mode, we need to generate first.
    if page.get_by_role("button", name="Generate Graph").is_visible():
         page.get_by_placeholder("e.g., A sales funnel for a SaaS product...").fill("Test Graph")
         page.get_by_role("button", name="Generate Graph").click()
         page.wait_for_timeout(5000)

    # Open chat if not open
    chat_button = page.get_by_label("Open Chat")
    if chat_button.is_visible():
        chat_button.click()

    # Verify export buttons exist
    expect(page.get_by_title("Export JSON")).to_be_visible()
    expect(page.get_by_title("Export PNG")).to_be_visible()

    page.screenshot(path="verification/export_and_fix.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_export_and_fixes(page)
        finally:
            browser.close()
