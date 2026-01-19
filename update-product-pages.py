#!/usr/bin/env python3
"""
Product Page Content Updater
Updates all product pages with SEO-optimized, simple English content
"""

import json
import re

# Load product content
with open('data/product-content.json', 'r') as f:
    content = json.load(f)

# Product file mapping
products = {
    'revops-infrastructure': 'templates/revops-infrastructure.html',
    'verified-lead-list': 'templates/verified-lead-list.html',
    'email-deliverability-checkup': 'templates/email-deliverability-checkup.html',
    'secure-email-workplace-setup': 'templates/secure-email-workplace-setup.html',
    'website-care-services': 'templates/website-care-services.html'
}

def update_hero_section(html, product_data):
    """Update hero section with product-specific content"""
    hero = product_data['hero']
    
    # Update badge
    html = re.sub(
        r'(<span class="w-2 h-2[^>]*>.*?</span>\s*)([^<]+)',
        f'\\1{hero["badge"]}',
        html,
        count=1
    )
    
    # Update headline
    html = re.sub(
        r'(<span class="gradient-header">)([^<]+)(</span>)',
        f'\\1{hero["headline"]}\\3',
        html,
        count=1
    )
    
    # Update description
    html = re.sub(
        r'(<p class="text-xl md:text-2xl[^>]*>)(.*?)(</p>)',
        f'\\1{hero["description"]}\\3',
        html,
        flags=re.DOTALL,
        count=1
    )
    
    return html

def generate_faq_html(faqs):
    """Generate proper FAQ HTML with schema markup"""
    faq_html = ''
    for i, faq in enumerate(faqs):
        faq_html += f'''
            <!-- Q{i+1} -->
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div class="text-6xl font-black text-primary/20 mb-4">{str(i+1).zfill(2)}.</div>
                    <h3 class="text-2xl md:text-3xl font-bold mb-6">{faq["question"]}</h3>
                    <p class="text-base-content/70">{faq["answer"]}</p>
                </div>
                <div class="relative">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                        alt="{faq["question"]}" class="rounded-3xl shadow-xl w-full object-cover aspect-[4/3]">
                </div>
            </div>
'''
    return faq_html

def update_faq_section(html, product_data):
    """Replace FAQ section with product-specific FAQs"""
    faqs = product_data['faqs']
    faq_html = generate_faq_html(faqs)
    
    # Replace the entire FAQ content between the space-y-24 div tags
    html = re.sub(
        r'(<div class="space-y-24 max-w-5xl mx-auto">)(.*?)(</div>\s*</div>\s*</section>)',
        f'\\1{faq_html}        \\3',
        html,
        flags=re.DOTALL,
        count=1
    )
    
    return html

# Process each product
for product_id, file_path in products.items():
    print(f"Processing {product_id}...")
    
    try:
        # Read template
        with open(file_path, 'r') as f:
            html = f.read()
        
        # Get product data
        product_data = content[product_id]
        
        # Update sections
        html = update_hero_section(html, product_data)
        html = update_faq_section(html, product_data)
        
        # Write back
        with open(file_path, 'w') as f:
            f.write(html)
        
        print(f"✅ Updated {product_id}")
        
    except Exception as e:
        print(f"❌ Error updating {product_id}: {e}")

print("\n✨ All product pages updated!")
