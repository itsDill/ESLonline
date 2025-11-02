#!/usr/bin/env python3
"""
Fix Mobile Menu Dropdown Clicks on All Pages
Applies the pointer-events and JavaScript fixes to all HTML files
"""

import os
import re
from pathlib import Path
import shutil
from datetime import datetime

class MobileMenuFixer:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)
        self.fixed_files = []
        self.backup_dir = self.root_dir / 'mobile-menu-fix-backups' / datetime.now().strftime('%Y%m%d_%H%M%S')
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        
    def fix_all_pages(self):
        """Fix mobile menu on all HTML pages"""
        print("🔧 Fixing Mobile Menu Dropdowns on All Pages...")
        print("=" * 70)
        
        # Find all HTML files
        html_files = list(self.root_dir.rglob('*.html'))
        # Exclude backups and certain files
        html_files = [f for f in html_files if not any(x in str(f) for x in [
            'backup', 'SECURITY_TEMPLATE', 'debug-', 'test-', 
            'mobile-menu-fix-backups', 'ad-fix-backups'
        ])]
        
        print(f"Found {len(html_files)} pages to check\n")
        
        for file_path in html_files:
            self._fix_file(file_path)
        
        self._print_summary()
    
    def _fix_file(self, file_path):
        """Fix a single HTML file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Skip if no mobile menu
            if 'nav-item' not in content or 'dropdown' not in content:
                return
            
            original_content = content
            
            # Fix 1: Add CSS for pointer events if not already present
            content = self._add_pointer_events_css(content)
            
            # Fix 2: Update JavaScript handler if present
            content = self._fix_dropdown_javascript(content)
            
            if content != original_content:
                # Create backup
                backup_path = self.backup_dir / file_path.relative_to(self.root_dir)
                backup_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(file_path, backup_path)
                
                # Write fixed content
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                self.fixed_files.append(file_path.relative_to(self.root_dir))
                print(f"✅ Fixed: {file_path.relative_to(self.root_dir)}")
        
        except Exception as e:
            print(f"❌ Error fixing {file_path}: {e}")
    
    def _add_pointer_events_css(self, content):
        """Add pointer-events CSS if not already present"""
        # Check if the fix is already there
        if 'pointer-events: auto !important' in content and '.dropdown-item' in content:
            return content
        
        # Find the mobile dropdown CSS section
        css_pattern = r'(\.nav-item\.mobile-open \.dropdown,\s*\.nav-item\.mobile-dropdown-open \.dropdown\s*\{[^}]*\})'
        
        if re.search(css_pattern, content):
            # Add pointer-events to existing rule
            def add_pointer_events(match):
                rule = match.group(1)
                if 'pointer-events:' not in rule:
                    rule = rule.rstrip('}').rstrip() + '\n          pointer-events: auto !important;\n        }'
                return rule
            
            content = re.sub(css_pattern, add_pointer_events, content)
        
        # Add dropdown-item styles if not present
        if '.dropdown-item' in content and 'touch-action: manipulation' not in content:
            # Find insertion point - after the mobile-open dropdown rules
            insertion_pattern = r'(\.nav-item\.mobile-open \.dropdown,\s*\.nav-item\.mobile-dropdown-open \.dropdown\s*\{[^}]*\})'
            
            additional_css = '''

        /* Ensure dropdown items are clickable */
        .dropdown-item,
        .dropdown > a {
          pointer-events: auto !important;
          cursor: pointer !important;
          touch-action: manipulation !important;
        }'''
            
            def insert_after(match):
                return match.group(1) + additional_css
            
            content = re.sub(insertion_pattern, insert_after, content)
        
        return content
    
    def _fix_dropdown_javascript(self, content):
        """Fix JavaScript dropdown handler to allow clicks on dropdown items"""
        # Pattern to find the handleDropdownClick function
        js_pattern = r'(function handleDropdownClick\(e\)\s*\{[^}]*if \(window\.innerWidth > 768\)[^}]*return;[^}]*)(e\.preventDefault\(\);)'
        
        # Check if already fixed
        if "Don't interfere with dropdown item clicks" in content:
            return content
        
        # Find and fix the handler
        if re.search(js_pattern, content, re.DOTALL):
            # Add the check before preventDefault
            fix_code = '''
                // Don't interfere with dropdown item clicks
                if (e.target.closest('.dropdown-item') || e.target.closest('.dropdown a')) {
                  console.log("Dropdown item clicked - allowing navigation");
                  return; // Let the link work normally
                }

                e.preventDefault();'''
            
            content = re.sub(
                r'(\s+)(e\.preventDefault\(\);)',
                lambda m: m.group(1) + fix_code.strip() + '\n' + m.group(1),
                content,
                count=1
            )
        
        return content
    
    def _print_summary(self):
        """Print summary of fixes"""
        print("\n" + "=" * 70)
        print("📊 FIX SUMMARY")
        print("=" * 70)
        print(f"Files Fixed: {len(self.fixed_files)}")
        print(f"Backups Saved To: {self.backup_dir.relative_to(self.root_dir)}")
        print("=" * 70)
        
        if self.fixed_files:
            print("\n✅ Fixed Files:")
            for file in sorted(self.fixed_files):
                print(f"  • {file}")
            
            print("\n🎯 What Was Fixed:")
            print("  • Added pointer-events CSS for clickable dropdown items")
            print("  • Updated JavaScript to allow navigation on dropdown items")
            print("  • Added touch-action for better mobile interaction")
            print("  • Ensured dropdown toggles work while items are clickable")
            
            print("\n📱 Test On Mobile:")
            print("  • Tap parent menu items to open/close dropdowns")
            print("  • Tap dropdown items to navigate to pages")
            print("  • All sub-pages should now be accessible!")
        else:
            print("\n✅ No files needed fixing - all pages already have the fix!")
        
        print("\n💾 Backups saved in case you need to revert")
        print("✅ Mobile menu fix complete!\n")


def main():
    script_dir = Path(__file__).parent
    fixer = MobileMenuFixer(script_dir)
    fixer.fix_all_pages()


if __name__ == "__main__":
    main()
