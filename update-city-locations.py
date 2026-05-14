#!/usr/bin/env python3
"""
Update city-locations.html to use new city URLs
Change from: ./b2b-lead-generation-{city}.html
To: ./{city}.html
"""

with open('city-locations.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace URL pattern in JavaScript
content = content.replace(
    '"url":"./b2b-lead-generation-',
    '"url":"./'
)

with open('city-locations.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Updated city-locations.html with new URLs")
