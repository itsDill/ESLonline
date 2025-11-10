#!/usr/bin/env python3
"""
Check all grammar pages for consistent CSS and header structure
"""

import os
import re
from pathlib import Path

# Grammar pages to check based on grammar.html links
GRAMMAR_PAGES = [
    "parts-of-speech.html",
    "wordforms.html",
    "prefixessuffixes.html",
    "wordfamilies.html",
    "strucuture.html",
    "clauses.html",
    "verb-tenses.html",
    "modalverbs.html",
    "conditionals.html",
    "passive.html",
    "reported-speech.html",
    "questions-negation.html",
    "articles.html",
    "nouns.html",
    "prepositions.html",
    "pronouns.html",
    "adjectives-adverbs.html",
    "comparatives.html",
    "relative-clauses.html",
    "phrasal-verbs.html",
    "gerunds-infinitives.html",
    "punctuation.html",
    "collocations.html",
    "discourse-markers.html"
]

ENGLISH_DIR = Path("/Users/dillchalisas/ESLonline/english")

def check_page(filepath):
    """Check if a page has proper CSS links and header structure"""
    if not filepath.exists():
        return {
            'exists': False,
            'has_header_css': False,
            'has_mobile_css': False,
            'has_main_css': False,
            'has_layout_css': False,
            'has_full_header': False,
            'has_hero': False,
            'filename': filepath.name
        }
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for CSS files
    has_header_css = '../css/header.css' in content
    has_mobile_css = '../css/mobile-optimized.css' in content or '../css/mobile-menu.css' in content
    has_main_css = '../css/main.css' in content
    has_layout_css = '../css/layout-fixes.css' in content
    
    # Check for full header (with nav-links)
    has_full_header = 'class="nav-links"' in content and 'id="navLinks"' in content
    
    # Check for hero section
    has_hero = '<section class="hero"' in content or '<section class="hero-section"' in content
    
    return {
        'exists': True,
        'has_header_css': has_header_css,
        'has_mobile_css': has_mobile_css,
        'has_main_css': has_main_css,
        'has_layout_css': has_layout_css,
        'has_full_header': has_full_header,
        'has_hero': has_hero,
        'filename': filepath.name
    }

def main():
    print("=" * 80)
    print("GRAMMAR PAGES CSS AND HEADER CHECK")
    print("=" * 80)
    print()
    
    issues_found = []
    
    for page in GRAMMAR_PAGES:
        filepath = ENGLISH_DIR / page
        result = check_page(filepath)
        
        if not result['exists']:
            print(f"❌ {page}: FILE NOT FOUND")
            issues_found.append(page)
            continue
        
        # Check if everything is OK
        all_ok = (result['has_header_css'] and 
                  result['has_mobile_css'] and 
                  result['has_main_css'] and 
                  result['has_layout_css'] and 
                  result['has_full_header'] and 
                  result['has_hero'])
        
        if all_ok:
            print(f"✅ {page}: All checks passed")
        else:
            print(f"⚠️  {page}:")
            if not result['has_header_css']:
                print(f"   - Missing header.css")
            if not result['has_mobile_css']:
                print(f"   - Missing mobile CSS")
            if not result['has_main_css']:
                print(f"   - Missing main.css")
            if not result['has_layout_css']:
                print(f"   - Missing layout-fixes.css")
            if not result['has_full_header']:
                print(f"   - Missing full header with navigation")
            if not result['has_hero']:
                print(f"   - Missing hero section")
            issues_found.append(page)
    
    print()
    print("=" * 80)
    print(f"SUMMARY: {len(GRAMMAR_PAGES)} pages checked, {len(issues_found)} pages need fixing")
    print("=" * 80)
    
    if issues_found:
        print("\nPages needing fixes:")
        for page in issues_found:
            print(f"  - {page}")

if __name__ == "__main__":
    main()
