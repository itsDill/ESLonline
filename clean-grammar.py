#!/usr/bin/env python3
"""Remove all inline CSS from grammar.html"""

# Read the file
with open('/Users/dillchalisas/ESLonline/english/grammar.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the CSS link tags end and where proper breadcrumb starts
css_links_end = -1
proper_breadcrumb_start = -1

for i, line in enumerate(lines):
    if 'mobile-footer.css' in line:
        css_links_end = i
    if '<!-- Breadcrumb Structured Data -->' in line and i > 100:  # Second occurrence
        # Check if next line has proper script tag
        if i + 1 < len(lines) and 'script type="application/ld+json"' in lines[i+1]:
            # Check line after that has proper JSON
            if i + 2 < len(lines) and ('{' in lines[i+2] or '@context' in lines[i+2]):
                proper_breadcrumb_start = i
                break

print(f"CSS links end at line: {css_links_end + 1}")
print(f"Proper breadcrumb starts at line: {proper_breadcrumb_start + 1}")

if css_links_end != -1 and proper_breadcrumb_start != -1:
    # Keep everything up to and including CSS links, then skip to proper breadcrumb
    cleaned_lines = lines[:css_links_end + 1]
    cleaned_lines.append('\n')
    cleaned_lines.extend(lines[proper_breadcrumb_start:])
    
    # Write back
    with open('/Users/dillchalisas/ESLonline/english/grammar.html', 'w', encoding='utf-8') as f:
        f.writelines(cleaned_lines)
    
    print(f"✓ Removed {proper_breadcrumb_start - css_links_end - 1} lines of inline CSS")
    print("✓ grammar.html cleaned successfully")
else:
    print("✗ Could not find boundaries")
