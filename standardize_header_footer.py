#!/usr/bin/env python3
"""
Standardize header and footer across all HTML pages to match games/games.html.
Replaces <header>...</header> and <footer>...</footer> blocks with canonical
versions, adjusting relative paths based on each file's directory depth.
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))

HEADER_TEMPLATE = """<header>
      <div class="container">
        <nav class="navbar">
          <a href="{P}index.html" class="logo-container">
            <img
              src="{P}images/1.png"
              alt="ESL Fun Online Logo"
              class="logo-image"
              width="40"
              height="40"
            />
            <span class="logo-text">ESL Fun Online</span>
            role="menubar"
                <a href="{P}resources/index.html"
                  ><i class="fas fa-book-open"></i><span>Resources</span></a
                >
              </li>
              <li>
            aria-label="Main navigation"
          >
            <li class="nav-item" role="none">
              <a href="{P}index.html" class="nav-link" role="menuitem">
                <i class="fas fa-home"></i>
                Home
              </a>
            </li>
            <li class="nav-item" role="none">
              <a href="{P}games/games.html" class="nav-link" role="menuitem">
                <i class="fas fa-dice"></i>
                Games
              </a>
            </li>
            <li class="nav-item" role="none">
              <a href="{P}resources/index.html" class="nav-link" role="menuitem">
                <i class="fas fa-book-open"></i>
                Resources
              </a>
            </li>
            <li class="nav-item" role="none">
              <a href="{P}teacher-hub/index.html" class="nav-link" role="menuitem">
                <i class="fas fa-chalkboard-user"></i>
                Teacher
              </a>
            </li>
            <li class="nav-item" role="none">
              <a href="{P}resources/lessons-and-blog/blog.html" class="nav-link" role="menuitem">
                <i class="fas fa-blog"></i>
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
    </header>"""

FOOTER_TEMPLATE = """<footer>
      <div class="container">
        <div class="footer-content">
          <!-- Brand Section -->
          <div class="footer-section footer-brand">
            <div class="brand-header">
              <picture>
                <source
                  srcset="{P}images/logo-optimized.webp"
                  type="image/webp"
                />
                <img
                  src="{P}images/logo-optimized.png"
                  alt="ESL Fun Online"
                  class="footer-logo"
                  loading="lazy"
                  decoding="async"
                  width="40"
                  height="40"
                />
              </picture>
              <h3>ESL Fun Online</h3>
            </div>
            <p>
              Transform your English skills with our premium interactive
              resources.
            </p>
          </div>

          <!-- English Learning Section -->
          <div class="footer-section">
            <h3><i class="fas fa-graduation-cap"></i> English</h3>
            <ul>
              <li>
                <a href="{P}resources/english/grammar.html"
                  ><i class="fas fa-spell-check"></i><span>Grammar</span></a
                >
              </li>
              <li>
                <a href="{P}resources/english/vocabguide.html"
                  ><i class="fas fa-book-open"></i><span>Vocabulary</span></a
                >
              </li>
              <li>
                <a href="{P}resources/business/presentation-coach.html"
                  ><i class="fas fa-handshake"></i><span>Business</span></a
                >
              </li>
            </ul>
          </div>

          <!-- Quick Links Section -->
          <div class="footer-section">
            <h3><i class="fas fa-link"></i> Quick Links</h3>
            <ul>
              <li>
                <a href="{P}lessons.html"
                  ><i class="fas fa-chalkboard-teacher"></i
                  ><span>Lessons</span></a
                >
              </li>
              <li>
                <a href="{P}games/games.html"
                  ><i class="fas fa-gamepad"></i><span>Games</span></a
                >
              </li>
              <li>
                <a href="{P}teacher-hub/index.html"
                  ><i class="fas fa-tools"></i><span>Tools</span></a
                >
              </li>
              <li>
                <a href="{P}resources/lessons-and-blog/blog.html"
                  ><i class="fas fa-book-open"></i><span>Blog</span></a
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="footer-bottom-center">
            <div class="footer-links">
              <a href="{P}privacy.html"
                ><i class="fas fa-shield-alt"></i>Privacy</a
              >
              <a href="{P}terms.html"
                ><i class="fas fa-file-contract"></i>Terms</a
              >
              <a href="{P}cookies.html"
                ><i class="fas fa-cookie-bite"></i>Cookies</a
              >
            </div>
          </div>

          <div class="footer-bottom-left">
            <p>
              &copy; 2025 <strong>ESL Fun Online</strong>. All rights reserved.
            </p>
            <p class="footer-subtitle">Empowering learners worldwide</p>
          </div>

          <div class="footer-bottom-right">
            <div class="footer-badges">
              <div class="badge">
                <i class="fas fa-award"></i><span>Certified</span>
              </div>
              <div class="badge">
                <i class="fas fa-lock"></i><span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>"""

# Only match BARE <header>/<footer> tags (no class attribute) - this excludes
# in-game headers (class="game-nav-header"), article bylines (class="article-header"),
# and modal headers/footers which use class attributes to distinguish themselves
# from the real site navigation header/footer.
HEADER_RE = re.compile(r"<header>(.*?)</header>", re.DOTALL | re.IGNORECASE)
FOOTER_RE = re.compile(r"<footer>(.*?)</footer>", re.DOTALL | re.IGNORECASE)

SKIP_FILES = {
    "standardize_header_footer.py",
}

SKIP_DIRS = {".git", "node_modules", ".dev-files"}


def get_prefix(filepath):
    d = os.path.dirname(filepath)
    rel = os.path.relpath(ROOT, d)
    if rel == ".":
        return ""
    return rel.replace(os.sep, "/") + "/"


def is_site_header(inner):
    return "navbar" in inner and "nav-links" in inner


def is_site_footer(inner):
    return "footer-content" in inner or "ESL Fun Online" in inner


def process_file(filepath, dry_run=False):
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    prefix = get_prefix(filepath)
    header_html = HEADER_TEMPLATE.format(P=prefix)
    footer_html = FOOTER_TEMPLATE.format(P=prefix)

    header_count = 0
    footer_count = 0

    def header_sub(m):
        nonlocal header_count
        if is_site_header(m.group(1)):
            header_count += 1
            return header_html
        return m.group(0)

    def footer_sub(m):
        nonlocal footer_count
        if is_site_footer(m.group(1)):
            footer_count += 1
            return footer_html
        return m.group(0)

    new_content = HEADER_RE.sub(header_sub, content)
    new_content = FOOTER_RE.sub(footer_sub, new_content)

    if (header_count or footer_count) and not dry_run:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)

    return header_count, footer_count


def main():
    import sys
    dry_run = "--dry-run" in sys.argv

    total_files = 0
    header_updated = 0
    footer_updated = 0
    no_match = []

    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for filename in filenames:
            if not filename.endswith(".html"):
                continue
            if filename in SKIP_FILES:
                continue
            filepath = os.path.join(dirpath, filename)
            total_files += 1
            h, f_ = process_file(filepath, dry_run=dry_run)
            if h:
                header_updated += 1
            if f_:
                footer_updated += 1
            if not h and not f_:
                no_match.append(os.path.relpath(filepath, ROOT))

    print(f"{'[DRY RUN] ' if dry_run else ''}Total HTML files scanned: {total_files}")
    print(f"Headers updated: {header_updated}")
    print(f"Footers updated: {footer_updated}")
    print(f"Files with NO header/footer match ({len(no_match)}):")
    for p in no_match:
        print(f"  - {p}")


if __name__ == "__main__":
    main()
