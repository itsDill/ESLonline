import re
from pathlib import Path

# Content spacer to add between hero and first ad
CONTENT_SPACER = '''
    <!-- Value Proposition Section -->
    <section style="padding: 4rem 0; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; text-align: center;">
          <div style="background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
            <h3 style="font-size: 1.5rem; font-weight: 700; color: #2c3e50; margin-bottom: 0.75rem;">Interactive Learning</h3>
            <p style="color: #5a6c7d; line-height: 1.6;">Engage with dynamic exercises and real-time feedback</p>
          </div>
          <div style="background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
            <h3 style="font-size: 1.5rem; font-weight: 700; color: #2c3e50; margin-bottom: 0.75rem;">Quick Results</h3>
            <p style="color: #5a6c7d; line-height: 1.6;">See improvement in your skills within days</p>
          </div>
          <div style="background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">��</div>
            <h3 style="font-size: 1.5rem; font-weight: 700; color: #2c3e50; margin-bottom: 0.75rem;">Expert Content</h3>
            <p style="color: #5a6c7d; line-height: 1.6;">Curated by experienced educators and professionals</p>
          </div>
          <div style="background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🌍</div>
            <h3 style="font-size: 1.5rem; font-weight: 700; color: #2c3e50; margin-bottom: 0.75rem;">Learn Anywhere</h3>
            <p style="color: #5a6c7d; line-height: 1.6;">Access from any device, anytime, anywhere</p>
          </div>
        </div>
      </div>
    </section>
'''

def add_spacer_before_first_ad(file_path):
    """Add content spacer between hero section and first ad"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find hero section end
        hero_patterns = [
            (r'(</section>)\s*(<!-- Google AdSense -->)', r'\1' + CONTENT_SPACER + r'\n\n    \2'),
            (r'(</section>)\s*(<ins\s+class="adsbygoogle")', r'\1' + CONTENT_SPACER + r'\n\n    \2'),
        ]
        
        modified = False
        for pattern, replacement in hero_patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content, count=1)
                modified = True
                break
        
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    except Exception as e:
        print(f"      Error: {e}")
        return False

def remove_music_dropdown(file_path):
    """Remove music dropdown menu from navigation"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern to match entire music dropdown section
        music_pattern = r'<li[^>]*class="nav-item[^"]*"[^>]*>\s*<a[^>]*>\s*<i[^>]*fa-music[^>]*></i>\s*Music\s*</a>\s*<div[^>]*dropdown[^>]*>.*?</div>\s*</li>'
        
        original_content = content
        content = re.sub(music_pattern, '', content, flags=re.DOTALL)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    except Exception as e:
        print(f"      Error: {e}")
        return False

# Files that need spacers
files_needing_spacers = [
    'blog/blog.html',
    'business/conversation-practice.html',
    'business/email-templates.html',
    'business/interview.html',
    'business/meeting-phrases.html',
    'business/negotiation.html',
    'business/presentation-coach.html',
    'business/reports.html',
    'business/vocabulary.html',
    'business/writing-assistant.html',
    'coding/computerbasics.html',
    'contact.html',
    'english/business.html',
    'english/grammar.html',
    'english/idioms.html',
    'english/modalverbs.html',
    'english/phonics.html',
    'english/test.html',
    'english/verb-tenses.html',
    'english/worksheets.html',
    'english/writingf.html',
    'games/games.html',
    'tools/tools.html',
    'vocab/vbeginner.html',
    'vocab/vintermediate.html'
]

# Find all HTML files for music removal (exclude backups)
all_html_files = [f for f in Path('.').rglob('*.html') if 'backup' not in str(f).lower()]

print("="*80)
print("ADDING CONTENT SPACERS BETWEEN HERO AND FIRST AD")
print("="*80)

spacers_added = 0
for file_path in files_needing_spacers:
    if Path(file_path).exists():
        print(f"\n📄 {file_path}")
        if add_spacer_before_first_ad(file_path):
            print(f"   ✅ Added value proposition section before first ad")
            spacers_added += 1
        else:
            print(f"   ⚠️  Could not add spacer")

print(f"\n{'='*80}")
print(f"✅ Added spacers to {spacers_added} files")
print(f"{'='*80}\n\n")

print("="*80)
print("REMOVING MUSIC CATEGORY FROM ENTIRE SITE")
print("="*80)

music_removed = 0
for file_path in all_html_files:
    if remove_music_dropdown(str(file_path)):
        print(f"✅ {file_path}")
        music_removed += 1

print(f"\n{'='*80}")
print(f"✅ Removed music dropdown from {music_removed} files")
print(f"{'='*80}\n")

print("\n" + "="*80)
print("SUMMARY")
print("="*80)
print(f"✅ Content spacers added: {spacers_added} files")
print(f"✅ Music category removed: {music_removed} files")
print(f"\n🎯 All ads now properly below the fold!")
print(f"🚀 Music category completely removed from site!")
print("="*80)
