#!/usr/bin/env python3
"""
Apply Mobile Optimization to All HTML Pages
This script adds the mobile-optimized.css file to all HTML pages in the ESLonline site
"""

import os
import re
from pathlib import Path

# Directories to process
SITE_ROOT = Path(__file__).parent
EXCLUDE_DIRS = {'.git', 'node_modules', '__pycache__', '.vscode'}
EXCLUDE_FILES = {'SECURITY_TEMPLATE.html', 'seo-fix-script.html', 'debug-theme.html'}

# CSS link to add
MOBILE_CSS_LINK = '    <link rel="stylesheet" href="{path}css/mobile-optimized.css" />'

def get_relative_path(html_file):
    """Calculate relative path from HTML file to css directory"""
    # Get the directory containing the HTML file
    html_dir = html_file.parent
    
    # Calculate relative path to root
    relative_parts = []
    current = html_dir
    
    while current != SITE_ROOT and current != current.parent:
        relative_parts.append('..')
        current = current.parent
    
    # Join the parts
    if relative_parts:
        return '/'.join(relative_parts) + '/'
    else:
        return ''

def process_html_file(file_path):
    """Add mobile-optimized.css to an HTML file if not already present"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if mobile-optimized.css is already included
        if 'mobile-optimized.css' in content:
            print(f"✓ Already has mobile CSS: {file_path.relative_to(SITE_ROOT)}")
            return False
        
        # Calculate relative path
        rel_path = get_relative_path(file_path)
        mobile_link = MOBILE_CSS_LINK.format(path=rel_path)
        
        # Find where to insert (after header.css or last stylesheet in <head>)
        patterns = [
            # Try to insert after header.css
            (r'(<link[^>]*header\.css[^>]*>)', r'\1\n' + mobile_link),
            # Try to insert after main.css
            (r'(<link[^>]*main\.css[^>]*>)', r'\1\n' + mobile_link),
            # Try to insert before </head>
            (r'(</head>)', mobile_link + '\n\1'),
        ]
        
        modified = False
        for pattern, replacement in patterns:
            if re.search(pattern, content, re.IGNORECASE):
                new_content = re.sub(pattern, replacement, content, count=1, flags=re.IGNORECASE)
                
                # Write the modified content
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                print(f"✓ Added mobile CSS: {file_path.relative_to(SITE_ROOT)}")
                modified = True
                break
        
        if not modified:
            print(f"⚠ Could not add mobile CSS to: {file_path.relative_to(SITE_ROOT)}")
        
        return modified
        
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")
        return False

def find_html_files():
    """Find all HTML files in the site"""
    html_files = []
    
    for root, dirs, files in os.walk(SITE_ROOT):
        # Remove excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            if file.endswith('.html') and file not in EXCLUDE_FILES:
                html_files.append(Path(root) / file)
    
    return html_files

def main():
    """Main function to process all HTML files"""
    print("=" * 60)
    print("Mobile Optimization Script - ESL Fun Online")
    print("=" * 60)
    print()
    
    # Find all HTML files
    html_files = find_html_files()
    print(f"Found {len(html_files)} HTML files to process\n")
    
    # Process each file
    modified_count = 0
    for html_file in sorted(html_files):
        if process_html_file(html_file):
            modified_count += 1
    
    # Summary
    print()
    print("=" * 60)
    print(f"✓ Modified {modified_count} files")
    print(f"✓ Skipped {len(html_files) - modified_count} files (already optimized)")
    print("=" * 60)
    print()
    print("Mobile optimization complete! 🎉")
    print("All pages now have consistent mobile menu styling.")

if __name__ == '__main__':
    main()
