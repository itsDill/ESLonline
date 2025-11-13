#!/usr/bin/env python3
"""
Check for indexing issues across the ESL Online website
"""

import os
import re
from pathlib import Path

def check_noindex_tags():
    """Check for pages with noindex meta tags"""
    noindex_pages = []
    
    html_files = Path('.').rglob('*.html')
    for file in html_files:
        # Skip backup directories
        if 'backup' in str(file) or 'node_modules' in str(file):
            continue
            
        try:
            with open(file, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'noindex' in content.lower():
                    noindex_pages.append(str(file))
        except:
            pass
    
    return noindex_pages

def check_canonical_tags():
    """Check for pages with canonical tags pointing elsewhere"""
    issues = []
    
    html_files = Path('.').rglob('*.html')
    for file in html_files:
        if 'backup' in str(file):
            continue
            
        try:
            with open(file, 'r', encoding='utf-8') as f:
                content = f.read()
                # Look for canonical tags
                canonical_match = re.search(r'<link\s+rel=["\']canonical["\'].*?href=["\']([^"\']+)["\']', content, re.IGNORECASE)
                if canonical_match:
                    canonical_url = canonical_match.group(1)
                    # Check if it points to a different page
                    filename = file.name
                    if filename not in canonical_url:
                        issues.append(f"{file}: points to {canonical_url}")
        except:
            pass
    
    return issues

def check_sitemap_coverage():
    """Compare sitemap URLs with actual HTML files"""
    
    # Read sitemap
    sitemap_urls = set()
    try:
        with open('sitemap.xml', 'r') as f:
            content = f.read()
            urls = re.findall(r'<loc>(.*?)</loc>', content)
            for url in urls:
                # Extract path from URL
                path = url.replace('https://eslfunonline.com', '')
                if path == '/':
                    path = '/index.html'
                sitemap_urls.add(path)
    except:
        print("❌ Could not read sitemap.xml")
        return
    
    # Find all HTML files
    html_files = []
    excluded_patterns = ['backup', 'login.html', 'register.html', '404.html', 
                        'debug-', 'test-', 'header-template', 'SECURITY_TEMPLATE',
                        'students/', 'teachers/', '-old.html', 'snippets',
                        'seo-fix-script', 'idioms-compact', 'idioms-grid',
                        'performance-optimization', 'brand-monitoring']
    
    for file in Path('.').rglob('*.html'):
        file_str = str(file)
        
        # Skip excluded patterns
        if any(pattern in file_str for pattern in excluded_patterns):
            continue
            
        # Convert to URL path
        path = '/' + file_str.replace('./', '').replace('index.html', '')
        if path.endswith('/'):
            path = path[:-1]
        if not path.endswith('.html'):
            path += 'index.html'
            
        html_files.append(path)
    
    # Find missing pages
    missing_from_sitemap = []
    for file_path in html_files:
        if file_path not in sitemap_urls and file_path.replace('/', '') != 'index.html':
            missing_from_sitemap.append(file_path)
    
    return missing_from_sitemap

def main():
    print("\n" + "="*70)
    print("🔍 INDEXING ISSUES CHECK - ESL Online")
    print("="*70 + "\n")
    
    # Check for noindex tags
    print("1️⃣  Checking for noindex meta tags...")
    noindex_pages = check_noindex_tags()
    if noindex_pages:
        print(f"   ⚠️  Found {len(noindex_pages)} pages with noindex:")
        for page in noindex_pages[:10]:
            print(f"      - {page}")
    else:
        print("   ✅ No noindex tags found in content pages")
    
    # Check canonical tags
    print("\n2️⃣  Checking for canonical tag issues...")
    canonical_issues = check_canonical_tags()
    if canonical_issues:
        print(f"   ⚠️  Found {len(canonical_issues)} canonical issues:")
        for issue in canonical_issues[:10]:
            print(f"      - {issue}")
    else:
        print("   ✅ No canonical tag issues found")
    
    # Check sitemap coverage
    print("\n3️⃣  Checking sitemap coverage...")
    missing = check_sitemap_coverage()
    if missing:
        print(f"   ⚠️  Found {len(missing)} pages NOT in sitemap:")
        for page in sorted(missing)[:20]:
            print(f"      - {page}")
        if len(missing) > 20:
            print(f"      ... and {len(missing) - 20} more")
    else:
        print("   ✅ All relevant pages are in sitemap")
    
    print("\n" + "="*70)
    print("✨ Check complete!")
    print("="*70 + "\n")

if __name__ == "__main__":
    main()
