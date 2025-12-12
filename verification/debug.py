
import asyncio
from playwright.async_api import async_playwright

async def debug_page():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            print("Navigating...")
            await page.goto("http://localhost:5173", timeout=30000)
            await page.wait_for_load_state('domcontentloaded')
            print("Page loaded. taking screenshot...")
            await page.screenshot(path="verification/debug_landing.png")

            # Print body text to see if there's an error
            content = await page.content()
            print("Page title:", await page.title())
            if "Error" in content:
                print("Found 'Error' in page content!")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="verification/debug_error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(debug_page())
