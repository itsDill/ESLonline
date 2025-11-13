#!/usr/bin/env python3
"""
1. Standardize CSS link structure across all pages
2. Remove duplicate CSS rules from page-specific files
"""

import re
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path("/Users/dillchalisas/ESLonline")
CSS_DIR = BASE_DIR / "css"
CACHE_VERSION = "1763019900"

# Standard CSS order for all pages
STANDARD_CSS_ORDER = [
    'main.css',
    'header.css',
    'hero-unified.css',
    'index-page.css',
    'PAGE_SPECIFIC',  # Placeholder for page-specific CSS
    'mobile-optimized.css',
    'mobile-menu.css',
    'layout-fixes.css'
]

# Core selectors that should NOT be in page-specific CSS
CORE_SELECTORS = [
    r'^\*\s*$',
    r'^html\s*$',
    r'^body\s*$',
    r'^:root\s*$',
    r'^\.nav-',
    r'^\.dropdown',
    r'^\.hero-content\s*$',
    r'^\.hero-title\s*$',
    r'^\.hero\s*$',
    r'^\.hero-subtitle',
    r'^\.stat-number\s*$',
    r'^\.stat-label\s*$',
    r'^\.stats-section',
    r'^\.controls',
    r'^\.control-btn',
    r'^\.mobile-toggle',
    r'^\.theme-toggle',
    r'^@keyframes fadeIn',
    r'^@keyframes slideIn',
    r'^from\s*$',
    r'^to\s*$',
    r'^0%\s*$',
    r'^50%\s*$',
    r'^100%\s*$',
]

def should_remove_selector(selector):
    """Check if selector should be removed from page-specific CSS"""
    selector = selector.strip()
    for pattern in CORE_SELECTORS:
        if re.match(pattern, selector, re.IGNORECASE):
            return True
    return False

def clean_page_css(css_file):
    """Remove core CSS rules from page-specific CSS file"""
    if not css_file.exists():
        return
    
    content = css_file.read_text(encoding='utf-8')
    original_size = len(content)
    
    # Split into rules
    lines = []
    current_rule = []
    in_rule = False
    brace_count = 0
    
    for line in content.split('\n'):
        if '{' in line:
            brace_count += line.count('{')
            in_rule = True
            current_rule.append(line)
        elif '}' in line:
            brace_count -= line.count('}')
            current_rule.append(line)
            
            if brace_count == 0:
                # End of rule - check if we should keep it
                rule_text = '\n'.join(current_rule)
                
                # Extract selector (everything before first {)
                match = re.match(r'([^{]+)\s*{', rule_text)
                if match:
                    selector = match.group(1).strip()
                    
                    # Check if this is a core selector
                    if not should_remove_selector(selector):
                        lines.extend(current_rule)
                
                current_rule = []
                in_rule = False
        elif in_rule:
            current_rule.append(line)
        else:
            # Comments, empty lines, etc outside rules
            lines.append(line)
    
    cleaned = '\n'.join(lines)
    new_size = len(cleaned)
    
    if new_size < original_size:
        css_file.write_text(cleaned, encoding='utf-8')
        reduced = original_size - new_size
        print(f"  Cleaned {css_file.name}: Removed {reduced} bytes ({reduced/original_size*100:.1f}%)")
        return reduced
    
    return 0

def standardize_html_css_links(html_file, subdir):
    """Standardize CSS links in HTML file"""
    content = html_file.read_text(encoding='utf-8')
    
    # Find the page-specific CSS name
    page_name = html_file.stem
    page_css = f'{page_name}-page.css'
    
    # Build standard CSS links
    css_links = []
    for css_file in STANDARD_CSS_ORDER:
        if css_file == 'PAGE_SPECIFIC':
            css_path = f'../css/{page_css}'
            css_links.append(f'    <link rel="stylesheet" href="{css_path}?v={CACHE_VERSION}" />')
        else:
            css_path = f'../css/{css_file}'
            css_links.append(f'    <link rel="stylesheet" href="{css_path}?v={CACHE_VERSION}" />')
    
    # Remove all existing CSS links
    content = re.sub(r'<link[^>]*rel="stylesheet"[^>]*href="[^"]*\.css[^"]*"[^>]*/?>\s*\n?', '', content)
    
    # Insert new CSS links before </head>
    css_block = '\n'.join(css_links) + '\n    '
    content = content.replace('</head>', f'{css_block}</head>')
    
    html_file.write_text(content, encoding='utf-8')
    print(f"  Standardized {subdir}/{html_file.name}")

def main():
    print("="*80)
    print("STEP 1: Cleaning duplicate CSS from page-specific files")
    print("="*80 + "\n")
    
    page_css_files = sorted(CSS_DIR.glob("*-page.css"))
    total_saved = 0
    
    for css_file in page_css_files:
        saved = clean_page_css(css_file)
        total_saved += saved
    
    print(f"\nTotal space saved: {total_saved/1024:.1f} KB\n")
    
    print("="*80)
    print("STEP 2: Standardizing CSS links in HTML files")
    print("="*80 + "\n")
    
    # Process all subdirectories
    directories = {
        'english': BASE_DIR / 'english',
        'coding': BASE_DIR / 'coding',
        'games': BASE_DIR / 'games',
        'tools': BASE_DIR / 'tools',
        'blog': BASE_DIR / 'blog',
    }
    
    for subdir, path in directories.items():
        if not path.exists():
            continue
        
        html_files = sorted(path.glob("*.html"))
        if html_files:
            print(f"\n{subdir}/")
            for html_file in html_files:
                standardize_html_css_links(html_file, subdir)
    
    print("\n" + "="*80)
    print("COMPLETE")
    print("="*80)
    print("\nAll pages now have:")
    print("  ✅ Consistent CSS loading order")
    print("  ✅ Cache busting on all CSS files")
    print("  ✅ No duplicate core CSS in page-specific files")

if __name__ == "__main__":
    main()
