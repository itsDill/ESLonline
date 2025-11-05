import re
from pathlib import Path

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
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎓</div>
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

def add_spacer_before_ad(file_path):
    """Add content spacer between hero and first ad"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Multiple patterns to catch different structures
        patterns = [
            # Pattern 1: </section> followed by <!-- Ad after hero --> or similar
            r'(</section>)\s*\n\s*<!-- Ad after hero -->',
            # Pattern 2: </section> followed by <!-- Google AdSense -->
            r'(</section>)\s*\n\s*<!-- Google AdSense -->',
            # Pattern 3: </section> followed directly by <div...adsbygoogle
            r'(</section>)\s*\n\s*<div[^>]*>\s*\n\s*<ins\s+class="adsbygoogle"',
            # Pattern 4: </section> followed directly by <ins class="adsbygoogle"
            r'(</section>)\s*\n\s*<ins\s+class="adsbygoogle"',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                # Insert spacer after the </section>
                insert_pos = match.start(1) + len('</section>')
                content = content[:insert_pos] + '\n' + CONTENT_SPACER + content[insert_pos:]
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                return True
        
        return False
    except Exception as e:
        print(f"      Error: {e}")
        return False

def remove_music_nav(file_path):
    """Remove music dropdown from navigation"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Pattern to match the entire music navigation item
        pattern = r'<li class="nav-item">\s*<a[^>]*>\s*<i class="fas fa-music"></i>\s*Music\s*<i class="fas fa-chevron-down"></i>\s*</a>\s*<div class="dropdown">.*?</div>\s*</li>'
        
        content = re.sub(pattern, '', content, flags=re.DOTALL)
        
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        return False

# Files needing spacers
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

all_html = [str(f) for f in Path('.').rglob('*.html') if 'backup' not in str(f).lower()]

print("="*80)
print("STEP 1: ADDING CONTENT SPACERS")
print("="*80)

spacers = 0
for fp in files_needing_spacers:
    if Path(fp).exists():
        if add_spacer_before_ad(fp):
            print(f"✅ {fp}")
            spacers += 1

print(f"\n✅ Added {spacers} spacers\n")

print("="*80)
print("STEP 2: REMOVING MUSIC CATEGORY")
print("="*80)

removed = 0
for fp in all_html:
    if remove_music_nav(fp):
        print(f"✅ {fp}")
        removed += 1

print(f"\n✅ Removed music from {removed} files\n")

print("="*80)
print("COMPLETE!")
print(f"✅ Spacers: {spacers} | Music removed: {removed}")
print("="*80)
