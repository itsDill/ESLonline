#!/usr/bin/env python3
"""
Ad Placement Auto-Fixer
Automatically fixes critical ad placement issues for optimal RPM
"""

import os
import re
from pathlib import Path
import shutil
from datetime import datetime

class AdPlacementFixer:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)
        self.fixed_files = []
        self.backup_dir = self.root_dir / 'ad-fix-backups' / datetime.now().strftime('%Y%m%d_%H%M%S')
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        
    def fix_critical_issues(self, file_list=None):
        """Fix all critical ad placement issues"""
        print("🔧 Starting Automated Ad Placement Fixes...")
        print("=" * 70)
        
        if file_list:
            files_to_fix = [self.root_dir / f for f in file_list]
        else:
            # If no list provided, scan for files with issues
            files_to_fix = self._find_files_with_issues()
        
        for file_path in files_to_fix:
            if file_path.exists():
                self._fix_file(file_path)
        
        self._print_summary()
    
    def _find_files_with_issues(self):
        """Find files with ad placement issues"""
        html_files = list(self.root_dir.rglob('*.html'))
        # Exclude backup and example files
        html_files = [f for f in html_files if not any(x in str(f) for x in ['.backup', 'example', 'test-', 'debug-', 'SECURITY_TEMPLATE', 'ad-fix-backups'])]
        
        files_with_issues = []
        for file_path in html_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if 'adsbygoogle' not in content:
                    continue
                
                # Check for ads before hero
                hero_match = re.search(r'<section[^>]*class=["\'].*?hero.*?["\']', content, re.IGNORECASE)
                ad_match = re.search(r'<ins[^>]*class=["\'].*?adsbygoogle.*?["\']', content, re.IGNORECASE)
                
                if hero_match and ad_match and ad_match.start() < hero_match.start():
                    files_with_issues.append(file_path)
                    
            except Exception as e:
                print(f"⚠️  Error checking {file_path}: {e}")
        
        return files_with_issues
    
    def _fix_file(self, file_path):
        """Fix ad placement issues in a single file"""
        try:
            # Create backup
            backup_path = self.backup_dir / file_path.relative_to(self.root_dir)
            backup_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file_path, backup_path)
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Fix 1: Move ads that appear before hero section
            content = self._move_ad_after_hero(content)
            
            # Fix 2: Add proper margins to ads
            content = self._fix_ad_margins(content)
            
            # Fix 3: Ensure responsive ads
            content = self._ensure_responsive_ads(content)
            
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                self.fixed_files.append(file_path.relative_to(self.root_dir))
                print(f"✅ Fixed: {file_path.relative_to(self.root_dir)}")
            
        except Exception as e:
            print(f"❌ Error fixing {file_path}: {e}")
    
    def _move_ad_after_hero(self, content):
        """Move ads that appear before hero to after hero"""
        # Find hero section
        hero_match = re.search(r'(<section[^>]*class=["\'].*?hero.*?["\'][^>]*>.*?</section>)', 
                              content, re.IGNORECASE | re.DOTALL)
        if not hero_match:
            return content
        
        hero_section = hero_match.group(1)
        hero_end = hero_match.end()
        
        # Find all ads before hero
        ads_before_hero = []
        for match in re.finditer(r'((?:<div[^>]*>[\s\n]*)?<ins[^>]*class=["\'].*?adsbygoogle.*?["\'][^>]*>.*?</ins>[\s\n]*<script>[\s\n]*\(adsbygoogle = window\.adsbygoogle \|\| \[\]\)\.push\(\{\}\);[\s\n]*</script>(?:[\s\n]*</div>)?)', 
                                content[:hero_match.start()], re.IGNORECASE | re.DOTALL):
            ads_before_hero.append(match.group(1))
        
        if not ads_before_hero:
            return content
        
        # Remove ads from before hero
        for ad in ads_before_hero:
            content = content.replace(ad, '', 1)
        
        # Create properly formatted ad after hero
        ad_after_hero = '''
    <!-- Ad after hero -->
    <div style="text-align: center; margin: 2rem 0; padding: 1rem">
      <ins
        class="adsbygoogle"
        style="display: block"
        data-ad-client="ca-pub-2456627863532019"
        data-ad-slot="1718707782"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
'''
        
        # Find hero section again (positions may have changed)
        hero_match = re.search(r'(<section[^>]*class=["\'].*?hero.*?["\'][^>]*>.*?</section>)', 
                              content, re.IGNORECASE | re.DOTALL)
        
        if hero_match:
            # Check if ad already exists after hero
            post_hero = content[hero_match.end():hero_match.end()+500]
            if 'adsbygoogle' in post_hero:
                return content
            
            # Insert ad after hero
            content = content[:hero_match.end()] + ad_after_hero + content[hero_match.end():]
        
        return content
    
    def _fix_ad_margins(self, content):
        """Ensure all ads have proper margins for viewability"""
        # Fix ads with margin: 0
        content = re.sub(
            r'(<ins[^>]*class=["\'].*?adsbygoogle.*?["\'][^>]*style=["\'][^"\']*?)margin:\s*0([^"\']*["\'])',
            r'\1margin: 2rem 0\2',
            content,
            flags=re.IGNORECASE
        )
        
        # Add margin to ads that don't have any
        def add_margin(match):
            ins_tag = match.group(1)
            if 'margin' not in ins_tag.lower():
                # Add margin if style exists
                if 'style=' in ins_tag:
                    ins_tag = re.sub(
                        r'style=["\']([^"\']*)["\']',
                        r'style="\1; margin: 2rem 0"',
                        ins_tag
                    )
                else:
                    ins_tag = ins_tag.replace('>', ' style="margin: 2rem 0">', 1)
            return ins_tag
        
        content = re.sub(
            r'(<ins[^>]*class=["\'].*?adsbygoogle.*?["\'][^>]*>)',
            add_margin,
            content,
            flags=re.IGNORECASE
        )
        
        return content
    
    def _ensure_responsive_ads(self, content):
        """Ensure all ads have responsive flag"""
        def add_responsive(match):
            ins_tag = match.group(1)
            if 'data-full-width-responsive' not in ins_tag:
                ins_tag = ins_tag.replace('>', ' data-full-width-responsive="true">', 1)
            return ins_tag
        
        content = re.sub(
            r'(<ins[^>]*class=["\'].*?adsbygoogle.*?["\'][^>]*>)',
            add_responsive,
            content,
            flags=re.IGNORECASE
        )
        
        return content
    
    def _print_summary(self):
        """Print summary of fixes"""
        print("\n" + "=" * 70)
        print("📊 FIX SUMMARY")
        print("=" * 70)
        print(f"Files Fixed: {len(self.fixed_files)}")
        print(f"Backups Saved To: {self.backup_dir}")
        print("=" * 70)
        
        if self.fixed_files:
            print("\n✅ Fixed Files:")
            for file in self.fixed_files:
                print(f"  • {file}")
            
            print("\n💰 Expected RPM Improvements:")
            print("  • Ads now placed after hero (prime viewability)")
            print("  • Better margins for improved viewability score")
            print("  • All ads responsive for better mobile performance")
            print("  • Compliance with AdSense placement policies")
            
        print("\n✅ Fixes complete!")
        print(f"💾 Original files backed up to: {self.backup_dir.relative_to(self.root_dir)}")


def main():
    # Critical files that need fixing
    critical_files = [
        "business/conversation-practice.html",
        "business/email-templates.html",
        "business/interview.html",
        "business/meeting-phrases.html",
        "business/negotiation.html",
        "business/presentation-coach.html",
        "business/reports.html",
        "business/vocabulary.html",
        "business/writing-assistant.html",
        "coding/computerbasics.html",
        "english/modalverbs.html"
    ]
    
    script_dir = Path(__file__).parent
    fixer = AdPlacementFixer(script_dir)
    
    print("🎯 Fixing Critical Ad Placement Issues")
    print("These files have ads BEFORE the hero section")
    print("=" * 70)
    
    fixer.fix_critical_issues(critical_files)
    
    print("\n🚀 Ready for a big earnings week!")


if __name__ == "__main__":
    main()
