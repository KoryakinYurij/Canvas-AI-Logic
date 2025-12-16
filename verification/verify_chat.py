
import asyncio
from playwright.async_api import async_playwright, expect

async def verify_chat_logic():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # 1. Navigate to the app
        print("Navigating...")
        await page.goto("http://localhost:5173", timeout=60000)
        await page.wait_for_load_state('networkidle')

        # 2. Generate Initial Graph (Required to see Chat Sidebar)
        print("Generating initial graph...")
        # The initial input placeholder is "e.g., A sales funnel for a SaaS product..."
        await page.get_by_placeholder("e.g., A sales funnel for a SaaS product...").fill("Sales Funnel")

        # FIX: Click the submit button instead of pressing Enter (since it's a textarea)
        # The button contains a Sparkles icon, but easiest to find by type="submit" or role="button"
        await page.get_by_role("button").click()

        # Wait for the graph to appear (or the input to disappear/move)
        # We can wait for the 'Open Chat' button to become visible
        print("Waiting for graph generation...")
        chat_button = page.get_by_label("Open Chat")
        await expect(chat_button).to_be_visible(timeout=30000)

        # 3. Open Chat Sidebar
        print("Opening chat...")
        await chat_button.click()

        # 4. Test "Chat" intent (should not update graph)
        print("Testing Chat intent...")
        await page.get_by_placeholder("Type your request...").fill("Hi, this is a chat test")
        await page.keyboard.press("Enter")

        # Wait for response.
        await expect(page.get_by_text("I am a mock AI")).to_be_visible(timeout=10000)

        # Take screenshot of chat
        await page.screenshot(path="verification/chat_intent.png")
        print("Chat intent verified. Screenshot saved.")

        # 5. Test "Refine" intent (should update graph)
        print("Testing Refine intent...")
        await page.get_by_placeholder("Type your request...").fill("add a node called Verification")
        await page.keyboard.press("Enter")

        # Wait for the "updated" message
        await expect(page.get_by_text("I have updated the graph based on your mock request.")).to_be_visible(timeout=10000)

        await page.screenshot(path="verification/refine_intent.png")
        print("Refine intent verified. Screenshot saved.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_chat_logic())
