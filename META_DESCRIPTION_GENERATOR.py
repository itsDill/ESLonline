#!/usr/bin/env python3
"""
Meta Description Generator for ESL Fun Online
Bulk adds missing meta descriptions to HTML files based on page content
"""

import os
import re
from pathlib import Path

# Meta description templates by page type
META_TEMPLATES = {
    "games": "Play FREE ESL games online - {title}. Interactive {game_type} games to learn English vocabulary, grammar & speaking. Perfect for students & teachers.",
    "lessons": "Free ESL {topic} lesson - {title}. Master {topic} with interactive examples, exercises & explanations. Ideal for English learners & teachers.",
    "resources": "{title} - Free ESL resources for English learners. Download worksheets, flashcards & study guides. Perfect for classroom & self-study.",
    "flashcards": "Free {language} flashcards for ESL learners - {title}. Study vocabulary, phrases & expressions. Mobile-friendly, no sign-up required.",
    "tools": "Free ESL {tool_type} - {title}. Interactive online tool for English teachers & learners. Create lessons, tests & practice exercises instantly.",
    "default": "{title} - Free ESL learning resources. Practice English grammar, vocabulary & conversation. Interactive & easy to use.",
}

def extract_page_title(html_content):
    """Extract title from HTML"""
    title_match = re.search(r'<title[^>]*>([^<]+)</title>', html_content, re.IGNORECASE)
    if title_match:
        return title_match.group(1).strip().split('|')[0].strip()
    
    # Try H1
    h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html_content, re.IGNORECASE)
    if h1_match:
        return h1_match.group(1).strip()
    
    return "ESL Learning Resource"

def determine_page_type(filepath):
    """Determine page type from filepath"""
    filepath_lower = filepath.lower()
    if 'game' in filepath_lower:
        return 'games'
    elif 'lesson' in filepath_lower or 'english' in filepath_lower:
        return 'lessons'
    elif 'flashcard' in filepath_lower:
        return 'flashcards'
    elif 'tool' in filepath_lower or 'resource' in filepath_lower:
        return 'tools'
    return 'default'

def check_has_description(html_content):
    """Check if file already has meta description"""
    return bool(re.search(r'<meta\s+name=["\']description["\']', html_content, re.IGNORECASE))

def generate_description(filepath, html_content):
    """Generate appropriate meta description"""
    page_type = determine_page_type(filepath)
    title = extract_page_title(html_content)
    
    template = META_TEMPLATES.get(page_type, META_TEMPLATES['default'])
    description = template.format(
        title=title,
        game_type="vocabulary" if "vocab" in filepath.lower() else "grammar",
        topic="grammar" if "grammar" in filepath.lower() else "vocabulary",
        language="Chinese" if "chinese" in filepath.lower() else "Japanese" if "japanese" in filepath.lower() else "",
        tool_type="test" if "test" in filepath.lower() else "worksheet",
    )
    
    # Limit to 160 chars (Google's display limit)
    if len(description) > 160:
        description = description[:157] + "..."
    
    return description

def add_meta_description(filepath):
    """Add meta description to HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has description
        if check_has_description(content):
            return None
        
        # Generate description
        description = generate_description(filepath, content)
        
        # Find where to insert (after charset, before other meta tags)
        insert_pattern = r'(<meta\s+name=["\'](viewport|author|robots)["\'])'
        insert_match = re.search(insert_pattern, content, re.IGNORECASE)
        
        if insert_match:
            insert_pos = insert_match.start()
            new_meta = f'    <meta name="description" content="{description}" />\n    '
            new_content = content[:insert_pos] + new_meta + content[insert_pos:]
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            return description
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
    
    return None

def main():
    """Main function to scan and add meta descriptions"""
    root = Path('/Users/dillchalisas/ESLonline')
    
    # Skip these directories
    skip_dirs = {'.git', '.venv', '.dev-files', '.idea', '.vscode', '__pycache__'}
    
    files_updated = 0
    files_skipped = 0
    
    for html_file in root.rglob('*.html'):
        # Skip certain directories and files
        if any(part in html_file.parts for part in skip_dirs):
            continue
        if 'old' in html_file.name or 'backup' in html_file.name or 'test' in html_file.name:
            continue
        
        result = add_meta_description(str(html_file))
        if result:
            files_updated += 1
            print(f"✅ {html_file.relative_to(root)}")
            print(f"   → {result[:70]}...")
        else:
            files_skipped += 1
    
    print(f"\n📊 Summary: {files_updated} files updated, {files_skipped} skipped")
    print("⚠️  Review changes before pushing to production!")

if __name__ == "__main__":
    main()
