#!/usr/bin/env python3
"""
Update all site headers to include Worksheets link
ESL Fun Online - Batch Header Update Script
"""

import os
import re
from pathlib import Path

# Define the pattern to search for and replacement
# For subdirectory pages (with ../)
OLD_PATTERN_SUBDIR = '''                <a href="../english/vocabguide.html" class="dropdown-item">
                  <i class="fas fa-book-open"></i>
                  Vocabulary Building
                </a>
                <a href="../english/writingf.html" class="dropdown-item">'''

NEW_PATTERN_SUBDIR = '''                <a href="../english/vocabguide.html" class="dropdown-item">
                  <i class="fas fa-book-open"></i>
                  Vocabulary Building
                </a>
                <a href="../english/worksheets.html" class="dropdown-item">
                  <i class="fas fa-file-alt"></i>
                  Worksheets
                </a>
                <a href="../english/writingf.html" class="dropdown-item">'''

# For root level pages (without ../)
OLD_PATTERN_ROOT = '''                <a href="english/vocabguide.html" class="dropdown-item">
                  <i class="fas fa-book-open"></i>
                  Vocabulary Building
                </a>
                <a href="english/writingf.html" class="dropdown-item">'''

NEW_PATTERN_ROOT = '''                <a href="english/vocabguide.html" class="dropdown-item">
                  <i class="fas fa-book-open"></i>
                  Vocabulary Building
                </a>
                <a href="english/worksheets.html" class="dropdown-item">
                  <i class="fas fa-file-alt"></i>
                  Worksheets
                </a>
                <a href="english/writingf.html" class="dropdown-item">'''

def update_file(filepath):
    """Update a single file with the new header pattern"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Check if file already has worksheets link
        if 'worksheets.html' in content.lower():
            return False, "Already updated"
        
        # Check if file has the English dropdown
        if 'Grammar Guides' not in content or 'Vocabulary Building' not in content:
            return False, "No English dropdown found"
        
        # Try subdirectory pattern first
        if OLD_PATTERN_SUBDIR in content:
            content = content.replace(OLD_PATTERN_SUBDIR, NEW_PATTERN_SUBDIR)
        # Try root pattern
        elif OLD_PATTERN_ROOT in content:
            content = content.replace(OLD_PATTERN_ROOT, NEW_PATTERN_ROOT)
        else:
            return False, "Pattern not found"
        
        # Only write if content changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, "Updated successfully"
        else:
            return False, "No changes made"
            
    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    """Main function to update all HTML files"""
    root_dir = Path('.')
    
    # Skip these directories
    skip_dirs = {'.git', 'node_modules', '__pycache__'}
    
    # Skip backup files
    skip_patterns = ['.backup', '.bak']
    
    updated_files = []
    skipped_files = []
    error_files = []
    
    print("Starting header update process...")
    print("=" * 60)
    
    # Walk through all HTML files
    for html_file in root_dir.rglob('*.html'):
        # Skip if in excluded directory
        if any(skip_dir in html_file.parts for skip_dir in skip_dirs):
            continue
        
        # Skip backup files
        if any(pattern in str(html_file) for pattern in skip_patterns):
            continue
        
        # Update the file
        success, message = update_file(html_file)
        
        if success:
            updated_files.append(str(html_file))
            print(f"✓ {html_file}")
        elif "Already updated" in message:
            skipped_files.append((str(html_file), message))
        elif "No English dropdown" in message:
            # Silent skip for files without English navigation
            pass
        else:
            error_files.append((str(html_file), message))
            print(f"✗ {html_file}: {message}")
    
    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Updated: {len(updated_files)} files")
    print(f"Skipped: {len(skipped_files)} files")
    print(f"Errors: {len(error_files)} files")
    
    if updated_files:
        print("\nUpdated files:")
        for f in updated_files[:10]:  # Show first 10
            print(f"  - {f}")
        if len(updated_files) > 10:
            print(f"  ... and {len(updated_files) - 10} more")
    
    print("\nHeader update complete!")

if __name__ == "__main__":
    main()
