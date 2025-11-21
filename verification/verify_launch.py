from playwright.sync_api import Page, expect, sync_playwright

def verify_app_launch(page: Page):
    # 1. Go to app
    page.goto("http://localhost:5173")

    # 2. Wait a bit
    page.wait_for_timeout(2000)

    # 3. Take screenshot
    page.screenshot(path="verification/app_state.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_app_launch(page)
        finally:
            browser.close()
