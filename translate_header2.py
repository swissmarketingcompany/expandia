import sys
import re

def main():
    with open('de/index.html', 'r', encoding='utf-8') as f:
        de_index = f.read()

    # Extract the <nav> block
    start_str = '<nav class="navbar bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-gray-100">'
    end_str = '</nav>'
    
    start_idx = de_index.find(start_str)
    end_idx = de_index.find(end_str, start_idx) + len(end_str)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find nav in de/index.html")
        return
        
    nav_content = de_index[start_idx:end_idx]

    # Adjust paths since the blog file is one directory deeper (in /de/blog/)
    # FIRST, step back those links that were already ../ (going up one dir from /de/ to /expandia/)
    # So they become ../../ (going up from /de/blog/ to /expandia/)
    nav_content = re.sub(r'href="\.\./(?!\.\./)', 'href="../../', nav_content)
    nav_content = re.sub(r'src="\.\./(?!\.\./)', 'src="../../', nav_content)
    
    # THEN replace ./ (linking to /de/) with ../ (linking to /de/ from /de/blog/)
    nav_content = nav_content.replace('href="./', 'href="../')
    
    # Now fix the language switcher block entirely
    dropdown_start = nav_content.find('<ul tabindex="0"\n                        class="dropdown-content')
    if dropdown_start != -1:
        dropdown_end = nav_content.find('</ul>', dropdown_start)
        ul_content = nav_content[dropdown_start:dropdown_end+5]
        
        new_ul_content = """<ul tabindex="0"
                        class="dropdown-content z-[999] menu p-2 shadow-lg bg-white rounded-xl border border-gray-100 w-36 mt-2">
                        <li><a href="../../blog/why-speed-to-lead-matters.html" data-lang="en"
                                class="lang-switch text-sm">🇺🇸 English</a>
                        </li>
                        <li><a href="./why-speed-to-lead-matters.html" data-lang="de"
                                class="lang-switch text-sm active">🇩🇪 Deutsch</a>
                        </li>
                        <li><a href="../../fr/blog/why-speed-to-lead-matters.html" data-lang="fr"
                                class="lang-switch text-sm">🇫🇷 Français</a></li>
                    </ul>"""
        
        nav_content = nav_content.replace(ul_content, new_ul_content)

    # Now read the target file
    target_file = 'de/blog/why-speed-to-lead-matters.html'
    with open(target_file, 'r', encoding='utf-8') as f:
        target_html = f.read()

    # Extract its nav block
    target_start_idx = target_html.find(start_str)
    target_end_idx = target_html.find(end_str, target_start_idx) + len(end_str)
    
    # Replace it
    new_target_html = target_html[:target_start_idx] + nav_content + target_html[target_end_idx:]
    
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(new_target_html)
        
    print("Nav replaced successfully")

if __name__ == "__main__":
    main()
