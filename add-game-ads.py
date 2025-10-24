#!/usr/bin/env python3
"""
Add ads to game pages with simple structure
"""

import os
import re

AD_BLOCK = '''    <!-- Google AdSense -->
    <div class="ad-container" style="margin: 1rem auto; max-width: 100%; text-align: center; padding: 0 1rem;">
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

def add_game_ads(filepath):
    """Add ads at the beginning and end of body"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count existing ads
        existing = len(re.findall(r'<ins\s+class="adsbygoogle"', content, re.IGNORECASE))
        
        if existing >= 2:
            return 0
        
        ads_added = 0
        
        # Add after <body> tag
        if existing == 0:
            body_match = re.search(r'<body[^>]*>\s*\n', content)
            if body_match:
                pos = body_match.end()
                content = content[:pos] + AD_BLOCK + '\n' + content[pos:]
                ads_added += 1
        
        # Add before </body> tag
        if ads_added < (2 - existing):
            body_close = content.rfind('</body>')
            if body_close > 0:
                # Insert before </body>
                content = content[:body_close] + '\n' + AD_BLOCK + '\n  ' + content[body_close:]
                ads_added += 1
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return ads_added
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return 0

def main():
    root = "/Users/dillchalisas/ESLonline/games"
    
    games = [
        'slingshot.html',
        'story-builder.html',
        'twenty-questions.html',
        'whowants.html',
    ]
    
    print("=" * 80)
    print("ADDING ADS TO REMAINING GAME PAGES")
    print("=" * 80)
    
    total = 0
    
    for game in games:
        filepath = os.path.join(root, game)
        if os.path.exists(filepath):
            added = add_game_ads(filepath)
            if added > 0:
                print(f"✓ {game:<40} +{added} ads")
                total += added
            else:
                print(f"  {game:<40} already has ads")
        else:
            print(f"⚠ {game:<40} not found")
    
    print(f"\n{'=' * 80}")
    print(f"TOTAL: Added {total} ads")
    print("=" * 80)

if __name__ == '__main__':
    main()
