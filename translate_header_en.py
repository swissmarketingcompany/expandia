import sys
import re

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        en_index = f.read()

    # Extract the <nav> block
    start_str = '<nav class="navbar bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-gray-100">'
    end_str = '</nav>'
    
    start_idx = en_index.find(start_str)
    end_idx = en_index.find(end_str, start_idx) + len(end_str)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find nav in index.html")
        return
        
    nav_content = en_index[start_idx:end_idx]

    # Adjust paths since the blog file is one directory deeper (in /blog/)
    # Replace ./ with ../
    nav_content = nav_content.replace('href="./', 'href="../')
    nav_content = nav_content.replace('src="./', 'src="../')
    
    # Now fix the language switcher block entirely
    dropdown_start = nav_content.find('<ul tabindex="0"')
    if dropdown_start != -1:
        dropdown_end = nav_content.find('</ul>', dropdown_start)
        ul_content = nav_content[dropdown_start:dropdown_end+5]
        
        new_ul_content = """<ul tabindex="0"
                        class="dropdown-content z-[999] menu p-2 shadow-lg bg-white rounded-xl border border-gray-100 w-36 mt-2">
                        <li><a href="./why-speed-to-lead-matters.html" data-lang="en" class="lang-switch text-sm active">🇺🇸 English</a>
                        </li>
                        <li><a href="../de/blog/why-speed-to-lead-matters.html" data-lang="de" class="lang-switch text-sm">🇩🇪 Deutsch</a>
                        </li>
                        <li><a href="../fr/blog/why-speed-to-lead-matters.html" data-lang="fr" class="lang-switch text-sm">🇫🇷 Français</a></li>
                    </ul>"""
        
        nav_content = nav_content.replace(ul_content, new_ul_content)

    # Now read the target file
    target_file = 'blog/why-speed-to-lead-matters.html'
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
