from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_chat_interface(page: Page):
    # 1. Go to the app
    page.goto("http://localhost:5173")

    # 2. Generate a graph to enable the chat sidebar
    # Find the textarea and button
    textarea = page.get_by_placeholder("e.g., A sales funnel for a SaaS product...")
    generate_button = page.get_by_role("button", name="Generate Graph")

    expect(textarea).to_be_visible()
    textarea.fill("Test Graph")
    generate_button.click()

    # Wait for generation (MockAIConnector has 1500ms delay)
    # We wait for the canvas to appear or the button to disappear
    expect(generate_button).not_to_be_visible(timeout=5000)

    # 3. Open the Chat Sidebar
    # The button has aria-label "Open Chat"
    chat_button = page.get_by_label("Open Chat")
    expect(chat_button).to_be_visible()
    chat_button.click()

    # 4. Verify Sidebar is open
    sidebar_title = page.get_by_text("AI Assistant")
    expect(sidebar_title).to_be_visible()

    # 5. Type a message
    input_field = page.get_by_placeholder("Type your request...")
    expect(input_field).to_be_visible()
    input_field.fill("Add a new node")

    # 6. Send message
    # Button with Send icon, usually best to use get_by_role button
    # Since there are multiple buttons, we can narrow it down or use the one in the sidebar
    send_button = page.locator("button:has(svg.lucide-send)")
    # Alternatively, check if button is enabled
    expect(send_button).to_be_enabled()
    send_button.click()

    # 7. Verify message appears
    user_message = page.get_by_text("Add a new node")
    expect(user_message).to_be_visible()

    # Wait for response (MockAIConnector has 1000ms delay)
    response_message = page.get_by_text("I have updated the graph based on your request.")
    expect(response_message).to_be_visible(timeout=5000)

    # 8. Take screenshot
    page.screenshot(path="verification/chat_interface.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_chat_interface(page)
        finally:
            browser.close()
