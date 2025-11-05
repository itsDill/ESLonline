import re
from pathlib import Path
import random

def rotate_ad_slots(file_path):
    """Rotate overused ad slot to other available slots"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Available ad slots
        alternate_slots = ['7015224277', '4353992878', '7208398685']
        overused_slot = '1718707782'
        
        # Find all instances of the overused slot
        pattern = rf'data-ad-slot="{overused_slot}"'
        matches = list(re.finditer(pattern, content))
        
        if len(matches) <= 1:
            return False  # Keep at least one instance or skip if none
        
        # Replace every other instance with an alternate slot
        replacements = 0
        offset = 0
        
        for i, match in enumerate(matches):
            # Skip first instance, rotate the rest
            if i > 0 and i % 2 == 1:  # Replace every other ad
                new_slot = alternate_slots[i % len(alternate_slots)]
                start = match.start() + offset
                end = match.end() + offset
                
                old_text = f'data-ad-slot="{overused_slot}"'
                new_text = f'data-ad-slot="{new_slot}"'
                
                content = content[:start] + new_text + content[end:]
                offset += len(new_text) - len(old_text)
                replacements += 1
        
        if replacements > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return replacements
        
        return 0
    
    except Exception as e:
        return 0

# Find HTML files with multiple ads
html_files = list(Path('.').rglob('*.html'))
total_rotated = 0
files_updated = 0

print("Rotating ad slots for better performance...\n")

for html_file in html_files:
    rotations = rotate_ad_slots(html_file)
    if rotations:
        print(f"✅ {html_file}: Rotated {rotations} ad slots")
        total_rotated += rotations
        files_updated += 1

print(f"\n{'='*60}")
print(f"✅ Optimized {files_updated} files")
print(f"   Total ad slots rotated: {total_rotated}")
print(f"   Better ad diversity = Better CPM!")
print(f"{'='*60}")
