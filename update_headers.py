#!/usr/bin/env python3
"""
Script to update headers across all HTML files in the ESL Online website
to match the index.html header structure with proper mobile menu functionality.
"""

import os
import re
from pathlib import Path

# Base directory
BASE_DIR = Path("/Users/dillchalisas/ESLonline")

# Files to skip (backups, templates, etc.)
SKIP_PATTERNS = [
    'mobile-menu-fix-backups',
    'SECURITY_TEMPLATE.html',
    'debug-theme.html',
    'seo-fix-script.html',
    'idioms-grid-section.html',
    'idioms-compact.html',
    'header-template.html',
    'ad-snippets.html',
    '-old.html',
    'performance-optimization.html',
    'brand-monitoring-dashboard.html'
]

def should_skip_file(file_path):
    """Check if file should be skipped"""
    file_str = str(file_path)
    return any(pattern in file_str for pattern in SKIP_PATTERNS)

def get_relative_path(from_file):
    """Get relative path prefix based on file location"""
    rel_path = os.path.relpath(BASE_DIR, from_file.parent)
    if rel_path == '.':
        return ''
    return rel_path + '/'

def get_header_html(prefix=''):
    """Generate header HTML with proper path prefix"""
    return f'''    <!-- Scroll Progress Indicator -->
    <div class="scroll-progress" id="scrollProgress"></div>
    <!-- Header & Navigation -->
    <header>
      <div class="container">
        <nav class="navbar">
          <a href="{prefix}index.html" class="logo-container">
            <img
              src="{prefix}images/1.png"
              alt="ESL Fun Online Logo"
              class="logo-image"
              width="40"
              height="40"
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
              <a href="{prefix}index.html" class="nav-link" role="menuitem">
                <i class="fas fa-home"></i>
                Home
              </a>
            </li>
            <li class="nav-item" role="none">
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
                <a href="{prefix}english/grammar.html" class="dropdown-item">
                  <i class="fas fa-spell-check"></i>
                  Grammar Guides
                </a>
                <a href="{prefix}english/vocabguide.html" class="dropdown-item">
                  <i class="fas fa-book-open"></i>
                  Vocabulary Building
                </a>
                <a href="{prefix}english/worksheets.html" class="dropdown-item">
                  <i class="fas fa-file-alt"></i>
                  Worksheets
                </a>
                <a href="{prefix}english/writingf.html" class="dropdown-item">
                  <i class="fas fa-pen"></i>
                  Writing for Success
                </a>
                <a href="{prefix}english/business.html" class="dropdown-item">
                  <i class="fas fa-briefcase"></i>
                  Business English
                </a>
                <a href="{prefix}english/test.html" class="dropdown-item">
                  <i class="fas fa-graduation-cap"></i>
                  Test Preparation
                </a>
              </div>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">
                <i class="fas fa-code"></i>
                Coding
                <i class="fas fa-chevron-down"></i>
              </a>
              <div class="dropdown">
                <a href="{prefix}coding/computerbasics.html" class="dropdown-item">
                  <i class="fas fa-desktop"></i>
                  Computer Basics
                </a>
                <a href="{prefix}coding/ai.html" class="dropdown-item">
                  <i class="fas fa-robot"></i>
                  AI Basics
                </a>
                <a href="{prefix}coding/codingresources.html" class="dropdown-item">
                  <i class="fas fa-code"></i>
                  Coding Basics
                </a>
              </div>
            </li>

            <li class="nav-item">
              <a href="{prefix}games/games.html" class="nav-link">
                <i class="fas fa-dice"></i>
                Games
              </a>
            </li>
            <li class="nav-item">
              <a href="{prefix}tools/tools.html" class="nav-link">
                <i class="fas fa-tools"></i>
                Toolkit
              </a>
            </li>
            <li class="nav-item">
              <a href="{prefix}blog/blog.html" class="nav-link">
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
              href="{prefix}login.html"
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
    </header>'''

def get_mobile_menu_script():
    """Get the complete mobile menu script"""
    return '''
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

          console.log("Immediate mobile menu initialized");

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
              console.log("Menu opened");
            } else {
              navLinks.classList.remove("active");
              body.classList.remove("mobile-menu-open");
              body.style.overflow = "";
              if (icon) icon.className = "fas fa-bars";
              console.log("Menu closed");

              // Close all dropdowns
              document.querySelectorAll(".nav-item").forEach((item) => {
                item.classList.remove("mobile-open", "mobile-dropdown-open");
                const chevron = item.querySelector(".fa-chevron-down");
                if (chevron) chevron.style.transform = "rotate(0deg)";
              });
            }
          }

          // Simple unified handler - works for both touch and click
          let lastToggleTime = 0;

          function handleToggleClick(e) {
            const now = Date.now();
            // Prevent double-firing within 300ms
            if (now - lastToggleTime < 300) {
              console.log("Toggle ignored - too fast");
              return;
            }
            lastToggleTime = now;

            e.preventDefault();
            e.stopPropagation();
            console.log("Hamburger clicked/tapped");
            toggleMenu(e);
          }

          mobileToggle.addEventListener("click", handleToggleClick);
          mobileToggle.addEventListener("touchend", handleToggleClick);

          // Handle dropdown toggles on mobile
          document.querySelectorAll(".nav-item").forEach((item) => {
            const link = item.querySelector(".nav-link");
            const dropdown = item.querySelector(".dropdown");
            const chevron = link?.querySelector(".fa-chevron-down");

            // Only add special handling for links WITH dropdowns
            if (link && dropdown && chevron) {
              // Simple unified dropdown handler
              let lastDropdownToggle = 0;

              function handleDropdownClick(e) {
                if (window.innerWidth > 768) return; // Only on mobile

                // Don't interfere with dropdown item clicks
                if (
                  e.target.closest(".dropdown-item") ||
                  e.target.closest(".dropdown a")
                ) {
                  console.log("Dropdown item clicked - allowing navigation");
                  return; // Let the link work normally
                }

                const now = Date.now();
                // Prevent double-firing within 300ms
                if (now - lastDropdownToggle < 300) {
                  console.log("Dropdown toggle ignored - too fast");
                  return;
                }
                lastDropdownToggle = now;

                e.preventDefault();
                e.stopPropagation();

                const isOpen = item.classList.contains("mobile-open");
                console.log(
                  "Dropdown clicked:",
                  isOpen ? "closing" : "opening"
                );

                // Close other dropdowns
                document.querySelectorAll(".nav-item").forEach((otherItem) => {
                  if (otherItem !== item) {
                    otherItem.classList.remove(
                      "mobile-open",
                      "mobile-dropdown-open"
                    );
                    const otherChevron =
                      otherItem.querySelector(".fa-chevron-down");
                    if (otherChevron)
                      otherChevron.style.transform = "rotate(0deg)";
                  }
                });

                // Toggle current dropdown
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

              // Remove href="#" behavior on mobile
              if (link.getAttribute("href") === "#") {
                link.style.cursor = "pointer";
              }

              // Attach handlers for both click and touch
              link.addEventListener("click", handleDropdownClick);
              link.addEventListener("touchend", handleDropdownClick);
            }
          });

          // Close menu when clicking outside
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

          // Close menu on escape key
          document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && isMenuOpen) {
              toggleMenu(null);
              mobileToggle.focus();
            }
          });

          // Close menu on window resize to desktop
          window.addEventListener("resize", function () {
            if (window.innerWidth > 768 && isMenuOpen) {
              toggleMenu(null);
            }
          });

          // Close menu after dropdown link click
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

        // Initialize immediately if DOM is ready, otherwise wait
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", initMobileMenu);
        } else {
          initMobileMenu();
        }
      })();
    </script>

    <!-- Additional Mobile Dropdown Fixes -->
    <style>
      /* Ensure mobile dropdowns work properly */
      @media (max-width: 768px) {
        /* FORCE mobile menu to display full width */
        .nav-links,
        #navLinks,
        ul.nav-links {
          display: flex !important;
          position: fixed !important;
          top: 70px !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: auto !important;
          min-height: calc(100vh - 70px) !important;
        }

        .nav-links.active,
        #navLinks.active,
        ul.nav-links.active {
          display: flex !important;
          max-height: calc(100vh - 70px) !important;
          height: auto !important;
        }

        /* Make sure nav links with dropdowns are clearly tappable */
        .nav-item .nav-link {
          position: relative;
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: rgba(70, 187, 229, 0.2);
          cursor: pointer;
        }

        /* Ensure chevron is visible and clickable */
        .nav-link .fa-chevron-down {
          transition: transform 0.3s ease !important;
          opacity: 1 !important;
          pointer-events: none; /* Let clicks go through to parent link */
        }

        /* Visual feedback when dropdown is open */
        .nav-item.mobile-open > .nav-link,
        .nav-item.mobile-dropdown-open > .nav-link {
          background: rgba(70, 187, 229, 0.15) !important;
          border-color: var(--primary-color, #46bbe5) !important;
        }

        /* Make dropdowns smoother */
        .dropdown {
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            padding 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Ensure dropdown items are visible when parent is open */
        .nav-item.mobile-open .dropdown,
        .nav-item.mobile-dropdown-open .dropdown {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }

        /* Ensure dropdown items are clickable */
        .dropdown-item,
        .dropdown > a {
          pointer-events: auto !important;
          touch-action: manipulation !important;
          user-select: none;
          -webkit-user-select: none;
        }
      }
    </style>'''

def update_header_in_file(file_path):
    """Update header in a single HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Calculate relative path prefix
        prefix = get_relative_path(file_path)
        
        # Pattern to match header section (from <header> to </header>)
        header_pattern = r'<header>.*?</header>'
        
        # Pattern to match mobile menu script if it exists
        mobile_script_pattern = r'<!--\s*Immediate Mobile Menu Script.*?</style>'
        
        # Get new header and script
        new_header = get_header_html(prefix)
        new_script = get_mobile_menu_script()
        
        # Replace header
        if re.search(header_pattern, content, re.DOTALL):
            content = re.sub(header_pattern, new_header, content, flags=re.DOTALL, count=1)
            print(f"✓ Updated header in: {file_path.relative_to(BASE_DIR)}")
        else:
            print(f"✗ No header found in: {file_path.relative_to(BASE_DIR)}")
            return False
        
        # Replace or add mobile menu script
        if re.search(mobile_script_pattern, content, re.DOTALL):
            content = re.sub(mobile_script_pattern, new_script, content, flags=re.DOTALL, count=1)
            print(f"  ↳ Updated mobile menu script")
        else:
            # Try to add after header
            content = content.replace('</header>', f'</header>{new_script}', 1)
            print(f"  ↳ Added mobile menu script")
        
        # Write updated content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
        
    except Exception as e:
        print(f"✗ Error updating {file_path.relative_to(BASE_DIR)}: {e}")
        return False

def main():
    """Main function to update all HTML files"""
    print("Starting header update process...")
    print("=" * 60)
    
    # Find all HTML files
    html_files = list(BASE_DIR.rglob('*.html'))
    
    # Filter out files to skip
    html_files = [f for f in html_files if not should_skip_file(f)]
    
    print(f"\nFound {len(html_files)} HTML files to update\n")
    
    updated_count = 0
    failed_count = 0
    
    for html_file in sorted(html_files):
        if update_header_in_file(html_file):
            updated_count += 1
        else:
            failed_count += 1
    
    print("\n" + "=" * 60)
    print(f"Update complete!")
    print(f"✓ Successfully updated: {updated_count} files")
    if failed_count > 0:
        print(f"✗ Failed: {failed_count} files")
    print("=" * 60)

if __name__ == "__main__":
    main()
