#!/usr/bin/env python3
"""
Remove conflicting inline <style> CSS rules for header/navbar/nav-links selectors
from specific pages, since these pages now use the canonical header markup and
css/header-consolidated.css. Leftover inline rules with the same selectors were
overriding/conflicting with the standard styling.

Only removes simple standalone rule blocks (selector { ... }) for an exact list
of selectors, one rule at a time, first occurrence -> repeat until none left.
Does not touch combined/comma selectors (verified none exist in target files).
"""
import re
import sys

TARGET_SELECTORS = [
    "header",
    ".navbar",
    ".nav-links",
    ".nav-link",
    ".nav-item",
    ".logo-container",
    ".logo-image",
    ".logo-text",
    ".mobile-toggle",
    ".controls",
    ".control-btn",
    ".dropdown",
    ".dropdown-menu",
    ".dropdown-item",
    ".theme-toggle",
]

FILES = [
    "resources/lessons-and-blog/lesson-fluency-2026.html",
    "resources/lessons-and-blog/lesson-pronunciation.html",
    "resources/lessons-and-blog/lesson-fluency.html",
    "teacher-hub/reviews/bamreview.html",
    "teacher-hub/reviews/example.html",
    "teacher-hub/reviews/temreview.html",
    "coding/projects/to-do-list.html",
    "coding/lessons/lesson2.html",
    "coding/lessons/lesson3.html",
    "coding/lessons/lesson4.html",
    "coding/lessons/lesson1.html",
    "coding/tutorials/internet-search.html",
    "coding/tutorials/files-folders.html",
    "coding/tutorials/email-basics.html",
    "games/colourmagic.html",
]


def strip_rule(css, selector):
    """Remove a standalone `selector { ... }` block (no nested braces),
    optionally preceded by media-query nesting is NOT handled (top-level only).
    Also matches `selector,\n  .other {` NOT matched (we verified none exist).
    Repeats for all occurrences."""
    escaped = re.escape(selector)
    # selector must be followed by optional whitespace/newlines then `{`,
    # and must not be immediately preceded by a word char or `.` (avoid partial match
    # like `.card-header` matching `header`)
    if selector == "header":
        pattern = re.compile(
            r"(?<![.\w#-])" + escaped + r"\s*\{[^{}]*\}\s*", re.MULTILINE
        )
    else:
        pattern = re.compile(
            r"(?<![\w-])" + escaped + r"\s*\{[^{}]*\}\s*", re.MULTILINE
        )
    return pattern.subn("", css)


def process_file(filepath, dry_run=False):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    style_re = re.compile(r"(<style[^>]*>)(.*?)(</style>)", re.DOTALL | re.IGNORECASE)

    total_removed = 0

    def style_sub(m):
        nonlocal total_removed
        css = m.group(2)
        for sel in TARGET_SELECTORS:
            css, n = strip_rule(css, sel)
            total_removed += n
        return m.group(1) + css + m.group(3)

    new_content = style_re.sub(style_sub, content)

    if total_removed and not dry_run:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)

    return total_removed


def main():
    dry_run = "--dry-run" in sys.argv
    for rel in FILES:
        n = process_file(rel, dry_run=dry_run)
        print(f"{rel}: removed {n} rule(s)")


if __name__ == "__main__":
    main()
