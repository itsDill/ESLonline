#!/usr/bin/env python3
"""
Add missing CSS links to all HTML files in english/ directory
"""

import re
from pathlib import Path

CACHE_VERSION = "1763019900"
ENGLISH_DIR = Path("/Users/dillchalisas/ESLonline/english")

# Required CSS files that every page needs
REQUIRED_CSS = [
    '../css/main.css',
    '../css/header.css', 
    '../css/hero-unified.css',
    '../css/index-page.css'
]

def fix_css_links(filepath):
    """Add missing CSS links to HTML file"""
    filename = filepath.stem
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the </head> tag
    head_match = re.search(r'</head>', content)
    if not head_match:
        print(f"  ⚠ No </head> tag found in {filename}.html")
        return
    
    # Build the CSS links section
    css_links = []
    
    # Add core CSS files
    for css_file in REQUIRED_CSS:
        css_name = css_file.split('/')[-1]
        if css_name not in content:
            css_links.append(f'    <link rel="stylesheet" href="{css_file}?v={CACHE_VERSION}" />')
    
    # Add page-specific CSS
    page_css = f'../css/{filename}-page.css'
    if f'{filename}-page.css' not in content:
        css_links.append(f'    <link rel="stylesheet" href="{page_css}?v={CACHE_VERSION}" />')
    
    # Add mobile CSS if not present
    mobile_css = [
        '../css/mobile-optimized.css',
        '../css/mobile-menu.css',
        '../css/layout-fixes.css'
    ]
    
    for css_file in mobile_css:
        css_name = css_file.split('/')[-1]
        if css_name not in content:
            css_links.append(f'    <link rel="stylesheet" href="{css_file}?v={CACHE_VERSION}" />')
    
    if not css_links:
        print(f"✓ {filename}.html - All CSS links present")
        return
    
    # Insert before </head>
    insert_text = '\n'.join(css_links) + '\n    '
    content = content.replace('</head>', f'{insert_text}</head>')
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ {filename}.html - Added {len(css_links)} CSS links")

def main():
    print("Adding missing CSS links to english/*.html files...\n")
    
    skip_files = {'grammar.html'}  # Already correct
    
    html_files = sorted(ENGLISH_DIR.glob("*.html"))
    
    for filepath in html_files:
        if filepath.name in skip_files:
            print(f"Skipping {filepath.name} (already has correct links)")
            continue
        
        fix_css_links(filepath)
    
    print("\nDone!")

if __name__ == "__main__":
    main()
