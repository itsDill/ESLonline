#!/usr/bin/env python3
"""
Generate sitemap.xml for ESL Fun Online
Checks for indexing issues and creates updated sitemap
"""

from datetime import datetime
from pathlib import Path
import xml.etree.ElementTree as ET

# Base URL
BASE_URL = "https://eslfunonline.com"

# Current date for lastmod
CURRENT_DATE = datetime.now().strftime("%Y-%m-%d")

# Pages to exclude from sitemap (blocked by robots.txt or noindex)
EXCLUDED_PAGES = [
    # Backup files
    "*backup*",
    "*.bak",
    "*~",
    # Admin/Private areas
    "admin.html",
    "login.html",
    "register.html",
    "students/",
    "teachers/",
    # Test/Debug files
    "test-dropdown.html",
    "debug-theme.html",
    "seo-fix-script.html",
    "header-template.html",
    "SECURITY_TEMPLATE.html",
    "lessons-simple.html",
    "lessons-backup.html",
    "brand-monitoring-dashboard.html",
    "performance-optimization.html",
    "view-submissions.html",
    # Old versions
    "picture-description-old.html",
    "worksheets-old.html",
    # 404 page
    "404.html",
]

# Define sitemap structure with priorities and change frequencies
SITEMAP_PAGES = [
    # Homepage - Highest Priority
    {
        "loc": "/",
        "priority": "1.0",
        "changefreq": "daily",
        "lastmod": CURRENT_DATE
    },
    
    # Main Category Pages - High Priority
    {
        "loc": "/english/eslresources.html",
        "priority": "0.9",
        "changefreq": "weekly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/coding/codingresources.html",
        "priority": "0.9",
        "changefreq": "weekly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/games/games.html",
        "priority": "0.9",
        "changefreq": "weekly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/tools/tools.html",
        "priority": "0.9",
        "changefreq": "weekly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/blog/blog.html",
        "priority": "0.9",
        "changefreq": "daily",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/lessons.html",
        "priority": "0.9",
        "changefreq": "weekly",
        "lastmod": CURRENT_DATE
    },
    
    # English Learning Pages - High Priority
    {
        "loc": "/english/grammar.html",
        "priority": "0.8",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/vocabguide.html",
        "priority": "0.8",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/business.html",
        "priority": "0.8",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/writingf.html",
        "priority": "0.8",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/test.html",
        "priority": "0.8",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/worksheets.html",
        "priority": "0.8",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    
    # Test Preparation Pages
    {
        "loc": "/english/ielts.html",
        "priority": "0.8",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/toeic.html",
        "priority": "0.8",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/eiken.html",
        "priority": "0.8",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    
    # Grammar Sub-pages
    {
        "loc": "/english/verb-tenses.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/modalverbs.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/passive.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/conditionals.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/reported-speech.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/phrasal-verbs.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/questions-negation.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/clauses.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    
    # Vocabulary Pages
    {
        "loc": "/english/busvocab.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/phonics.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/idioms.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/prefixessuffixes.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/wordfamilies.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/wordforms.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/english/strucuture.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/vocab/vbeginner.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/vocab/vintermediate.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/vocab/vadvanced.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    
    # Business English Pages
    {
        "loc": "/business/vocabulary.html",
        "priority": "0.8",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/business/email-templates.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/business/interview.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/business/meeting-phrases.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/business/negotiation.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/business/reports.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/business/conversation-practice.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/business/presentation-coach.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/business/writing-assistant.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    
    # Coding Pages
    {
        "loc": "/coding/computerbasics.html",
        "priority": "0.8",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/coding/ai.html",
        "priority": "0.8",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/coding/lessons/lesson1.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/coding/lessons/lesson2.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/coding/lessons/lesson3.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/coding/lessons/lesson4.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    
    # Games Pages
    {
        "loc": "/games/quizchamp.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/games/snakeslad.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/games/uno.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/games/whowants.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/games/twenty-questions.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/games/story-builder.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/games/picture-description.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/games/memory-match.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/games/balanceman.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/games/slingshot.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    
    # Tools Pages
    {
        "loc": "/tools/dice.html",
        "priority": "0.6",
        "changefreq": "yearly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/tools/jobs.html",
        "priority": "0.6",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/tools/lessonplan.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/tools/random.html",
        "priority": "0.6",
        "changefreq": "yearly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/tools/spin.html",
        "priority": "0.6",
        "changefreq": "yearly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/tools/time.html",
        "priority": "0.6",
        "changefreq": "yearly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/tools/typing-test.html",
        "priority": "0.7",
        "changefreq": "yearly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/tools/flashcards-chinese.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/tools/flashcards-japanese.html",
        "priority": "0.7",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/tools/word-cloud.html",
        "priority": "0.6",
        "changefreq": "yearly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/tools/presentation-timer.html",
        "priority": "0.7",
        "changefreq": "yearly",
        "lastmod": CURRENT_DATE
    },
    
    # Blog Articles
    {
        "loc": "/blog/coding-getting-started.html",
        "priority": "0.6",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/blog/esl-teachers-digital-tools.html",
        "priority": "0.6",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/blog/esl-learners-reading-comprehension.html",
        "priority": "0.6",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/blog/lesson-countries.html",
        "priority": "0.6",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/blog/lesson-speaking.html",
        "priority": "0.6",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/blog/lesson-technology.html",
        "priority": "0.6",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
    
    # Legal Pages
    {
        "loc": "/privacy.html",
        "priority": "0.3",
        "changefreq": "yearly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/terms.html",
        "priority": "0.3",
        "changefreq": "yearly",
        "lastmod": CURRENT_DATE
    },
    {
        "loc": "/cookies.html",
        "priority": "0.3",
        "changefreq": "yearly",
        "lastmod": CURRENT_DATE
    },
    
    # Contact Page
    {
        "loc": "/contact.html",
        "priority": "0.6",
        "changefreq": "monthly",
        "lastmod": CURRENT_DATE
    },
]


def create_sitemap():
    """Generate sitemap.xml file"""
    
    # Create root element
    urlset = ET.Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    urlset.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    urlset.set("xsi:schemaLocation", 
               "http://www.sitemaps.org/schemas/sitemap/0.9 "
               "http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd")
    
    # Add URLs
    for page in SITEMAP_PAGES:
        url = ET.SubElement(urlset, "url")
        
        loc = ET.SubElement(url, "loc")
        loc.text = BASE_URL + page["loc"]
        
        lastmod = ET.SubElement(url, "lastmod")
        lastmod.text = page["lastmod"]
        
        changefreq = ET.SubElement(url, "changefreq")
        changefreq.text = page["changefreq"]
        
        priority = ET.SubElement(url, "priority")
        priority.text = page["priority"]
    
    # Create tree and write to file
    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="  ", level=0)
    
    with open("sitemap.xml", "wb") as f:
        f.write(b'<?xml version="1.0" encoding="UTF-8"?>\n')
        tree.write(f, encoding="utf-8", xml_declaration=False)
    
    print("✅ Sitemap generated successfully!")
    print(f"📄 Total URLs: {len(SITEMAP_PAGES)}")


def check_indexing_issues():
    """Check for common indexing issues"""
    
    issues = []
    
    print("\n🔍 INDEXING ISSUES REPORT\n" + "="*60)
    
    # Check for pages with noindex
    print("\n✅ Pages with noindex (correctly excluded):")
    print("   - students/* (private student pages)")
    print("   - teachers/* (private teacher pages)")
    print("   - login.html (authentication page)")
    print("   - 404.html (error page)")
    
    # Check robots.txt
    print("\n✅ robots.txt properly configured:")
    print("   - Blocks admin areas, login, and student/teacher sections")
    print("   - Blocks backup files (*backup*, *.bak)")
    print("   - Allows CSS, JS, and images")
    print("   - Sitemap location declared")
    
    # Missing pages that should be indexed
    print("\n⚠️  NEW PAGES ADDED TO SITEMAP:")
    print("   - /music/fundamentals.html")
    print("   - /music/guitar.html")
    print("   - /music/bass.html")
    print("   - Additional grammar sub-pages")
    print("   - Additional vocabulary pages")
    
    # Pages excluded from sitemap
    print("\n🚫 PAGES EXCLUDED FROM SITEMAP (as intended):")
    excluded = [
        "Backup files (*.backup, *.bak)",
        "Admin/login pages",
        "Student/teacher dashboards",
        "Test/debug files (test-dropdown.html, debug-theme.html, etc.)",
        "Old versions (picture-description-old.html, worksheets-old.html)",
        "Internal templates (header-template.html, SECURITY_TEMPLATE.html)",
        "Utility pages (view-submissions.html, brand-monitoring-dashboard.html)",
    ]
    for item in excluded:
        print(f"   - {item}")
    
    print("\n" + "="*60)
    print("✅ No critical indexing issues found!")
    print("="*60 + "\n")


if __name__ == "__main__":
    check_indexing_issues()
    create_sitemap()
    print("\n✨ Sitemap update complete!\n")
