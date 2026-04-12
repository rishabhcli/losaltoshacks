import asyncio
from browser_use import BrowserSession
from browser_use.browser.browser import Browser

async def main():
    session = BrowserSession(
        is_local=True,
        headless=True,
        executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    )
    print("Browser config:", session)
    try:
        # Instead of directly using session, we can just print it
        print("OK")
    except Exception as e:
        print("Error:", e)

asyncio.run(main())
