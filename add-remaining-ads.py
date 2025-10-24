#!/usr/bin/env python3
"""
Add ads to remaining pages that need them
"""

import os
import re

AD_SCRIPT = '''  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2456627863532019"
     crossorigin="anonymous"></script>
'''

AD_BLOCK = '''    <!-- Google AdSense -->
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

def add_ads_to_file(filepath, ad_positions=2):
    """Add ads to a file at strategic positions"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count existing ads
        existing_ads = len(re.findall(r'<ins\s+class="adsbygoogle"', content, re.IGNORECASE))
        
        if existing_ads >= ad_positions:
            return 0, "Already has enough ads"
        
        # Add AdSense script if missing
        if 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js' not in content:
            # Add after <head> tag
            content = content.replace('<head>', '<head>\n' + AD_SCRIPT, 1)
        
        ads_needed = ad_positions - existing_ads
        ads_added = 0
        
        # Strategy 1: Add after <body> or after header/nav
        if ads_added < ads_needed:
            # Look for closing </nav> or </header>
            patterns = [r'</nav>\s*\n', r'</header>\s*\n']
            for pattern in patterns:
                if re.search(pattern, content) and ads_added < ads_needed:
                    content = re.sub(pattern, lambda m: m.group(0) + '\n' + AD_BLOCK, content, count=1)
                    ads_added += 1
                    break
        
        # Strategy 2: Add before footer
        if ads_added < ads_needed and '</footer>' in content:
            content = content.replace('<footer>', AD_BLOCK + '\n    <footer>', 1)
            ads_added += 1
        
        # Strategy 3: Add in the middle of content
        if ads_added < ads_needed:
            # Find middle section tag
            sections = list(re.finditer(r'</section>', content))
            if len(sections) > 1 and ads_added < ads_needed:
                # Insert after first section
                pos = sections[0].end()
                content = content[:pos] + '\n' + AD_BLOCK + content[pos:]
                ads_added += 1
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return ads_added, "Success"
        
    except Exception as e:
        return 0, f"Error: {str(e)}"

def main():
    root = "/Users/dillchalisas/ESLonline"
    
    # Files that still need ads
    files_to_process = [
        ('register.html', 2),
        ('english/busvocab.html', 1),
        ('games/balanceman.html', 2),
        ('games/memory-match.html', 2),
        ('games/picture-description.html', 2),
        ('games/quizchamp.html', 2),
        ('games/slingshot.html', 2),
        ('games/snakeslad.html', 2),
        ('games/story-builder.html', 2),
        ('games/twenty-questions.html', 2),
        ('games/uno.html', 2),
        ('games/whowants.html', 2),
        ('coding/lessons/lesson1.html', 1),
        ('coding/lessons/lesson2.html', 1),
        ('coding/lessons/lesson3.html', 1),
        ('coding/lessons/lesson4.html', 1),
        ('blog/lesson-speaking.html', 2),
        ('blog/lesson-technology.html', 2),
    ]
    
    print("=" * 80)
    print("ADDING REMAINING ADS")
    print("=" * 80)
    
    total_added = 0
    
    for filename, target_ads in files_to_process:
        filepath = os.path.join(root, filename)
        
        if not os.path.exists(filepath):
            print(f"⚠ SKIP: {filename} (not found)")
            continue
        
        added, status = add_ads_to_file(filepath, target_ads)
        total_added += added
        
        if added > 0:
            print(f"✓ {filename:<50} +{added} ads")
        else:
            print(f"  {filename:<50} {status}")
    
    print(f"\n{'=' * 80}")
    print(f"TOTAL: Added {total_added} ads")
    print("=" * 80)

if __name__ == '__main__':
    main()
