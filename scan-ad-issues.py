#!/usr/bin/env python3
"""
Site Scan and Ad Placement Optimizer
Identifies and fixes RPM-killing issues across the site
"""

import os
import re
from pathlib import Path
from collections import defaultdict

class AdPlacementScanner:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)
        self.issues = defaultdict(list)
        self.stats = {
            'total_pages': 0,
            'pages_with_ads': 0,
            'pages_fixed': 0,
            'total_issues': 0
        }
        
    def scan_site(self):
        """Scan all HTML files for ad placement issues"""
        print("🔍 Starting Site Scan for RPM Issues...")
        print("=" * 70)
        
        html_files = list(self.root_dir.rglob('*.html'))
        # Exclude backup and example files
        html_files = [f for f in html_files if not any(x in str(f) for x in ['.backup', 'example', 'test-', 'debug-', 'SECURITY_TEMPLATE'])]
        
        self.stats['total_pages'] = len(html_files)
        
        for file_path in html_files:
            self._scan_file(file_path)
            
        self._print_report()
        return self.issues
    
    def _scan_file(self, file_path):
        """Scan individual file for issues"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Check if page has ads
            if 'adsbygoogle' not in content:
                return
                
            self.stats['pages_with_ads'] += 1
            relative_path = file_path.relative_to(self.root_dir)
            
            # Issue 1: Check for ads BEFORE hero section
            self._check_ad_before_hero(content, relative_path)
            
            # Issue 2: Check for excessive ad density (too many ads too close together)
            self._check_ad_density(content, relative_path)
            
            # Issue 3: Check for ads in header/navigation area
            self._check_ads_in_header(content, relative_path)
            
            # Issue 4: Check for missing ads after hero (should always have one)
            self._check_missing_ad_after_hero(content, relative_path)
            
            # Issue 5: Check for duplicate ad slots
            self._check_duplicate_ad_slots(content, relative_path)
            
            # Issue 6: Check for ads with poor viewability (hidden, tiny margins)
            self._check_poor_viewability(content, relative_path)
            
        except Exception as e:
            print(f"❌ Error scanning {file_path}: {e}")
    
    def _check_ad_before_hero(self, content, path):
        """Check if ads appear before hero section - CRITICAL ISSUE"""
        # Find hero section
        hero_match = re.search(r'<section[^>]*class=["\'].*?hero.*?["\']', content, re.IGNORECASE)
        if not hero_match:
            return
        
        hero_pos = hero_match.start()
        
        # Find first ad placement
        ad_match = re.search(r'<ins[^>]*class=["\'].*?adsbygoogle.*?["\']', content, re.IGNORECASE)
        if not ad_match:
            return
        
        ad_pos = ad_match.start()
        
        # If ad appears before hero, that's a problem
        if ad_pos < hero_pos:
            self.issues['ad_before_hero'].append({
                'file': str(path),
                'severity': 'CRITICAL',
                'description': 'Ad appears BEFORE hero section - violates AdSense policy and kills RPM'
            })
            self.stats['total_issues'] += 1
    
    def _check_ad_density(self, content, path):
        """Check if ads are too close together"""
        # Find all ad positions
        ad_positions = [m.start() for m in re.finditer(r'<ins[^>]*class=["\'].*?adsbygoogle.*?["\']', content, re.IGNORECASE)]
        
        if len(ad_positions) < 2:
            return
        
        # Check spacing between consecutive ads
        for i in range(len(ad_positions) - 1):
            distance = ad_positions[i+1] - ad_positions[i]
            # If ads are within 800 characters of each other, they're too close
            if distance < 800:
                self.issues['excessive_ad_density'].append({
                    'file': str(path),
                    'severity': 'HIGH',
                    'description': f'Two ads are only {distance} characters apart - needs more content between ads'
                })
                self.stats['total_issues'] += 1
    
    def _check_ads_in_header(self, content, path):
        """Check for ads in header/nav area"""
        # Find header/nav closing tag
        header_match = re.search(r'</header>|</nav>', content, re.IGNORECASE)
        if not header_match:
            return
        
        header_end = header_match.end()
        
        # Check if any ads appear before header ends
        ad_match = re.search(r'<ins[^>]*class=["\'].*?adsbygoogle.*?["\']', content, re.IGNORECASE)
        if ad_match and ad_match.start() < header_end:
            self.issues['ad_in_header'].append({
                'file': str(path),
                'severity': 'CRITICAL',
                'description': 'Ad in header/navigation area - against AdSense policies'
            })
            self.stats['total_issues'] += 1
    
    def _check_missing_ad_after_hero(self, content, path):
        """Check if there's an ad immediately after hero section"""
        # Find hero section end
        hero_match = re.search(r'<section[^>]*class=["\'].*?hero.*?["\'].*?</section>', content, re.IGNORECASE | re.DOTALL)
        if not hero_match:
            return
        
        hero_end = hero_match.end()
        
        # Look for ad within 1000 characters after hero
        post_hero = content[hero_end:hero_end+1000]
        if '<ins' not in post_hero and 'adsbygoogle' not in post_hero:
            self.issues['missing_ad_after_hero'].append({
                'file': str(path),
                'severity': 'MEDIUM',
                'description': 'No ad found immediately after hero - missing prime placement opportunity'
            })
            self.stats['total_issues'] += 1
    
    def _check_duplicate_ad_slots(self, content, path):
        """Check for duplicate ad slot IDs"""
        slot_pattern = r'data-ad-slot=["\'](\d+)["\']'
        slots = re.findall(slot_pattern, content)
        
        if len(slots) != len(set(slots)) and len(slots) > 1:
            # Check if they're all the same slot (which is actually OK for Auto ads)
            unique_slots = set(slots)
            if len(unique_slots) == 1:
                # This is fine - all using same slot
                return
            else:
                self.issues['duplicate_ad_slots'].append({
                    'file': str(path),
                    'severity': 'LOW',
                    'description': f'Multiple different ad slots on page: {", ".join(unique_slots)}'
                })
    
    def _check_poor_viewability(self, content, path):
        """Check for ads with poor viewability setup"""
        # Look for ads with display:none or hidden
        if re.search(r'<ins[^>]*adsbygoogle[^>]*style=["\'][^"\']*display:\s*none', content, re.IGNORECASE):
            self.issues['hidden_ads'].append({
                'file': str(path),
                'severity': 'HIGH',
                'description': 'Ad unit has display:none - will not earn revenue'
            })
            self.stats['total_issues'] += 1
        
        # Check for ads with very small margins (poor viewability)
        if re.search(r'<ins[^>]*adsbygoogle[^>]*style=["\'][^"\']*margin:\s*0', content, re.IGNORECASE):
            self.issues['poor_viewability'].append({
                'file': str(path),
                'severity': 'MEDIUM',
                'description': 'Ad has zero margin - may impact viewability and RPM'
            })
    
    def _print_report(self):
        """Print detailed scan report"""
        print("\n📊 SCAN RESULTS")
        print("=" * 70)
        print(f"Total Pages Scanned: {self.stats['total_pages']}")
        print(f"Pages with Ads: {self.stats['pages_with_ads']}")
        print(f"Total Issues Found: {self.stats['total_issues']}")
        print("=" * 70)
        
        if self.stats['total_issues'] == 0:
            print("✅ No issues found! Your ad setup looks good.")
            return
        
        # Print issues by severity
        critical_count = sum(len(v) for k, v in self.issues.items() if any(i['severity'] == 'CRITICAL' for i in v))
        high_count = sum(len(v) for k, v in self.issues.items() if any(i['severity'] == 'HIGH' for i in v))
        medium_count = sum(len(v) for k, v in self.issues.items() if any(i['severity'] == 'MEDIUM' for i in v))
        
        if critical_count > 0:
            print(f"\n🚨 CRITICAL ISSUES ({critical_count}):")
            print("-" * 70)
            for issue_type, issues in self.issues.items():
                for issue in issues:
                    if issue['severity'] == 'CRITICAL':
                        print(f"  ❌ {issue['file']}")
                        print(f"     {issue['description']}")
        
        if high_count > 0:
            print(f"\n⚠️  HIGH PRIORITY ({high_count}):")
            print("-" * 70)
            for issue_type, issues in self.issues.items():
                for issue in issues:
                    if issue['severity'] == 'HIGH':
                        print(f"  ⚠️  {issue['file']}")
                        print(f"     {issue['description']}")
        
        if medium_count > 0:
            print(f"\n📝 MEDIUM PRIORITY ({medium_count}):")
            print("-" * 70)
            for issue_type, issues in self.issues.items():
                for issue in issues:
                    if issue['severity'] == 'MEDIUM':
                        print(f"  📝 {issue['file']}")
                        print(f"     {issue['description']}")
        
        print("\n" + "=" * 70)
        print("💡 QUICK WINS FOR HIGHER RPM:")
        print("=" * 70)
        print("1. ✅ Always place first ad AFTER hero section (not before)")
        print("2. ✅ Space ads with at least 800-1000 chars of content between")
        print("3. ✅ Use proper margins (2rem) for better viewability")
        print("4. ✅ Never place ads in header/navigation areas")
        print("5. ✅ Place ad immediately after hero for best performance")
        print("6. ✅ Ensure ads are visible (no display:none)")
        print("7. ✅ Use responsive ad units (data-full-width-responsive='true')")
        
    def get_critical_files(self):
        """Return list of files with critical issues that need immediate fixing"""
        critical_files = set()
        for issue_type, issues in self.issues.items():
            for issue in issues:
                if issue['severity'] == 'CRITICAL':
                    critical_files.add(issue['file'])
        return sorted(list(critical_files))


def main():
    # Get the script directory
    script_dir = Path(__file__).parent
    
    scanner = AdPlacementScanner(script_dir)
    issues = scanner.scan_site()
    
    # Get critical files that need fixing
    critical_files = scanner.get_critical_files()
    
    if critical_files:
        print("\n🔧 FILES NEEDING IMMEDIATE FIXES:")
        print("=" * 70)
        for file in critical_files:
            print(f"  • {file}")
        
        print("\n💰 Fix these files first for immediate RPM improvements!")
    
    print("\n✅ Scan complete!\n")


if __name__ == "__main__":
    main()
