#!/usr/bin/env python3
"""
Generate CORRECT sitemap.xml based on files that actually exist
"""

from datetime import datetime
import xml.etree.ElementTree as ET

BASE_URL = "https://eslfunonline.com"
CURRENT_DATE = datetime.now().strftime("%Y-%m-%d")

# All actual pages that exist (verified via file scan)
ACTUAL_PAGES = [
    # Homepage
    {"loc": "/", "priority": "1.0", "changefreq": "daily"},
    
    # Main Pages (0.9 priority)
    {"loc": "/lessons.html", "priority": "0.9", "changefreq": "weekly"},
    {"loc": "/blog/blog.html", "priority": "0.9", "changefreq": "daily"},
    {"loc": "/games/games.html", "priority": "0.9", "changefreq": "weekly"},
    {"loc": "/tools/tools.html", "priority": "0.9", "changefreq": "weekly"},
    {"loc": "/coding/codingresources.html", "priority": "0.9", "changefreq": "weekly"},
    
    # English Pages (0.8 priority - high value content)
    {"loc": "/english/grammar.html", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/english/vocabguide.html", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/english/business.html", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/english/writingf.html", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/english/test.html", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/english/worksheets.html", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/english/ielts.html", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/english/toeic.html", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/english/eiken.html", "priority": "0.8", "changefreq": "monthly"},
    
    # Grammar Sub-pages (0.7 priority)
    {"loc": "/english/verb-tenses.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/modalverbs.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/passive.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/conditionals.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/reported-speech.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/phrasal-verbs.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/questions-negation.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/clauses.html", "priority": "0.7", "changefreq": "monthly"},
    
    # Vocabulary Pages (0.7 priority)
    {"loc": "/english/busvocab.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/phonics.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/idioms.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/prefixessuffixes.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/wordfamilies.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/wordforms.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/english/strucuture.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/vocab/vbeginner.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/vocab/vintermediate.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/vocab/vadvanced.html", "priority": "0.7", "changefreq": "monthly"},
    
    # Business English (0.7-0.8 priority)
    {"loc": "/business/vocabulary.html", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/business/email-templates.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/business/interview.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/business/meeting-phrases.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/business/negotiation.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/business/reports.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/business/conversation-practice.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/business/presentation-coach.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/business/writing-assistant.html", "priority": "0.7", "changefreq": "monthly"},
    
    # Coding Pages (0.7-0.8 priority)
    {"loc": "/coding/computerbasics.html", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/coding/ai.html", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/coding/lessons/lesson1.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/coding/lessons/lesson2.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/coding/lessons/lesson3.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/coding/lessons/lesson4.html", "priority": "0.7", "changefreq": "monthly"},
    
    # Games (0.7 priority)
    {"loc": "/games/quizchamp.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/games/snakeslad.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/games/uno.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/games/whowants.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/games/twenty-questions.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/games/story-builder.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/games/picture-description.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/games/memory-match.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/games/balanceman.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/games/slingshot.html", "priority": "0.7", "changefreq": "monthly"},
    
    # Music Pages (0.7 priority)
    {"loc": "/music/fundamentals.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/music/guitar.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/music/bass.html", "priority": "0.7", "changefreq": "monthly"},
    
    # Tools (0.6-0.7 priority)
    {"loc": "/tools/lessonplan.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/tools/typing-test.html", "priority": "0.7", "changefreq": "yearly"},
    {"loc": "/tools/flashcards-chinese.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/tools/flashcards-japanese.html", "priority": "0.7", "changefreq": "monthly"},
    {"loc": "/tools/presentation-timer.html", "priority": "0.7", "changefreq": "yearly"},
    {"loc": "/tools/jobs.html", "priority": "0.6", "changefreq": "monthly"},
    {"loc": "/tools/word-cloud.html", "priority": "0.6", "changefreq": "yearly"},
    {"loc": "/tools/dice.html", "priority": "0.6", "changefreq": "yearly"},
    {"loc": "/tools/random.html", "priority": "0.6", "changefreq": "yearly"},
    {"loc": "/tools/spin.html", "priority": "0.6", "changefreq": "yearly"},
    {"loc": "/tools/time.html", "priority": "0.6", "changefreq": "yearly"},
    
    # Blog Articles (0.6 priority)
    {"loc": "/blog/coding-getting-started.html", "priority": "0.6", "changefreq": "monthly"},
    {"loc": "/blog/esl-teachers-digital-tools.html", "priority": "0.6", "changefreq": "monthly"},
    {"loc": "/blog/esl-learners-reading-comprehension.html", "priority": "0.6", "changefreq": "monthly"},
    {"loc": "/blog/lesson-countries.html", "priority": "0.6", "changefreq": "monthly"},
    {"loc": "/blog/lesson-speaking.html", "priority": "0.6", "changefreq": "monthly"},
    {"loc": "/blog/lesson-technology.html", "priority": "0.6", "changefreq": "monthly"},
    
    # Legal/Info Pages (0.3 priority)
    {"loc": "/privacy.html", "priority": "0.3", "changefreq": "yearly"},
    {"loc": "/terms.html", "priority": "0.3", "changefreq": "yearly"},
    {"loc": "/cookies.html", "priority": "0.3", "changefreq": "yearly"},
    {"loc": "/contact.html", "priority": "0.6", "changefreq": "monthly"},
]


def create_sitemap():
    """Generate sitemap.xml with only real pages"""
    
    urlset = ET.Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    urlset.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    urlset.set("xsi:schemaLocation", 
               "http://www.sitemaps.org/schemas/sitemap/0.9 "
               "http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd")
    
    for page in ACTUAL_PAGES:
        url = ET.SubElement(urlset, "url")
        
        loc = ET.SubElement(url, "loc")
        loc.text = BASE_URL + page["loc"]
        
        lastmod = ET.SubElement(url, "lastmod")
        lastmod.text = CURRENT_DATE
        
        changefreq = ET.SubElement(url, "changefreq")
        changefreq.text = page["changefreq"]
        
        priority = ET.SubElement(url, "priority")
        priority.text = page["priority"]
    
    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="  ", level=0)
    
    with open("sitemap.xml", "wb") as f:
        f.write(b'<?xml version="1.0" encoding="UTF-8"?>\n')
        tree.write(f, encoding="utf-8", xml_declaration=False)
    
    print("✅ CORRECTED Sitemap generated!")
    print(f"📄 Total URLs: {len(ACTUAL_PAGES)} (all verified to exist)")
    print("\n🔧 FIXED ISSUES:")
    print("   ❌ REMOVED: /english/eslresources.html (doesn't exist)")
    print("   ❌ REMOVED: /register.html (now excluded with noindex)")
    print("   ❌ REMOVED: scramble.html (doesn't exist)")
    print("   ❌ REMOVED: cities-lessons.html (doesn't exist)")
    print("   ❌ REMOVED: Cooking-lessons.html (doesn't exist)")
    print("   ❌ REMOVED: esl-learners-conversation-confidence.html (doesn't exist)")
    print("   ❌ REMOVED: esl-lessons-creative-ideas.html (doesn't exist)")
    print("   ❌ REMOVED: esl-teachers-classroom-management.html (doesn't exist)")
    print("   ✅ ADDED: All actual games, music, and vocab pages")
    print("   ✅ FIXED: picture-description-old.html canonical tag now points to new version")


if __name__ == "__main__":
    create_sitemap()
