from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Open French index page
        page.goto('file:///app/fr/index.html')
        page.screenshot(path='verification/fr_index.png')
        print('Screenshot saved to verification/fr_index.png')

        # Check title
        print(f'Title: {page.title()}')

        # Check language switcher
        flag = page.locator('#current-flag').text_content()
        print(f'Current Flag: {flag}')

        # Check a navigation link
        about_link = page.locator('a[href="./about.html"]').first
        print(f'About Link Href: {about_link.get_attribute("href")}')

        browser.close()

if __name__ == '__main__':
    run()
