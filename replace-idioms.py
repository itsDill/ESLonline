#!/usr/bin/env python3
"""Replace the idioms section in idioms.html"""

# Read the original file
with open('/Users/dillchalisas/ESLonline/english/idioms.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Read the new idioms grid section
with open('/Users/dillchalisas/ESLonline/idioms-grid-section.html', 'r', encoding='utf-8') as f:
    new_idioms = f.read()

# Find the start and end markers
start_marker = '        <!-- Basic Idioms (1-15) -->'
end_marker = '        <!-- Interactive Quiz Section -->'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error: Could not find markers. start={start_idx}, end={end_idx}")
    exit(1)

# Replace the section
before = content[:start_idx]
after = content[end_idx:]
new_content = before + '        <!-- Basic Idioms (1-15) -->\n' + new_idioms + '\n' + after

# Write the new file
with open('/Users/dillchalisas/ESLonline/english/idioms.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"✅ Successfully replaced idioms section!")
print(f"Original length: {len(content)} characters")
print(f"New length: {len(new_content)} characters")
print(f"Difference: {len(new_content) - len(content)} characters")
