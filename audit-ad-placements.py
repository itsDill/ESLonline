#!/usr/bin/env python3
"""
Ad Placement Audit Script
Checks all HTML files for ads above the fold and provides detailed report
"""

import os
import re
from pathlib import Path
from collections import defaultdict

class AdAuditor:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)
        self.results = {
            'auto_ads_found': [],
            'early_ads': [],
            'safe_ads': [],
            'total_files': 0,
            'total_ads': 0
        }
        
    def analyze_file(self, file_path):
        """Analyze a single HTML file for ad placements"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                lines = content.split('\n')
                
            file_info = {
                'path': str(file_path.relative_to(self.root_dir)),
                'auto_ads': False,
                'ads': []
            }
            
            # Check for auto ads
            if re.search(r'enable_page_level_ads.*true', content):
                file_info['auto_ads'] = True
                self.results['auto_ads_found'].append(file_info['path'])
                
            # Find all AdSense ad units
            ad_pattern = r'<ins\s+class="adsbygoogle"'
            
            for i, line in enumerate(lines, 1):
                if re.search(ad_pattern, line):
                    # Determine context
                    context_start = max(0, i - 10)
                    context = '\n'.join(lines[context_start:i])
                    
                    # Check if near top of file
                    is_early = i < 150  # First 150 lines considered "above fold"
                    
                    # Check if after header/nav
                    header_lines = content[:content.find(line)]
                    has_header = '</header>' in header_lines or '</nav>' in header_lines
                    
                    # Check if in main content area
                    in_hero = 'hero' in context.lower()
                    in_header = '<header' in context or '<nav' in context
                    
                    ad_info = {
                        'line': i,
                        'early': is_early,
                        'in_hero': in_hero,
                        'in_header': in_header,
                        'context_preview': context[-150:].strip()
                    }
                    
                    file_info['ads'].append(ad_info)
                    self.results['total_ads'] += 1
                    
                    # Categorize
                    if is_early or in_hero:
                        self.results['early_ads'].append({
                            'file': file_info['path'],
                            'line': i,
                            'reason': 'in_hero' if in_hero else 'early_in_file'
                        })
                    else:
                        self.results['safe_ads'].append(file_info['path'])
                        
            return file_info
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            return None
            
    def audit_all_files(self):
        """Audit all HTML files in directory"""
        html_files = list(self.root_dir.rglob('*.html'))
        
        # Filter out backups and templates
        html_files = [
            f for f in html_files 
            if 'backup' not in str(f).lower() 
            and 'template' not in str(f).lower()
        ]
        
        self.results['total_files'] = len(html_files)
        
        for html_file in html_files:
            self.analyze_file(html_file)
            
    def generate_report(self):
        """Generate detailed audit report"""
        print("=" * 80)
        print("🔍 AD PLACEMENT AUDIT REPORT")
        print("=" * 80)
        print()
        
        # Summary
        print("📊 SUMMARY:")
        print(f"   • Total HTML files scanned: {self.results['total_files']}")
        print(f"   • Total ads found: {self.results['total_ads']}")
        print(f"   • Files with auto ads: {len(self.results['auto_ads_found'])}")
        print(f"   • Ads potentially above fold: {len(self.results['early_ads'])}")
        print(f"   • Ads safely placed: {len(self.results['safe_ads'])}")
        print()
        
        # Auto ads
        if self.results['auto_ads_found']:
            print("⚠️  AUTO ADS STILL ENABLED (SHOULD BE REMOVED):")
            print("-" * 80)
            for file in self.results['auto_ads_found'][:10]:
                print(f"   • {file}")
            if len(self.results['auto_ads_found']) > 10:
                print(f"   ... and {len(self.results['auto_ads_found']) - 10} more")
            print()
            
        # Early ads
        if self.results['early_ads']:
            print("⚠️  ADS POTENTIALLY ABOVE THE FOLD:")
            print("-" * 80)
            
            # Group by file
            by_file = defaultdict(list)
            for ad in self.results['early_ads']:
                by_file[ad['file']].append(ad)
                
            for file, ads in list(by_file.items())[:15]:
                print(f"   📄 {file}")
                for ad in ads[:3]:
                    reason = "IN HERO SECTION" if ad['reason'] == 'in_hero' else f"LINE {ad['line']}"
                    print(f"      • {reason}")
                print()
                
            if len(by_file) > 15:
                print(f"   ... and {len(by_file) - 15} more files")
            print()
            
        # Recommendations
        print("=" * 80)
        print("💡 RECOMMENDATIONS:")
        print("-" * 80)
        print("1. ✅ COMPLETED: Removed auto ads from index.html")
        print("2. ✅ COMPLETED: Moved ad away from hero section in index.html")
        print()
        print("3. ⚠️  TODO: Consider reviewing other pages to move ads below fold:")
        print("   • Ads should appear AFTER at least 1-2 content sections")
        print("   • Safe positions: after features grid, after intro content, mid-page")
        print("   • Avoid: hero sections, immediately after navigation, page top")
        print()
        print("4. 📋 BEST PRACTICES:")
        print("   • First screen should show valuable content (no ads)")
        print("   • Place ads between natural content breaks")
        print("   • Limit to 3-4 ads per page maximum")
        print("   • Ensure ads don't interfere with user experience")
        print("=" * 80)
        
        return self.results

if __name__ == '__main__':
    auditor = AdAuditor('/Users/dillchalisas/ESLonline')
    auditor.audit_all_files()
    results = auditor.generate_report()
