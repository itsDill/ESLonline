#!/usr/bin/env python3
"""
Script to restructure idioms.html:
1. Convert idioms to compact 3-column grid format
2. Add ad boxes after every 10th idiom
"""

import re

# Read the file
with open('/Users/dillchalisas/ESLonline/english/idioms.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all idiom cards with their content
idiom_pattern = r'<div class="idiom-card">(.*?)</div>\s*(?=<div class="idiom-card"|<!-- |</div>)'
idioms = re.findall(idiom_pattern, content, re.DOTALL)

print(f"Found {len(idioms)} idiom cards")

# Function to extract idiom data
def extract_idiom_data(idiom_html, index):
    # Extract title
    title_match = re.search(r'<h3 class="idiom-title">(.+?)</h3>', idiom_html)
    title = title_match.group(1) if title_match else f"Idiom {index}"
    
    # Extract difficulty
    diff_match = re.search(r'<span class="difficulty-badge ([^"]+)">', idiom_html)
    difficulty = diff_match.group(1) if diff_match else "beginner"
    
    # Extract meaning
    meaning_match = re.search(r'<strong>Meaning:</strong>\s*(.+?)(?:</div>|<div)', idiom_html, re.DOTALL)
    meaning = meaning_match.group(1).strip() if meaning_match else "Definition not found"
    meaning = re.sub(r'<[^>]+>', '', meaning).strip()  # Remove HTML tags
    
    # Extract first example
    example_match = re.search(r'<div class="example-item">"(.+?)"</div>', idiom_html)
    example = example_match.group(1) if example_match else "Example not found"
    
    # Determine emoji
    emoji = "🟢" if difficulty == "beginner" else ("🟡" if difficulty == "intermediate" else "🔴")
    
    return {
        'title': title,
        'difficulty': difficulty,
        'emoji': emoji,
        'meaning': meaning,
        'example': example,
        'index': index
    }

# Create compact idiom HTML
def create_compact_idiom(data):
    return f'''          <div class="idiom-card" data-difficulty="{data['difficulty']}">
            <h3 class="idiom-title">{data['title']}</h3>
            <span class="difficulty-badge {data['difficulty']}">{data['emoji']} {data['difficulty'].capitalize()}</span>
            <button class="reveal-btn" onclick="revealAnswer({data['index']})">Reveal Meaning</button>
            <div class="answer-section" id="answer-{data['index']}">
              <p><strong>Meaning:</strong> {data['meaning']}</p>
              <p><em>"{data['example']}"</em></p>
            </div>
          </div>
'''

# Create ad box HTML
def create_ad_box():
    return '''          <div class="ad-grid-box">
            <ins class="adsbygoogle"
                 style="display: block; width: 100%; max-width: 336px; min-height: 280px;"
                 data-ad-client="ca-pub-2456627863532019"
                 data-ad-slot="7015224277"
                 data-ad-format="rectangle"></ins>
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          </div>
'''

# Process idioms
compact_idioms = []
for i, idiom in enumerate(idioms[:50], 1):  # Process first 50 idioms
    data = extract_idiom_data(idiom, i)
    compact_idioms.append(create_compact_idiom(data))
    
    # Add ad box after every 10th idiom
    if i % 10 == 0 and i < 50:
        compact_idioms.append(create_ad_box())

# Join all idioms
all_idioms_html = '\n'.join(compact_idioms)

print(f"Created {len(compact_idioms)} items (idioms + ads)")

# Write the compacted idioms to a new file
with open('/Users/dillchalisas/ESLonline/idioms-compact.html', 'w', encoding='utf-8') as f:
    f.write(all_idioms_html)

print("✅ Written compact idioms to idioms-compact.html")
print(f"Total length: {len(all_idioms_html)} characters")
