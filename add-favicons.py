#!/usr/bin/env python3
"""
Add favicon links to all HTML files in the project
"""
import os
import re
from pathlib import Path

# Favicon HTML to insert
FAVICON_HTML = """    <!-- Favicon and Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="{path}images/1.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="{path}images/1.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="{path}images/1.png" />
    <link rel="shortcut icon" href="{path}images/1.png" />
    <link rel="icon" href="{path}images/1.png" />

"""

def calculate_relative_path(file_path, base_dir):
    """Calculate the relative path to images directory"""
    # Count how many levels deep the file is
    file_abs = os.path.abspath(file_path)
    base_abs = os.path.abspath(base_dir)
    
    # Get relative path from file to base
    rel_file = os.path.relpath(file_abs, base_abs)
    depth = len(Path(rel_file).parts) - 1
    
    if depth == 0:
        return ""
    return "../" * depth

def has_favicon(content):
    """Check if the file already has favicon links"""
    return 'rel="icon"' in content or 'rel="shortcut icon"' in content

def add_favicon_to_file(file_path, base_dir):
    """Add favicon links to a single HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has favicon
        if has_favicon(content):
            return False
        
        # Calculate relative path
        rel_path = calculate_relative_path(file_path, base_dir)
        favicon_html = FAVICON_HTML.format(path=rel_path)
        
        # Find the title tag and insert after it
        # Look for </title> and insert the favicon links after it
        pattern = r'(</title>)'
        
        if re.search(pattern, content, re.IGNORECASE):
            new_content = re.sub(
                pattern,
                r'\1\n' + favicon_html,
                content,
                count=1,
                flags=re.IGNORECASE
            )
            
            # Write the file back
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            return True
        else:
            print(f"  ⚠️  No </title> tag found in {file_path}")
            return False
            
    except Exception as e:
        print(f"  ❌ Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all HTML files"""
    print("🔍 Finding HTML files...")
    
    # Get all HTML files
    html_files = []
    for root, dirs, files in os.walk('.'):
        # Skip certain directories
        skip_dirs = {'.git', 'node_modules', '__pycache__', '.venv', 'venv'}
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    print(f"📄 Found {len(html_files)} HTML files\n")
    
    updated = 0
    skipped = 0
    base_dir = os.getcwd()
    
    for file_path in sorted(html_files):
        rel_path = os.path.relpath(file_path)
        
        if add_favicon_to_file(file_path, base_dir):
            print(f"✅ Updated: {rel_path}")
            updated += 1
        else:
            if has_favicon(open(file_path, 'r', encoding='utf-8').read()):
                print(f"⏭️  Skipped (already has favicon): {rel_path}")
                skipped += 1
    
    print(f"\n{'='*60}")
    print(f"✨ Complete!")
    print(f"   Updated: {updated} files")
    print(f"   Skipped: {skipped} files (already had favicons)")
    print(f"   Total:   {len(html_files)} files")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
