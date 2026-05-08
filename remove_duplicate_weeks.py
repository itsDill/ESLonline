#!/usr/bin/env python3
"""
Remove duplicate Weeks 1-7 content from student dashboard.
Keeps only the first Week 8 section and removes duplicate old content.
"""

def remove_duplicate_content(input_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find all occurrences of Week 8 header
    week8_indices = []
    for i, line in enumerate(lines):
        if 'Week 8: Unit 8 - Employment' in line and '<h3>' in line:
            week8_indices.append(i)
    
    print(f"Found {len(week8_indices)} Week 8 headers at lines: {[idx+1 for idx in week8_indices]}")
    
    if len(week8_indices) != 2:
        print(f"Expected 2 Week 8 headers, found {len(week8_indices)}. Aborting.")
        return
    
    first_week8 = week8_indices[0]
    second_week8 = week8_indices[1]
    
    # Find the start of the duplicate section (after first Week 8's closing </div>)
    # Look for where the first Week 8 week-header div closes
    duplicate_start = None
    for i in range(first_week8, second_week8):
        # Look for the closing of the week-header div followed by week-content div
        if '</div>' in lines[i] and 'week-header' in lines[i-3:i+1]:  # Heuristic
            # Check if week-content follows soon
            found_content = False
            for j in range(i, min(i+10, len(lines))):
                if 'week-content' in lines[j] or '<div class="week-section">' in lines[j]:
                    found_content = True
                    duplicate_start = j
                    break
            if found_content and j < i + 5:
                continue  # This is likely the proper Week 8 content start
            elif found_content:
                duplicate_start = j
                break
    
    # Simpler approach: find the line after "What are you doing right now?" where old content starts
    for i in range(first_week8, second_week8):
        if 'What are you doing right now?' in lines[i]:
            # The next meaningful content line after this should be Week 8 content
            # But if we find old Week 1 content (like "Word Stress" or "JA-pan"), that's duplicate
            for j in range(i+1, min(i+20, second_week8)):
                if 'JA-pan vs ja-PA-nese' in lines[j] or 'Word Stress' in lines[j]:
                    duplicate_start = j - 3  # Go back a bit to get the opening div
                    break
            if duplicate_start:
                break
    
    # Find where the duplicate section ends (just before second Week 8)
    # Look backwards from second Week 8 to find the closing </div></div>
    duplicate_end = None
    for i in range(second_week8-1, max(second_week8-20, 0), -1):
        if '</div>' in lines[i]:
            # Check if this closes a week-content
            found_closing = False
            for j in range(max(0, i-10), i):
                if '</div>' in lines[j] and lines[j].strip() == '</div>':
                    duplicate_end = i + 1  # Line after the closing divs
                    found_closing = True
                    break
            if found_closing:
                break
    
    # Fallback: use the line just before "<!-- Week 8 -->" comment before second header
    if not duplicate_end:
        for i in range(second_week8-1, max(second_week8-10, 0), -1):
            if '<!-- Week 8 -->' in lines[i]:
                duplicate_end = i
                break
    
    print(f"Duplicate content identified:")
    print(f"  First Week 8 header: line {first_week8+1}")
    print(f"  Duplicate starts around: line {duplicate_start+1 if duplicate_start else '?'}")
    print(f"  Duplicate ends at: line {duplicate_end if duplicate_end else '?'}")
    print(f"  Second Week 8 header: line {second_week8+1}")
    
    if not duplicate_start or not duplicate_end:
        print("Could not reliably identify duplicate boundaries. Aborting.")
        return
    
    # Create new file content: keep before duplicate, skip duplicate, keep from second Week 8
    new_lines = lines[:duplicate_start] + lines[duplicate_end:]
    
    # Write back
    with open(input_file, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"\nSuccess! Removed {duplicate_end - duplicate_start} lines of duplicate content.")
    print(f"New file has {len(new_lines)} lines (was {len(lines)} lines).")

if __name__ == '__main__':
    remove_duplicate_content('/Users/dillchalisas/ESLonline/dash/student-noonim.html')
