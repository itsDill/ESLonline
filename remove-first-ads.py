import re
from pathlib import Path

def remove_first_ad(file_path):
    """Remove the first ad from a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Pattern to match AdSense ad blocks
        ad_pattern = r'<ins\s+class="adsbygoogle"[^>]*>.*?</ins>\s*<script[^>]*>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle[^)]*\)\.push\([^)]*\);\s*</script>'
        
        # Find first ad
        match = re.search(ad_pattern, content, re.DOTALL)
        
        if match:
            # Remove the first ad
            content = content[:match.start()] + content[match.end():]
            
            # Write back
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True
        
        return False
    
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

# Files with above-fold ads
files_to_fix = [
    'ad-snippets.html',
    'english/busvocab.html',
    'idioms-compact.html',
    'idioms-grid-section.html',
    'tools/random.html',
    'tools/spin.html'
]

print("Removing first ad from files with above-the-fold ads...\n")

fixed_count = 0
for file_path in files_to_fix:
    print(f"📄 {file_path}")
    if remove_first_ad(file_path):
        print(f"   ✅ Removed first ad")
        fixed_count += 1
    else:
        print(f"   ⚠️  No ad found to remove")
    print()

print(f"{'='*60}")
print(f"✅ Fixed {fixed_count} files")
print(f"{'='*60}")
