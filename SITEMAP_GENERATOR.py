#!/usr/bin/env python3
"""
Sitemap Generator for ESL Fun Online
Generates comprehensive sitemap.xml with all HTML pages
"""

import os
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path

def get_last_modified(filepath):
    """Get last modified date of file"""
    try:
        timestamp = os.path.getmtime(filepath)
        return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
    except:
        return datetime.now().strftime('%Y-%m-%d')

def generate_sitemap(domain="https://eslfunonline.com", output_file="sitemap.xml"):
    """Generate sitemap.xml from all HTML files"""
    
    root = Path('/Users/dillchalisas/ESLonline')
    
    # Skip these directories
    skip_dirs = {'.git', '.venv', '.dev-files', '.idea', '.vscode', '__pycache__', 'coding'}
    skip_files = {'header-template.html', 'idioms-grid-section.html'}
    
    # Create XML root
    urlset = ET.Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    urlset.set('xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1')
    
    files_added = 0
    
    # Collect all HTML files
    html_files = []
    for html_file in sorted(root.rglob('*.html')):
        # Skip certain directories and files
        if any(part in html_file.parts for part in skip_dirs):
            continue
        if html_file.name in skip_files:
            continue
        if 'backup' in html_file.name or '-old' in html_file.name:
            continue
        
        html_files.append(html_file)
    
    # Add URLs with priority based on importance
    priority_map = {
        'index.html': 1.0,
        'games/games.html': 0.9,
        'resources/index.html': 0.9,
        'teacher-hub/index.html': 0.8,
        'contact.html': 0.7,
        'games/': 0.85,
        'resources/': 0.8,
        'teacher-hub/': 0.7,
        '.html': 0.6,  # default
    }
    
    for html_file in html_files:
        try:
            relative_path = html_file.relative_to(root)
            url_path = str(relative_path).replace('\\', '/')
            full_url = f"{domain}/{url_path}" if url_path != 'index.html' else domain
            
            # Determine priority
            priority = 0.6
            for key, val in priority_map.items():
                if key in str(relative_path).lower():
                    priority = max(priority, val)
                    break
            
            # Get last modified date
            last_modified = get_last_modified(str(html_file))
            
            # Add URL to sitemap
            url_element = ET.SubElement(urlset, 'url')
            loc = ET.SubElement(url_element, 'loc')
            loc.text = full_url
            lastmod = ET.SubElement(url_element, 'lastmod')
            lastmod.text = last_modified
            changefreq = ET.SubElement(url_element, 'changefreq')
            changefreq.text = 'weekly' if 'game' in str(relative_path).lower() else 'monthly'
            priority_elem = ET.SubElement(url_element, 'priority')
            priority_elem.text = str(round(priority, 1))
            
            files_added += 1
            
        except Exception as e:
            print(f"Error processing {html_file}: {e}")
    
    # Pretty print
    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="  ")  # Python 3.9+
    
    # Write to file
    output_path = root / output_file
    tree.write(output_path, encoding='utf-8', xml_declaration=True)
    
    print(f"✅ Sitemap generated: {output_file}")
    print(f"📊 Total URLs: {files_added}")
    print(f"📁 Location: {output_path}")
    print(f"\n🔗 Submit to Google Search Console:")
    print(f"   https://www.google.com/ping?sitemap={domain}/{output_file}")
    
    return files_added

def generate_sitemap_index(domain="https://eslfunonline.com"):
    """Generate sitemap index if multiple sitemaps needed"""
    # For now, single sitemap should be sufficient
    # This can be extended if sitemap grows beyond 50k URLs
    pass

if __name__ == "__main__":
    import sys
    
    # Allow custom domain and output file as arguments
    domain = sys.argv[1] if len(sys.argv) > 1 else "https://eslfunonline.com"
    output = sys.argv[2] if len(sys.argv) > 2 else "sitemap.xml"
    
    generate_sitemap(domain, output)
