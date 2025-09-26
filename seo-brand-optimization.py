#!/usr/bin/env python3
"""
ESL Fun Online Brand SEO Optimization Script
This script helps optimize your website for better brand recognition and search rankings
"""

import os
import re
from datetime import datetime

def update_sitemap_lastmod():
    """Update sitemap with current date for homepage and key pages"""
    sitemap_path = "sitemap.xml"
    if os.path.exists(sitemap_path):
        with open(sitemap_path, 'r') as f:
            content = f.read()
        
        # Update homepage lastmod
        today = datetime.now().strftime("%Y-%m-%d")
        content = re.sub(
            r'(<url>\s*<loc>https://eslfunonline\.com/</loc>\s*<lastmod>)[^<]+(</lastmod>)',
            r'\g<1>' + today + r'\g<2>',
            content
        )
        
        # Update main category pages
        main_pages = [
            'english/eslresources.html',
            'coding/codingresources.html', 
            'games/games.html',
            'blog/blog.html'
        ]
        
        for page in main_pages:
            pattern = f'(<loc>https://eslfunonline\\.com/{re.escape(page)}</loc>\\s*<lastmod>)[^<]+(</lastmod>)'
            content = re.sub(pattern, r'\g<1>' + today + r'\g<2>', content)
        
        with open(sitemap_path, 'w') as f:
            f.write(content)
        
        print(f"✅ Updated sitemap.xml with current date: {today}")
    else:
        print("❌ sitemap.xml not found")

def create_brand_keywords_file():
    """Create a file with brand keyword variations for SEO tracking"""
    keywords = [
        "esl fun online",
        "ESL Fun Online", 
        "eslfunonline",
        "esl-fun-online",
        "ESL Fun Online platform",
        "ESL Fun Online website",
        "ESL Fun Online learning",
        "ESL Fun Online games",
        "ESL Fun Online courses",
        "ESL Fun Online English",
        "ESL Fun Online IELTS",
        "ESL Fun Online TOEIC",
        "english learning esl fun online",
        "interactive english games esl fun online",
        "esl teaching resources fun online"
    ]
    
    with open("brand-keywords.txt", 'w') as f:
        f.write("ESL Fun Online Brand Keywords for SEO Tracking\n")
        f.write("=" * 50 + "\n\n")
        for i, keyword in enumerate(keywords, 1):
            f.write(f"{i:2d}. {keyword}\n")
    
    print("✅ Created brand-keywords.txt file")

def generate_internal_linking_suggestions():
    """Generate suggestions for internal linking to improve brand recognition"""
    suggestions = """
ESL Fun Online Internal Linking Strategy
=====================================

1. HOMEPAGE IMPROVEMENTS:
   - Add more mentions of "ESL Fun Online" in the hero section
   - Include branded anchor text in navigation
   - Add testimonials mentioning the brand name

2. CROSS-LINKING STRATEGY:
   - Link from blog posts back to main ESL Fun Online homepage
   - Use "ESL Fun Online" as anchor text (not just "homepage")
   - Reference other ESL Fun Online tools/games from each page

3. FOOTER OPTIMIZATION:
   - Add "About ESL Fun Online" section
   - Include brand mission statement
   - Link to "Why Choose ESL Fun Online" page

4. BRAND MENTIONS:
   - Increase "ESL Fun Online" mentions across all pages
   - Use variations: "ESL Fun Online platform", "ESL Fun Online community"
   - Add brand mentions in meta descriptions

5. CONTENT OPPORTUNITIES:
   - Create "About ESL Fun Online" dedicated page
   - Add "ESL Fun Online Story" blog post
   - Include "How ESL Fun Online Works" guide
"""
    
    with open("internal-linking-strategy.txt", 'w') as f:
        f.write(suggestions)
    
    print("✅ Created internal-linking-strategy.txt")

def create_content_calendar():
    """Create a content calendar for brand-focused blog posts"""
    content_ideas = [
        "The Story Behind ESL Fun Online - How We Started",
        "What Makes ESL Fun Online Different from Other Platforms",  
        "ESL Fun Online Success Stories - Student Testimonials",
        "A Day in the Life of an ESL Fun Online Student",
        "ESL Fun Online vs Traditional Learning Methods",
        "The Technology Behind ESL Fun Online's Interactive Games",
        "ESL Fun Online's Approach to IELTS Preparation",
        "Building the ESL Fun Online Community",
        "ESL Fun Online's Vision for the Future of Language Learning",
        "How ESL Fun Online Teachers Create Engaging Content"
    ]
    
    calendar = f"""
ESL Fun Online Content Calendar - Brand Building Posts
====================================================
Generated: {datetime.now().strftime("%Y-%m-%d")}

Monthly blog post ideas to strengthen brand recognition:

"""
    
    for i, idea in enumerate(content_ideas, 1):
        calendar += f"Month {i:2d}: {idea}\n"
    
    calendar += """
POSTING STRATEGY:
- Publish 1 brand-focused post per month
- Share on social media with #ESLFunOnline hashtag
- Include internal links to main pages
- Encourage community engagement and sharing
- Monitor brand mentions and respond promptly

SEO TIPS FOR EACH POST:
- Include "ESL Fun Online" in title and first paragraph
- Use brand name 3-5 times throughout the post
- Link back to homepage and relevant tools
- Include branded meta descriptions
- Add schema markup for articles
"""
    
    with open("content-calendar.txt", 'w') as f:
        f.write(calendar)
    
    print("✅ Created content-calendar.txt")

def main():
    """Run all SEO optimization tasks"""
    print("🚀 ESL Fun Online Brand SEO Optimization")
    print("=" * 40)
    
    update_sitemap_lastmod()
    create_brand_keywords_file()
    generate_internal_linking_suggestions()
    create_content_calendar()
    
    print("\n📊 SEO Optimization Complete!")
    print("\nNEXT STEPS:")
    print("1. Submit updated sitemap to Google Search Console")
    print("2. Monitor brand keyword rankings")
    print("3. Implement internal linking suggestions")
    print("4. Start creating brand-focused content")
    print("5. Set up Google Alerts for 'ESL Fun Online'")
    print("6. Encourage users to search for 'ESL Fun Online' specifically")

if __name__ == "__main__":
    main()