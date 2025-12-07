import os
from playwright.sync_api import sync_playwright, expect

def verify_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Absolute path to the file
        file_path = os.path.abspath("fr/b2b-lead-generation-paris.html")
        page.goto(f"file://{file_path}")

        # Check title
        expect(page).to_have_title("Agence de Génération de Leads B2B à Paris | Siège & Centre Corporatif | Expandia")

        # Check header
        expect(page.locator("h1")).to_contain_text("Génération de Leads B2B")
        expect(page.locator("h1")).to_contain_text("pour les Équipes Corporatives & Sièges Sociaux")

        # Check body text (Regex translation)
        expect(page.locator("body")).to_contain_text("Nous aidons les entreprises B2B basées à Paris")

        # Take screenshot
        output_dir = "verification"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        screenshot_path = f"{output_dir}/fr_paris_verification.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_page()
