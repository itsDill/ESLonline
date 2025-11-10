#!/usr/bin/env python3
"""
Remove all manual Google AdSense ad placements from HTML files.
This script removes ad containers and their wrapper divs while preserving auto ads script.
"""

import os
import re
from pathlib import Path

def should_skip_directory(path):
    """Check if directory should be skipped."""
    skip_dirs = ['backup', 'node_modules', '.git', '__pycache__']
    path_parts = Path(path).parts
    return any(skip in path_parts for skip in skip_dirs)

def remove_manual_ads(content):
    """Remove manual ad placements from HTML content."""
    original_content = content
    
    # Pattern 1: Remove ad containers with class="ad-container" or similar
    # This removes the entire div and its contents
    patterns = [
        # Ad container with various classes
        r'<div\s+class="[^"]*ad-container[^"]*"[^>]*>.*?</div>\s*',
        r'<div\s+class="[^"]*ad-space[^"]*"[^>]*>.*?</div>\s*',
        r'<div\s+class="[^"]*ad-slot[^"]*"[^>]*>.*?</div>\s*',
        
        # Specific ins.adsbygoogle elements with their wrappers
        r'<div[^>]*>\s*<ins\s+class="adsbygoogle"[^>]*>.*?</ins>\s*<script>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\(\{\}\);\s*</script>\s*</div>\s*',
        
        # Just ins.adsbygoogle with script (no wrapper)
        r'<ins\s+class="adsbygoogle"[^>]*>.*?</ins>\s*<script>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\(\{\}\);\s*</script>\s*',
        
        # Ins element alone with data-ad-slot
        r'<ins\s+class="adsbygoogle"[^>]*data-ad-slot[^>]*>.*?</ins>\s*',
    ]
    
    for pattern in patterns:
        content = re.sub(pattern, '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove any orphaned adsbygoogle push scripts
    content = re.sub(
        r'<script>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\(\{\}\);\s*</script>\s*',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Clean up multiple consecutive blank lines (more than 2)
    content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)
    
    return content, content != original_content

def process_html_file(file_path):
    """Process a single HTML file to remove manual ads."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content, was_modified = remove_manual_ads(content)
        
        if was_modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all HTML files."""
    root_dir = Path(__file__).parent
    modified_count = 0
    total_count = 0
    
    print("Scanning for HTML files with manual ad placements...")
    print("=" * 60)
    
    for html_file in root_dir.rglob('*.html'):
        # Skip backup directories
        if should_skip_directory(str(html_file)):
            continue
        
        total_count += 1
        if process_html_file(html_file):
            modified_count += 1
            rel_path = html_file.relative_to(root_dir)
            print(f"✓ Cleaned: {rel_path}")
    
    print("=" * 60)
    print(f"\nProcessing complete!")
    print(f"Files scanned: {total_count}")
    print(f"Files modified: {modified_count}")
    print(f"\nAll manual Google AdSense placements have been removed.")
    print("Auto ads script remains intact and will serve ads automatically.")

if __name__ == "__main__":
    main()
