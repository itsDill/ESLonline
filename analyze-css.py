#!/usr/bin/env python3
"""
Analyze CSS files for duplicates and overlapping styles
"""

import re
from pathlib import Path
from collections import defaultdict

CSS_DIR = Path("/Users/dillchalisas/ESLonline/css")

def extract_selectors(css_content):
    """Extract CSS selectors from content"""
    # Remove comments
    css_content = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
    
    # Find selectors (text before {)
    selectors = []
    matches = re.finditer(r'([^{}]+)\s*{', css_content)
    for match in matches:
        selector = match.group(1).strip()
        # Skip @media, @keyframes, etc
        if not selector.startswith('@'):
            selectors.append(selector)
    
    return selectors

def extract_rules(css_content):
    """Extract complete CSS rules (selector + declarations)"""
    css_content = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
    
    rules = {}
    matches = re.finditer(r'([^{}]+)\s*{([^}]+)}', css_content)
    for match in matches:
        selector = match.group(1).strip()
        declarations = match.group(2).strip()
        if not selector.startswith('@'):
            # Normalize declarations for comparison
            normalized = re.sub(r'\s+', ' ', declarations).strip()
            rules[selector] = normalized
    
    return rules

def analyze_duplicates():
    """Find duplicate selectors and rules across CSS files"""
    
    print("Analyzing CSS files for duplicates and overlaps...\n")
    
    # Core CSS files
    core_files = [
        'main.css',
        'header.css', 
        'hero-unified.css',
        'index-page.css',
        'mobile-optimized.css',
        'mobile-menu.css',
        'layout-fixes.css'
    ]
    
    # Track selectors across files
    selector_locations = defaultdict(list)
    rule_duplicates = defaultdict(list)
    
    all_files = list(CSS_DIR.glob("*.css"))
    
    print(f"Analyzing {len(all_files)} CSS files...\n")
    
    for css_file in all_files:
        try:
            content = css_file.read_text(encoding='utf-8')
            
            # Extract selectors
            selectors = extract_selectors(content)
            for selector in selectors:
                selector_locations[selector].append(css_file.name)
            
            # Extract complete rules
            rules = extract_rules(content)
            for selector, declarations in rules.items():
                rule_key = f"{selector}::{declarations}"
                rule_duplicates[rule_key].append(css_file.name)
                
        except Exception as e:
            print(f"Error reading {css_file.name}: {e}")
    
    # Report duplicates
    print("="*80)
    print("DUPLICATE SELECTORS (same selector in multiple files)")
    print("="*80 + "\n")
    
    duplicate_selectors = {sel: files for sel, files in selector_locations.items() if len(files) > 1}
    
    if duplicate_selectors:
        # Group by selector type
        common_selectors = {}
        for selector, files in sorted(duplicate_selectors.items()):
            if len(files) > 3:  # Show only selectors in 4+ files
                common_selectors[selector] = files
        
        if common_selectors:
            print(f"Found {len(common_selectors)} selectors appearing in 4+ files:\n")
            for selector, files in sorted(common_selectors.items(), key=lambda x: len(x[1]), reverse=True)[:20]:
                print(f"  {selector}")
                print(f"    → In {len(files)} files: {', '.join(files[:5])}")
                if len(files) > 5:
                    print(f"      ... and {len(files)-5} more")
                print()
        else:
            print("No selectors appear in 4+ files (good!)\n")
    else:
        print("No duplicate selectors found (perfect!)\n")
    
    # Report exact duplicate rules
    print("="*80)
    print("EXACT DUPLICATE RULES (same selector + same styles in multiple files)")
    print("="*80 + "\n")
    
    exact_duplicates = {rule: files for rule, files in rule_duplicates.items() if len(files) > 1}
    
    if exact_duplicates:
        print(f"Found {len(exact_duplicates)} exact duplicate rules:\n")
        
        # Show most common duplicates
        sorted_dupes = sorted(exact_duplicates.items(), key=lambda x: len(x[1]), reverse=True)[:15]
        
        for rule_key, files in sorted_dupes:
            selector, declarations = rule_key.split('::', 1)
            print(f"  {selector} {{ ... }}")
            print(f"    → In {len(files)} files: {', '.join(files[:3])}")
            if len(files) > 3:
                print(f"      ... and {len(files)-3} more")
            # Show first 100 chars of declarations
            decl_preview = declarations[:100] + "..." if len(declarations) > 100 else declarations
            print(f"    → {decl_preview}")
            print()
    else:
        print("No exact duplicate rules found!\n")
    
    # Analyze core vs page-specific overlap
    print("="*80)
    print("CORE CSS vs PAGE-SPECIFIC OVERLAP")
    print("="*80 + "\n")
    
    core_selectors = set()
    for core_file in core_files:
        path = CSS_DIR / core_file
        if path.exists():
            content = path.read_text(encoding='utf-8')
            selectors = extract_selectors(content)
            core_selectors.update(selectors)
    
    page_files = [f for f in all_files if f.name.endswith('-page.css')]
    
    overlaps = defaultdict(list)
    for page_file in page_files:
        content = page_file.read_text(encoding='utf-8')
        selectors = set(extract_selectors(content))
        overlap = selectors & core_selectors
        if overlap:
            overlaps[page_file.name] = list(overlap)
    
    if overlaps:
        print(f"Found {len(overlaps)} page-specific CSS files with core CSS overlaps:\n")
        
        for filename in sorted(overlaps.keys())[:10]:
            overlap_list = overlaps[filename]
            print(f"  {filename}: {len(overlap_list)} overlapping selectors")
            if len(overlap_list) <= 5:
                for sel in overlap_list[:5]:
                    print(f"    - {sel}")
            else:
                print(f"    Top 5: {', '.join(overlap_list[:5])}")
            print()
    else:
        print("No overlaps between core CSS and page-specific CSS (excellent!)\n")
    
    # Summary stats
    print("="*80)
    print("SUMMARY")
    print("="*80 + "\n")
    
    total_selectors = len(selector_locations)
    duplicate_count = len(duplicate_selectors)
    exact_dupe_count = len(exact_duplicates)
    
    print(f"Total unique selectors: {total_selectors}")
    print(f"Selectors appearing in multiple files: {duplicate_count}")
    print(f"Exact duplicate rules: {exact_dupe_count}")
    print(f"Page-specific files: {len(page_files)}")
    print(f"Core CSS files analyzed: {len([f for f in core_files if (CSS_DIR/f).exists()])}")
    
    # Calculate potential savings
    if exact_dupe_count > 0:
        print(f"\n⚠️  Recommendation: Consider consolidating {exact_dupe_count} duplicate rules to core CSS")
    else:
        print(f"\n✅ No duplicate rules - CSS is well organized!")

if __name__ == "__main__":
    analyze_duplicates()
