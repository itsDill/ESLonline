#!/usr/bin/env python3
"""
Fix AdSense Implementation Across Site
======================================
This script:
1. Removes all manual ad placements (data-ad-slot="AUTO")
2. Ensures auto ads script is properly placed
3. Adds auto ads meta tag
4. Creates consistent implementation
"""

import os
import re
from pathlib import Path

def fix_adsense_in_file(file_path):
    """Fix AdSense implementation in a single HTML file"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes_made = []
    
    # 1. Check if AdSense script exists
    has_adsense_script = 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js' in content
    
    # 2. Check if auto ads meta tag exists
    has_meta_tag = 'google-adsense-account' in content
    
    # 3. Count manual ad placements
    manual_ads = len(re.findall(r'<ins\s+class="adsbygoogle"', content))
    
    print(f"\nAnalyzing: {file_path}")
    print(f"  - Has AdSense script: {has_adsense_script}")
    print(f"  - Has meta tag: {has_meta_tag}")
    print(f"  - Manual ad placements: {manual_ads}")
    
    # 4. Add meta tag if missing (right after AdSense script)
    if has_adsense_script and not has_meta_tag:
        # Find the AdSense script and add meta tag after it
        pattern = r'(<script[^>]*pagead2\.googlesyndication\.com[^>]*></script>)'
        replacement = r'\1\n    <meta name="google-adsense-account" content="ca-pub-2456627863532019" />'
        
        new_content = re.sub(pattern, replacement, content, count=1)
        if new_content != content:
            content = new_content
            changes_made.append("Added auto ads meta tag")
    
    # 5. Remove manual ad placements with data-ad-slot="AUTO"
    if manual_ads > 0:
        # Pattern to match ad containers with AUTO slot
        ad_pattern = r'<!-- AdSense -->.*?<div class="ad-container">.*?<ins\s+class="adsbygoogle"[^>]*data-ad-slot="AUTO"[^>]*>.*?</ins>.*?<script>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\({}\);\s*</script>.*?</div>'
        
        # Also match without container div
        ad_pattern2 = r'<div[^>]*>\s*<ins\s+class="adsbygoogle"[^>]*data-ad-slot="AUTO"[^>]*>.*?</ins>.*?<script>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\({}\);\s*</script>.*?</div>'
        
        # Match inline ads
        ad_pattern3 = r'<ins\s+class="adsbygoogle"[^>]*data-ad-slot="AUTO"[^>]*>.*?</ins>\s*<script>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\({}\);\s*</script>'
        
        for pattern in [ad_pattern, ad_pattern2, ad_pattern3]:
            new_content = re.sub(pattern, '', content, flags=re.DOTALL)
            if new_content != content:
                removed = len(content) - len(new_content)
                content = new_content
                changes_made.append(f"Removed manual ad placement (~{removed} chars)")
    
    # 6. Save if changes were made
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Changes made:")
        for change in changes_made:
            print(f"    - {change}")
        return True
    else:
        print(f"  - No changes needed")
        return False

def main():
    """Process all HTML files"""
    
    print("=" * 60)
    print("AdSense Consistency Fix")
    print("=" * 60)
    
    # Get all HTML files
    html_files = []
    for root, dirs, files in os.walk('.'):
        # Skip certain directories
        skip_dirs = {'.git', 'node_modules', '__pycache__', 'backup', '.backup'}
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        
        for file in files:
            if file.endswith('.html') and not file.endswith('.backup'):
                html_files.append(os.path.join(root, file))
    
    print(f"\nFound {len(html_files)} HTML files\n")
    
    # Process each file
    files_changed = 0
    for file_path in sorted(html_files):
        if fix_adsense_in_file(file_path):
            files_changed += 1
    
    print("\n" + "=" * 60)
    print(f"Summary: Updated {files_changed} out of {len(html_files)} files")
    print("=" * 60)
    
    print("\nNext Steps:")
    print("1. Test a few pages to ensure ads load properly")
    print("2. Wait 1-2 hours for Google to recrawl")
    print("3. Check AdSense dashboard for ad requests")
    print("4. If issues persist after 48 hours, see ADSENSE_AUDIT_FINDINGS.md")

if __name__ == "__main__":
    main()
