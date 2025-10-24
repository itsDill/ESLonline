#!/usr/bin/env python3
"""
Ad Placement Script for ESLonline
Adds properly formatted Google AdSense ads to pages that need them
"""

import os
import re
from pathlib import Path

# Ad template - clean and well-formatted
AD_TEMPLATE = '''    <!-- Google AdSense -->
    <div class="ad-container" style="margin: 2rem auto; max-width: 100%; text-align: center;">
      <ins class="adsbygoogle"
           style="display: block; text-align: center;"
           data-ad-client="ca-pub-2456627863532019"
           data-ad-slot="1718707782"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
'''

def count_existing_ads(content):
    """Count existing ad placements in content"""
    return len(re.findall(r'<ins\s+class="adsbygoogle"', content, re.IGNORECASE))

def has_adsense_script(content):
    """Check if AdSense script is in head"""
    return 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js' in content

def add_adsense_script(content):
    """Add AdSense script to head if missing"""
    adsense_script = '''  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2456627863532019"
     crossorigin="anonymous"></script>
'''
    # Find </head> tag and insert before it
    if '</head>' in content and not has_adsense_script(content):
        content = content.replace('</head>', adsense_script + '</head>')
    return content

def add_ads_to_page(filepath, target_count=2):
    """Add ads to a page to reach target count"""
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        current_ads = count_existing_ads(content)
        
        if current_ads >= target_count:
            return 0, "Already has enough ads"
        
        ads_to_add = target_count - current_ads
        
        # Add AdSense script to head if missing
        content = add_adsense_script(content)
        
        # Strategy: Add ads at logical positions
        # 1. After main header/hero section
        # 2. In middle of content
        # 3. Before footer
        
        ads_added = 0
        
        # Try to find good insertion points
        insertion_patterns = [
            (r'</section>\s*<section', '</section>\n' + AD_TEMPLATE + '\n    <section'),  # Between sections
            (r'</main>\s*<footer', '</main>\n' + AD_TEMPLATE + '\n    <footer'),  # Before footer
            (r'<main[^>]*>', lambda m: m.group(0) + '\n' + AD_TEMPLATE),  # After main tag opens
        ]
        
        for pattern, replacement in insertion_patterns:
            if ads_added >= ads_to_add:
                break
                
            matches = list(re.finditer(pattern, content, re.IGNORECASE))
            
            if matches and ads_added < ads_to_add:
                # Add ad at first match
                if callable(replacement):
                    content = re.sub(pattern, replacement, content, count=1, flags=re.IGNORECASE)
                else:
                    content = re.sub(pattern, replacement, content, count=1, flags=re.IGNORECASE)
                ads_added += 1
        
        # If we still need more ads, try adding before closing main tag
        if ads_added < ads_to_add:
            pattern = r'</main>'
            if pattern in content:
                content = content.replace('</main>', AD_TEMPLATE + '\n    </main>', 1)
                ads_added += 1
        
        # Write back to file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return ads_added, "Success"
        
    except Exception as e:
        return 0, f"Error: {str(e)}"

def main():
    root_dir = "/Users/dillchalisas/ESLonline"
    
    # Pages that need ads (from audit)
    pages_needing_ads = [
        # Main pages
        '404.html',
        'contact.html',
        'cookies.html',
        'lessons.html',
        'login.html',
        'privacy.html',
        'register.html',
        'terms.html',
        
        # English section
        'english/busvocab.html',
        'english/conditionals.html',
        'english/passive.html',
        
        # Games section
        'games/balanceman.html',
        'games/memory-match.html',
        'games/picture-description.html',
        'games/quizchamp.html',
        'games/slingshot.html',
        'games/snakeslad.html',
        'games/story-builder.html',
        'games/twenty-questions.html',
        'games/uno.html',
        'games/whowants.html',
        
        # Coding section
        'coding/codingresources.html',
        'coding/lessons/lesson1.html',
        'coding/lessons/lesson2.html',
        'coding/lessons/lesson3.html',
        'coding/lessons/lesson4.html',
        
        # Blog section
        'blog/lesson-countries.html',
        'blog/lesson-speaking.html',
        'blog/lesson-technology.html',
    ]
    
    print("=" * 80)
    print("ADDING ADS TO ESLONLINE WEBSITE")
    print("=" * 80)
    
    total_added = 0
    success_count = 0
    
    for page in pages_needing_ads:
        filepath = os.path.join(root_dir, page)
        
        if not os.path.exists(filepath):
            print(f"⚠ SKIPPED: {page} (file not found)")
            continue
        
        ads_added, status = add_ads_to_page(filepath)
        total_added += ads_added
        
        if ads_added > 0:
            success_count += 1
            print(f"✓ {page:<50} +{ads_added} ads")
        else:
            print(f"  {page:<50} {status}")
    
    print("\n" + "=" * 80)
    print(f"SUMMARY: Added {total_added} ads to {success_count} pages")
    print("=" * 80)

if __name__ == '__main__':
    main()
