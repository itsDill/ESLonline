#!/usr/bin/env python3
"""
Add second ad to pages with only 1 ad
"""

import os
import re

AD_BLOCK = '''    <!-- Google AdSense -->
    <div class="ad-container" style="margin: 2rem auto; max-width: 100%; text-align: center; padding: 0 1rem;">
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

def add_second_ad(filepath):
    """Add a second ad to pages with only 1"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count existing ads
        existing = len(re.findall(r'<ins\s+class="adsbygoogle"', content, re.IGNORECASE))
        
        if existing != 1:
            return 0
        
        # Try to add before </body>
        body_close = content.rfind('</body>')
        if body_close > 0:
            content = content[:body_close] + '\n' + AD_BLOCK + '\n  ' + content[body_close:]
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return 1
        
        return 0
        
    except Exception as e:
        print(f"Error: {e}")
        return 0

def main():
    root = "/Users/dillchalisas/ESLonline"
    
    pages_with_one_ad = [
        'english/busvocab.html',
        'games/balanceman.html',
        'games/memory-match.html',
        'games/picture-description.html',
        'games/snakeslad.html',
        'games/uno.html',
        'coding/lessons/lesson1.html',
        'coding/lessons/lesson2.html',
        'coding/lessons/lesson3.html',
        'coding/lessons/lesson4.html',
        'blog/lesson-speaking.html',
    ]
    
    print("=" * 80)
    print("ADDING SECOND AD TO PAGES WITH ONLY 1 AD")
    print("=" * 80)
    
    total = 0
    
    for page in pages_with_one_ad:
        filepath = os.path.join(root, page)
        if os.path.exists(filepath):
            added = add_second_ad(filepath)
            if added > 0:
                print(f"✓ {page:<50} +1 ad")
                total += 1
            else:
                print(f"  {page:<50} failed")
        else:
            print(f"⚠ {page:<50} not found")
    
    print(f"\n{'=' * 80}")
    print(f"TOTAL: Added {total} ads")
    print("=" * 80)

if __name__ == '__main__':
    main()
