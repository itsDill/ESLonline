#!/usr/bin/env python3
"""
Fix grammar pages by adding missing CSS links, full header, and hero section
"""

import os
import re
from pathlib import Path
from bs4 import BeautifulSoup
import shutil
from datetime import datetime

# Pages that need fixing
PAGES_TO_FIX = [
    "passive.html",
    "reported-speech.html",
    "parts-of-speech.html",
    "wordforms.html",
    "prefixessuffixes.html",
    "wordfamilies.html",
    "strucuture.html",
    "clauses.html",
    "conditionals.html",
    "questions-negation.html",
    "articles.html",
    "nouns.html",
    "prepositions.html",
    "pronouns.html",
    "adjectives-adverbs.html",
    "comparatives.html",
    "relative-clauses.html",
    "gerunds-infinitives.html",
    "punctuation.html",
    "collocations.html",
    "discourse-markers.html"
]

ENGLISH_DIR = Path("/Users/dillchalisas/ESLonline/english")
BACKUP_DIR = Path("/Users/dillchalisas/ESLonline/grammar-pages-backup-" + datetime.now().strftime("%Y%m%d_%H%M%S"))

# CSS links that should be present (in order)
REQUIRED_CSS = [
    '../css/header.css',
    '../css/mobile-menu.css',
    '../css/mobile-optimized.css',
    '../css/main.css',
    '../css/layout-fixes.css'
]

def backup_file(filepath):
    """Create a backup of the file"""
    BACKUP_DIR.mkdir(exist_ok=True)
    backup_path = BACKUP_DIR / filepath.name
    shutil.copy2(filepath, backup_path)
    print(f"  ✓ Backed up to {backup_path}")

def get_page_title(filename):
    """Generate appropriate page title from filename"""
    titles = {
        "passive.html": ("Passive Voice", "Master the passive voice across all tenses with interactive quizzes"),
        "reported-speech.html": ("Reported Speech", "Learn how to report what others say accurately"),
        "parts-of-speech.html": ("Parts of Speech", "Master nouns, verbs, adjectives, adverbs, and more"),
        "wordforms.html": ("Word Forms", "Learn how words change their form and function"),
        "prefixessuffixes.html": ("Prefixes & Suffixes", "Build vocabulary by understanding word building blocks"),
        "wordfamilies.html": ("Word Families", "Explore groups of related words"),
        "strucuture.html": ("Sentence Structure", "Learn to construct clear, effective sentences"),
        "clauses.html": ("Clauses & Phrases", "Master clauses and phrases for complex sentences"),
        "conditionals.html": ("Conditionals", "Master if-clauses and hypothetical situations"),
        "questions-negation.html": ("Questions & Negation", "Learn to ask questions and make negative statements"),
        "articles.html": ("Articles (a, an, the)", "Master the use of definite and indefinite articles"),
        "nouns.html": ("Nouns & Countability", "Understand countable and uncountable nouns"),
        "prepositions.html": ("Prepositions", "Master prepositions of time, place, and movement"),
        "pronouns.html": ("Pronouns", "Learn subject, object, possessive, and reflexive pronouns"),
        "adjectives-adverbs.html": ("Adjectives & Adverbs", "Describe nouns and modify verbs effectively"),
        "comparatives.html": ("Comparatives & Superlatives", "Compare things using comparative and superlative forms"),
        "relative-clauses.html": ("Relative Clauses", "Combine sentences using who, which, that, and more"),
        "gerunds-infinitives.html": ("Gerunds & Infinitives", "Learn when to use -ing forms and to-infinitives"),
        "punctuation.html": ("Punctuation", "Master commas, apostrophes, semicolons, and more"),
        "collocations.html": ("Collocations", "Learn natural word combinations"),
        "discourse-markers.html": ("Discourse Markers", "Connect ideas smoothly with linking words")
    }
    return titles.get(filename, (filename.replace(".html", "").replace("-", " ").title(), "Learn English grammar"))

def add_css_links(soup, head):
    """Add missing CSS links to head"""
    # Check which CSS files are already present
    existing_css = set()
    for link in head.find_all('link', {'rel': 'stylesheet'}):
        href = link.get('href', '')
        if href:
            existing_css.add(href)
    
    # Find where to insert (after font awesome or other stylesheets, before </head>)
    insert_after = None
    for link in head.find_all('link', {'rel': 'stylesheet'}):
        href = link.get('href', '')
        if 'font-awesome' in href or 'fonts.googleapis' in href:
            insert_after = link
    
    # Add missing CSS files
    added = []
    for css_file in REQUIRED_CSS:
        if css_file not in existing_css:
            new_link = soup.new_tag('link', rel='stylesheet', href=css_file)
            if insert_after:
                insert_after.insert_after(new_link)
                insert_after = new_link
            else:
                head.append(new_link)
            added.append(css_file)
    
    return added

def has_full_header(soup):
    """Check if page has full navigation header"""
    return soup.find('ul', {'class': 'nav-links', 'id': 'navLinks'}) is not None

def has_hero_section(soup):
    """Check if page has hero section"""
    return soup.find('section', {'class': ['hero', 'hero-section']}) is not None

def create_header():
    """Create full header HTML"""
    return '''<header>
      <div class="container">
        <nav class="navbar">
          <a href="../index.html" class="logo-container">
            <img
              src="../images/1.png"
              alt="ESL Fun Online Logo"
              class="logo-image"
            />
            <span class="logo-text">ESL Fun Online</span>
          </a>

          <ul
            class="nav-links"
            id="navLinks"
            role="menubar"
            aria-label="Main navigation"
          >
            <li class="nav-item" role="none">
              <a href="../index.html" class="nav-link" role="menuitem">
                <i class="fas fa-home"></i>
                Home
              </a>
            </li>
            <li class="nav-item current" role="none">
              <a
                href="#"
                class="nav-link"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fas fa-book"></i>
                English
                <i class="fas fa-chevron-down"></i>
              </a>
              <div class="dropdown" role="menu" aria-label="English submenu">
                <a href="grammar.html" class="dropdown-item">
                  <i class="fas fa-spell-check"></i>
                  Grammar Guides
                </a>
                <a href="vocabguide.html" class="dropdown-item">
                  <i class="fas fa-book-open"></i>
                  Vocabulary Building
                </a>
                <a href="worksheets.html" class="dropdown-item">
                  <i class="fas fa-file-alt"></i>
                  Worksheets
                </a>
                <a href="writingf.html" class="dropdown-item">
                  <i class="fas fa-pen"></i>
                  Writing for Success
                </a>
                <a href="business.html" class="dropdown-item">
                  <i class="fas fa-briefcase"></i>
                  Business English
                </a>
                <a href="test.html" class="dropdown-item">
                  <i class="fas fa-graduation-cap"></i>
                  Test Preparation
                </a>
              </div>
            </li>
            <li class="nav-item" role="none">
              <a
                href="#"
                class="nav-link"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fas fa-code"></i>
                Coding
                <i class="fas fa-chevron-down"></i>
              </a>
              <div class="dropdown" role="menu" aria-label="Coding submenu">
                <a href="../coding/computerbasics.html" class="dropdown-item">
                  <i class="fas fa-desktop"></i>
                  Computer Basics
                </a>
                <a href="../coding/ai.html" class="dropdown-item">
                  <i class="fas fa-robot"></i>
                  AI Basics
                </a>
                <a href="../coding/codingresources.html" class="dropdown-item">
                  <i class="fas fa-terminal"></i>
                  Coding Resources
                </a>
              </div>
            </li>
            <li class="nav-item" role="none">
              <a href="../games/games.html" class="nav-link" role="menuitem">
                <i class="fas fa-dice"></i>
                Games
              </a>
            </li>
            <li class="nav-item" role="none">
              <a href="../tools/tools.html" class="nav-link" role="menuitem">
                <i class="fas fa-tools"></i>
                Toolkit
              </a>
            </li>
            <li class="nav-item" role="none">
              <a href="../blog/blog.html" class="nav-link" role="menuitem">
                <i class="fas fa-book-open"></i>
                Blog
              </a>
            </li>
          </ul>

          <div class="controls">
            <button
              class="control-btn theme-toggle"
              id="themeToggle"
              aria-label="Toggle dark mode"
            >
              <i class="fas fa-moon"></i>
            </button>
            <a
              class="control-btn admin-toggle"
              id="adminToggle"
              aria-label="Admin"
              href="../login.html"
            >
              <i class="fas fa-user-shield"></i>
            </a>
          </div>
          <button
            class="control-btn mobile-toggle"
            id="mobileToggle"
            aria-label="Toggle mobile menu"
          >
            <i class="fas fa-bars"></i>
          </button>
        </nav>
      </div>
    </header>

    <!-- Immediate Mobile Menu Script - Inline for guaranteed execution -->
    <script>
      (function () {
        "use strict";

        function initMobileMenu() {
          const mobileToggle = document.getElementById("mobileToggle");
          const navLinks = document.getElementById("navLinks");
          const body = document.body;

          if (!mobileToggle || !navLinks) {
            console.warn("Mobile menu elements not found");
            return;
          }

          let isMenuOpen = false;

          function toggleMenu(e) {
            if (e && e.preventDefault) e.preventDefault();
            if (e && e.stopPropagation) e.stopPropagation();

            isMenuOpen = !isMenuOpen;
            const icon = mobileToggle.querySelector("i");

            if (isMenuOpen) {
              navLinks.classList.add("active");
              body.classList.add("mobile-menu-open");
              body.style.overflow = "hidden";
              if (icon) icon.className = "fas fa-times";
            } else {
              navLinks.classList.remove("active");
              body.classList.remove("mobile-menu-open");
              body.style.overflow = "";
              if (icon) icon.className = "fas fa-bars";

              document.querySelectorAll(".nav-item").forEach((item) => {
                item.classList.remove("mobile-open", "mobile-dropdown-open");
                const chevron = item.querySelector(".fa-chevron-down");
                if (chevron) chevron.style.transform = "rotate(0deg)";
              });
            }
          }

          let lastToggleTime = 0;
          
          function handleToggleClick(e) {
            const now = Date.now();
            if (now - lastToggleTime < 300) return;
            lastToggleTime = now;
            
            e.preventDefault();
            e.stopPropagation();
            toggleMenu(e);
          }

          mobileToggle.addEventListener("click", handleToggleClick);
          mobileToggle.addEventListener("touchend", handleToggleClick);

          document.querySelectorAll(".nav-item").forEach((item) => {
            const link = item.querySelector(".nav-link");
            const dropdown = item.querySelector(".dropdown");
            const chevron = link?.querySelector(".fa-chevron-down");

            if (link && dropdown && chevron) {
              let lastDropdownToggle = 0;
              
              function handleDropdownClick(e) {
                if (window.innerWidth > 768) return;
                
                const now = Date.now();
                if (now - lastDropdownToggle < 300) return;
                lastDropdownToggle = now;
                
                e.preventDefault();
                e.stopPropagation();

                const isOpen = item.classList.contains("mobile-open");

                document.querySelectorAll(".nav-item").forEach((otherItem) => {
                  if (otherItem !== item) {
                    otherItem.classList.remove("mobile-open", "mobile-dropdown-open");
                    const otherChevron = otherItem.querySelector(".fa-chevron-down");
                    if (otherChevron) otherChevron.style.transform = "rotate(0deg)";
                  }
                });

                if (isOpen) {
                  item.classList.remove("mobile-open", "mobile-dropdown-open");
                  chevron.style.transform = "rotate(0deg)";
                  link.setAttribute("aria-expanded", "false");
                } else {
                  item.classList.add("mobile-open", "mobile-dropdown-open");
                  chevron.style.transform = "rotate(180deg)";
                  link.setAttribute("aria-expanded", "true");
                }
              }

              if (link.getAttribute("href") === "#") {
                link.style.cursor = "pointer";
              }

              link.addEventListener("click", handleDropdownClick);
              link.addEventListener("touchend", handleDropdownClick);
            }
          });

          document.addEventListener("click", function (e) {
            if (window.innerWidth <= 768 && isMenuOpen) {
              if (
                !mobileToggle.contains(e.target) &&
                !navLinks.contains(e.target)
              ) {
                toggleMenu(null);
              }
            }
          });

          document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && isMenuOpen) {
              toggleMenu(null);
              mobileToggle.focus();
            }
          });

          window.addEventListener("resize", function () {
            if (window.innerWidth > 768 && isMenuOpen) {
              toggleMenu(null);
            }
          });

          document.querySelectorAll(".dropdown a").forEach((link) => {
            link.addEventListener("click", function () {
              if (window.innerWidth <= 768 && isMenuOpen) {
                setTimeout(() => {
                  toggleMenu(null);
                }, 100);
              }
            });
          });
        }

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", initMobileMenu);
        } else {
          initMobileMenu();
        }
      })();
    </script>'''

def create_hero_section(title, subtitle):
    """Create hero section HTML"""
    return f'''<!-- Hero Section -->
    <section class="hero">
      <img
        src="../images/hero.webp"
        alt="ESL Fun Online Background"
        class="hero-bg"
      />
      <div class="hero-content">
        <h1 class="hero-title">{title}</h1>
        <p class="hero-subtitle">
          {subtitle}
        </p>
      </div>
    </section>'''

def fix_page(filepath):
    """Fix a single grammar page"""
    print(f"\nProcessing {filepath.name}...")
    
    # Backup first
    backup_file(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    head = soup.find('head')
    body = soup.find('body')
    
    if not head or not body:
        print(f"  ❌ Could not find head or body in {filepath.name}")
        return False
    
    changes = []
    
    # 1. Add missing CSS links
    added_css = add_css_links(soup, head)
    if added_css:
        changes.append(f"Added CSS: {', '.join(added_css)}")
    
    # 2. Fix or add header
    if not has_full_header(soup):
        # Remove existing incomplete header if present
        existing_header = body.find('header')
        if existing_header:
            existing_header.decompose()
        
        # Create new header
        header_html = create_header()
        header_soup = BeautifulSoup(header_html, 'html.parser')
        
        # Insert at beginning of body
        body.insert(0, header_soup)
        changes.append("Added full header with navigation")
    
    # 3. Add hero section if missing
    if not has_hero_section(soup):
        title, subtitle = get_page_title(filepath.name)
        hero_html = create_hero_section(title, subtitle)
        hero_soup = BeautifulSoup(hero_html, 'html.parser')
        
        # Insert after header
        header = body.find('header')
        if header:
            header.insert_after(hero_soup)
        else:
            body.insert(0, hero_soup)
        changes.append("Added hero section")
    
    # Write the updated content
    if changes:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        
        for change in changes:
            print(f"  ✓ {change}")
        return True
    else:
        print(f"  ℹ No changes needed")
        return False

def main():
    print("=" * 80)
    print("FIXING GRAMMAR PAGES - Adding CSS, Headers, and Hero Sections")
    print("=" * 80)
    print(f"\nBackup directory: {BACKUP_DIR}")
    print(f"Pages to fix: {len(PAGES_TO_FIX)}")
    
    input("\nPress Enter to continue...")
    
    fixed_count = 0
    for page in PAGES_TO_FIX:
        filepath = ENGLISH_DIR / page
        if filepath.exists():
            if fix_page(filepath):
                fixed_count += 1
        else:
            print(f"\n❌ {page}: FILE NOT FOUND")
    
    print("\n" + "=" * 80)
    print(f"COMPLETE: {fixed_count} pages modified")
    print("=" * 80)
    print(f"\nBackups saved to: {BACKUP_DIR}")

if __name__ == "__main__":
    main()
