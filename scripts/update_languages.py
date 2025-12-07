import os
import re
import sys

def update_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        print(f"Skipping {filepath} due to encoding error")
        return

    original_content = content

    filename = os.path.basename(filepath)

    # 1. Update Hreflang Tags
    # We want to add hreflang="fr" to all HTML pages

    # Construct the URL suffix
    if filename == 'index.html':
            suffix = '/'
    else:
            suffix = '/' + filename

    fr_tag = f'<link rel="alternate" hreflang="fr" href="https://www.expandia.ch/fr{suffix}">'

    # Check if already exists
    if 'hreflang="fr"' not in content:
        # Find the last hreflang tag or canonical
        if '<link rel="alternate" hreflang="de"' in content:
                # Regex to find the whole tag line including potential closing />
                content = re.sub(r'(<link rel="alternate" hreflang="de"[^>]+>)', r'\1\n    ' + fr_tag, content)
        elif '<link rel="canonical"' in content:
                content = re.sub(r'(<link rel="canonical"[^>]+>)', r'\1\n    ' + fr_tag, content)

    # 2. Update Language Selector
    if 'data-lang="fr"' not in content:
        fr_li = '''
                <li>
                    <a href="#" data-lang="fr" class="lang-switch flex items-center gap-2 justify-end">
                        <span>🇫🇷</span>
                        <span>Français</span>
                    </a>
                </li>'''

        # Use simple string replacement for better reliability
        search_str = '<span>Deutsch</span>\n                    </a>\n                </li>'
        if search_str in content:
            content = content.replace(search_str, search_str + fr_li)
        else:
            # Try looser match
            pattern = r'(<a href="#" data-lang="de".*?</a>\s*</li>)'
            match = re.search(pattern, content, re.DOTALL)
            if match:
                content = content.replace(match.group(1), match.group(1) + fr_li)

    # 3. For files in fr/ directory, update paths
    if filepath.startswith('./fr/') or filepath.startswith('fr/'):
        # Update CSS path
        content = content.replace('href="./dist/css/output.css"', 'href="../dist/css/output.css"')
        # Update JS paths
        content = content.replace('src="./dist/js/index.js"', 'src="../dist/js/index.js"')
        content = content.replace('src="./dist/js/contact.js"', 'src="../dist/js/contact.js"')
        # Update Images
        content = content.replace('src="./favicon.ico"', 'src="../favicon.ico"')
        content = content.replace('src="./favicon.png"', 'src="../favicon.png"')
        content = content.replace('href="./favicon.ico"', 'href="../favicon.ico"')
        content = content.replace('href="./favicon.png"', 'href="../favicon.png"')
        content = content.replace('src="Expandia-main-logo-koyu-yesil.png"', 'src="../Expandia-main-logo-koyu-yesil.png"')
        content = content.replace('src="./assets/', 'src="../assets/')
        content = content.replace('src="src/assets/', 'src="../src/assets/')

        # Update Links
        content = content.replace('href="./blog/', 'href="../blog/')

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        # print(f"Updated {filepath}")

# Walk through directories
if len(sys.argv) > 1:
    dirs = [sys.argv[1]]
else:
    dirs = ['.', 'de', 'tr', 'fr']

for d in dirs:
    if d == '.':
        for f in os.listdir(d):
            if f.endswith('.html'):
                update_file(os.path.join(d, f))
    else:
        if os.path.exists(d):
            for f in os.listdir(d):
                if f.endswith('.html'):
                    update_file(os.path.join(d, f))
