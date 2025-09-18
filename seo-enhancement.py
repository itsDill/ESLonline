#!/usr/bin/env python3
"""
SEO Enhancement Script for ESL Fun Online
This script adds missing canonical tags, improves meta descriptions, and enhances crawlability
"""

import os
import re
from pathlib import Path

def add_canonical_tags():
    """Add canonical tags to pages that are missing them"""
    base_url = "https://eslfunonline.com"
    
    html_files = []
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for file in files:
            if file.endswith('.html') and not file.endswith('.backup'):
                html_files.append(os.path.join(root, file))
    
    fixed_count = 0
    
    for filepath in html_files:
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Skip if already has canonical tag
            if 'rel="canonical"' in content:
                continue
            
            # Construct canonical URL
            relative_path = filepath.replace('./', '').replace('\\', '/')
            if relative_path == 'index.html':
                canonical_url = f"{base_url}/"
            else:
                canonical_url = f"{base_url}/{relative_path}"
            
            # Find the head section and add canonical tag
            head_pattern = r'(<head[^>]*>.*?</head>)'
            match = re.search(head_pattern, content, re.DOTALL | re.IGNORECASE)
            
            if match:
                head_content = match.group(1)
                
                # Add canonical tag before closing head tag
                canonical_tag = f'    <link rel="canonical" href="{canonical_url}" />'
                new_head = head_content.replace('</head>', f'{canonical_tag}\\n  </head>')
                
                # Replace the head section
                new_content = content.replace(head_content, new_head)
                
                # Write back
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                print(f"✓ Added canonical tag to {filepath}")
                fixed_count += 1
            
        except Exception as e:
            print(f"✗ Error processing {filepath}: {e}")
    
    print(f"\\nAdded canonical tags to {fixed_count} pages")

def enhance_meta_descriptions():
    """Enhance meta descriptions for better SEO"""
    
    # Pages that need better meta descriptions
    meta_improvements = {
        'english/grammar.html': 'Master English grammar with comprehensive guides, exercises, and interactive lessons for all skill levels from beginner to advanced.',
        'english/vocabguide.html': 'Build your English vocabulary with our comprehensive guide featuring word lists, exercises, and practical usage examples.',
        'english/business.html': 'Improve your business English skills with professional vocabulary, email templates, meeting phrases, and workplace communication strategies.',
        'english/test.html': 'Comprehensive test preparation resources for IELTS, TOEIC, and EIKEN exams with practice tests and study guides.',
        'coding/computerbasics.html': 'Learn computer fundamentals with beginner-friendly tutorials covering hardware, software, and essential computer skills.',
        'coding/ai.html': 'Discover artificial intelligence basics with practical tutorials and real-world applications for beginners.',
        'games/games.html': 'Educational games and interactive activities to make learning English and coding fun and engaging for all ages.',
        'tools/tools.html': 'Essential learning tools including random generators, timers, lesson planners, and interactive utilities for teachers and students.',
        'blog/blog.html': 'Expert insights, learning tips, and educational resources for ESL students and teachers worldwide.'
    }
    
    for filepath, description in meta_improvements.items():
        full_path = f"./{filepath}"
        if os.path.exists(full_path):
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Update meta description
                desc_pattern = r'(<meta\\s+name="description"\\s+content=")[^"]*(")'
                if re.search(desc_pattern, content):
                    new_content = re.sub(desc_pattern, f'\\g<1>{description}\\g<2>', content)
                    
                    with open(full_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    print(f"✓ Enhanced meta description for {filepath}")
                
            except Exception as e:
                print(f"✗ Error updating meta description for {filepath}: {e}")

def add_structured_data_breadcrumbs():
    """Add breadcrumb structured data to improve navigation"""
    
    files_to_update = [
        'english/grammar.html',
        'english/vocabguide.html', 
        'english/business.html',
        'coding/computerbasics.html',
        'coding/ai.html',
        'games/games.html',
        'tools/tools.html'
    ]
    
    for filepath in files_to_update:
        full_path = f"./{filepath}"
        if os.path.exists(full_path):
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Skip if already has breadcrumb structured data
                if 'BreadcrumbList' in content:
                    continue
                
                # Get the category (first folder)
                category = filepath.split('/')[0]
                page_name = Path(filepath).stem
                
                # Create breadcrumb structured data
                breadcrumb_json = f'''
    <!-- Breadcrumb Structured Data -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://eslfunonline.com/"
        }},
        {{
          "@type": "ListItem", 
          "position": 2,
          "name": "{category.title()}",
          "item": "https://eslfunonline.com/{category}/"
        }},
        {{
          "@type": "ListItem",
          "position": 3,
          "name": "{page_name.replace('-', ' ').title()}",
          "item": "https://eslfunonline.com/{filepath}"
        }}
      ]
    }}
    </script>'''
                
                # Insert before closing head tag
                head_end = content.find('</head>')
                if head_end != -1:
                    new_content = content[:head_end] + breadcrumb_json + '\\n  ' + content[head_end:]
                    
                    with open(full_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    print(f"✓ Added breadcrumb structured data to {filepath}")
                
            except Exception as e:
                print(f"✗ Error adding breadcrumbs to {filepath}: {e}")

def optimize_internal_linking():
    """Add related links sections to improve internal linking"""
    
    related_links = {
        'english/grammar.html': [
            ('english/vocabguide.html', 'Vocabulary Guide', 'Build your word knowledge'),
            ('english/business.html', 'Business English', 'Professional communication'),
            ('english/test.html', 'Test Preparation', 'Exam practice and tips')
        ],
        'english/vocabguide.html': [
            ('english/grammar.html', 'Grammar Guides', 'Master English structure'),
            ('games/games.html', 'Vocabulary Games', 'Interactive learning'),
            ('english/business.html', 'Business Vocabulary', 'Professional terms')
        ],
        'coding/computerbasics.html': [
            ('coding/ai.html', 'AI Basics', 'Artificial intelligence intro'),
            ('coding/codingresources.html', 'Coding Resources', 'Programming tutorials'),
            ('games/games.html', 'Coding Games', 'Learn through play')
        ]
    }
    
    for filepath, links in related_links.items():
        full_path = f"./{filepath}"
        if os.path.exists(full_path):
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Skip if already has related links section
                if 'related-links' in content or 'Related Resources' in content:
                    continue
                
                # Create related links HTML
                links_html = '''
    <!-- Related Links Section for SEO -->
    <section class="related-links" style="margin: 2rem 0; padding: 1.5rem; background: #f8f9fa; border-radius: 8px;">
        <h3 style="margin-bottom: 1rem; color: #1f2937;">Related Resources</h3>
        <div style="display: grid; gap: 0.5rem;">'''
                
                for link_url, link_title, link_desc in links:
                    links_html += f'''
            <a href="../{link_url}" style="display: flex; align-items: center; padding: 0.5rem; background: white; border-radius: 4px; text-decoration: none; color: #374151; border-left: 3px solid #46bbe5;">
                <div>
                    <strong style="color: #46bbe5;">{link_title}</strong>
                    <p style="margin: 0; font-size: 0.875rem; color: #6b7280;">{link_desc}</p>
                </div>
            </a>'''
                
                links_html += '''
        </div>
    </section>'''
                
                # Insert before footer
                footer_start = content.find('<footer')
                if footer_start == -1:
                    footer_start = content.find('</body>')
                
                if footer_start != -1:
                    new_content = content[:footer_start] + links_html + '\\n    ' + content[footer_start:]
                    
                    with open(full_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    print(f"✓ Added related links to {filepath}")
                
            except Exception as e:
                print(f"✗ Error adding related links to {filepath}: {e}")

def main():
    """Main function to enhance SEO"""
    print("🚀 Starting SEO Enhancement for ESL Fun Online")
    print("=" * 50)
    
    os.chdir('/Users/dillchalisas/ESLonline')
    
    print("\\n📋 Adding missing canonical tags...")
    add_canonical_tags()
    
    print("\\n📝 Enhancing meta descriptions...")
    enhance_meta_descriptions()
    
    print("\\n🍞 Adding breadcrumb structured data...")
    add_structured_data_breadcrumbs()
    
    print("\\n🔗 Optimizing internal linking...")
    optimize_internal_linking()
    
    print("\\n✅ SEO enhancement complete!")
    print("\\n💡 Recommendations:")
    print("1. Submit updated sitemap to Google Search Console")
    print("2. Request reindexing of enhanced pages")
    print("3. Monitor Google Search Console for improvements")
    print("4. Check mobile-friendliness and page speed")

if __name__ == "__main__":
    main()