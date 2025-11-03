#!/usr/bin/env python3
"""
Ad Audit Script - Analyzes AdSense implementation across your website
Shows which pages have ads, how many, and which ad slots are used
"""

import os
import re
from collections import defaultdict
from pathlib import Path

def find_html_files(directory='.'):
    """Find all HTML files in the directory"""
    html_files = []
    for root, dirs, files in os.walk(directory):
        # Skip certain directories
        if any(skip in root for skip in ['node_modules', '.git', 'backup']):
            continue
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return html_files

def analyze_ad_placement(file_path):
    """Analyze ad placements in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all ad placements
        ad_slots = re.findall(r'data-ad-slot="(\d+)"', content)
        ad_formats = re.findall(r'data-ad-format="([^"]+)"', content)
        
        # Check for auto ads
        has_auto_ads = 'enable_page_level_ads' in content or 'overlays:' in content
        
        # Check for lazy loading
        has_lazy_load = 'data-lazy="true"' in content
        
        # Count ads
        ad_count = len(re.findall(r'class="adsbygoogle"', content))
        
        return {
            'ad_count': ad_count,
            'ad_slots': ad_slots,
            'ad_formats': ad_formats,
            'has_auto_ads': has_auto_ads,
            'has_lazy_load': has_lazy_load,
            'file_size': len(content)
        }
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def generate_report():
    """Generate comprehensive ad audit report"""
    print("=" * 80)
    print("ADSENSE IMPLEMENTATION AUDIT REPORT")
    print("=" * 80)
    print()
    
    html_files = find_html_files()
    
    # Stats tracking
    total_files = len(html_files)
    files_with_ads = 0
    total_ads = 0
    slot_usage = defaultdict(int)
    format_usage = defaultdict(int)
    
    files_by_ad_count = defaultdict(list)
    
    print(f"📊 Analyzing {total_files} HTML files...\n")
    
    # Analyze each file
    for file_path in sorted(html_files):
        analysis = analyze_ad_placement(file_path)
        
        if analysis and analysis['ad_count'] > 0:
            files_with_ads += 1
            total_ads += analysis['ad_count']
            
            # Track slot usage
            for slot in analysis['ad_slots']:
                slot_usage[slot] += 1
            
            # Track format usage
            for fmt in analysis['ad_formats']:
                format_usage[fmt] += 1
            
            # Group by ad count
            files_by_ad_count[analysis['ad_count']].append({
                'path': file_path,
                'slots': analysis['ad_slots'],
                'formats': analysis['ad_formats'],
                'auto_ads': analysis['has_auto_ads'],
                'lazy_load': analysis['has_lazy_load']
            })
    
    # Print summary statistics
    print("=" * 80)
    print("SUMMARY STATISTICS")
    print("=" * 80)
    print(f"Total HTML files: {total_files}")
    print(f"Files with ads: {files_with_ads} ({files_with_ads/total_files*100:.1f}%)")
    print(f"Files without ads: {total_files - files_with_ads}")
    print(f"Total ad units: {total_ads}")
    print(f"Average ads per page (with ads): {total_ads/files_with_ads:.1f}" if files_with_ads > 0 else "N/A")
    print()
    
    # Ad slot analysis
    print("=" * 80)
    print("AD SLOT USAGE ANALYSIS")
    print("=" * 80)
    print(f"{'Ad Slot ID':<20} {'Times Used':<15} {'Status'}")
    print("-" * 80)
    
    for slot, count in sorted(slot_usage.items(), key=lambda x: x[1], reverse=True):
        status = "✅ Good" if count < 10 else "⚠️ Overused (create unique slots)"
        print(f"{slot:<20} {count:<15} {status}")
    print()
    
    # Recommendations
    print("=" * 80)
    print("⚠️  SLOT REUSE WARNING")
    print("=" * 80)
    if any(count > 5 for count in slot_usage.values()):
        print("You're using the same ad slots across many pages.")
        print("This limits Google's ability to optimize for each page type.")
        print()
        print("RECOMMENDATION:")
        print("Create unique ad slots for different page types:")
        print("  - Homepage slots: 3-4 unique units")
        print("  - Grammar page slots: 3-4 unique units")
        print("  - Games page slots: 2-3 unique units")
        print("  - Blog page slots: 3-4 unique units")
        print()
    else:
        print("✅ Good slot diversity! Each page type should have unique slots.")
    print()
    
    # Format usage
    print("=" * 80)
    print("AD FORMAT DISTRIBUTION")
    print("=" * 80)
    for fmt, count in sorted(format_usage.items(), key=lambda x: x[1], reverse=True):
        print(f"  {fmt}: {count} instances")
    print()
    
    # Pages by ad count
    print("=" * 80)
    print("PAGES BY AD COUNT")
    print("=" * 80)
    for ad_count in sorted(files_by_ad_count.keys(), reverse=True):
        files = files_by_ad_count[ad_count]
        print(f"\n{ad_count} ads per page ({len(files)} files):")
        for file_info in files[:5]:  # Show first 5
            path = file_info['path'].replace('./', '')
            auto = "🤖 Auto" if file_info['auto_ads'] else ""
            lazy = "⚡ Lazy" if file_info['lazy_load'] else ""
            print(f"  • {path} {auto} {lazy}")
            print(f"    Slots: {', '.join(set(file_info['slots'])) or 'None'}")
        if len(files) > 5:
            print(f"  ... and {len(files) - 5} more")
    print()
    
    # High-priority recommendations
    print("=" * 80)
    print("🚀 HIGH-PRIORITY OPTIMIZATION OPPORTUNITIES")
    print("=" * 80)
    
    recommendations = []
    
    # Check for pages with too few ads
    low_ad_pages = [f for f in files_by_ad_count.get(1, []) + files_by_ad_count.get(2, [])]
    if low_ad_pages:
        recommendations.append(
            f"1. Add more ads to {len(low_ad_pages)} pages with only 1-2 ads"
        )
    
    # Check for overused slots
    overused_slots = [slot for slot, count in slot_usage.items() if count > 8]
    if overused_slots:
        recommendations.append(
            f"2. Create unique ad slots to replace overused slot(s): {', '.join(overused_slots)}"
        )
    
    # Check for missing auto ads
    files_without_auto = [f for f in files_by_ad_count.values() for file in f if not file['auto_ads']]
    if len(files_without_auto) > files_with_ads * 0.5:
        recommendations.append(
            "3. Enable anchor/overlay ads (page-level ads) on more pages"
        )
    
    # Check for missing lazy loading
    files_without_lazy = [f for f in files_by_ad_count.values() for file in f if not file['lazy_load']]
    if len(files_without_lazy) > files_with_ads * 0.8:
        recommendations.append(
            "4. Implement lazy loading for below-fold ads (improves page speed)"
        )
    
    recommendations.append("5. Add sticky sidebar ads on desktop (highest ROI)")
    recommendations.append("6. Add multiplex/matched content ads between sections")
    
    for rec in recommendations:
        print(f"  {rec}")
    print()
    
    # Expected revenue increase
    print("=" * 80)
    print("💰 ESTIMATED REVENUE INCREASE POTENTIAL")
    print("=" * 80)
    print("With recommended optimizations:")
    print("  • Sticky sidebar ads (desktop):    +25-30%")
    print("  • Anchor/overlay ads (mobile):     +15-20%")
    print("  • Better ad placement:             +10-15%")
    print("  • Unique ad slots per page type:   +5-10%")
    print("  • Multiplex ads:                   +10-15%")
    print("  " + "-" * 45)
    print("  TOTAL POTENTIAL INCREASE:          40-60% over 30-60 days")
    print()
    print("=" * 80)
    print("✅ Audit Complete! Check ADSENSE_OPTIMIZATION_GUIDE.md for details")
    print("=" * 80)

if __name__ == "__main__":
    generate_report()
