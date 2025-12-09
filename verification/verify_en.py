from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Open English index page
        page.goto('file:///app/index.html')
        page.screenshot(path='verification/en_index.png')

        # Check language switcher dropdown for French option
        page.locator('#current-flag').click()
        fr_option = page.locator('a[data-lang="fr"]')
        print(f'French Option Visible: {fr_option.is_visible()}')

        browser.close()

if __name__ == '__main__':
    run()
