#!/usr/bin/env python3
"""
Second-pass cleanup for the 14 legacy pages fixed by fix_legacy_header_pages.py.
Removes remaining old-header CSS remnants (bare `nav {}`, `.logo {}`,
`.nav-links a {}` / `.nav-links a:hover {}`) that still conflict with the new
standard header. Also resolves `.container` class collisions: the site standard
header/footer both use `class="container"`, but several of these pages ALSO used
`.container` for their own main-content wrapper with different sizing. Renames
that page-content usage (and its CSS rule) to `.page-container`, or deletes the
CSS rule entirely if it is now orphaned (no longer used by any page element).
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

STRIP_SELECTORS = ["nav", ".logo", ".nav-links a", ".nav-links a:hover"]

FILES_STRIP_NAV_REMNANTS = [
    "coding/lessons/lesson1.html",
    "coding/lessons/lesson2.html",
    "coding/lessons/lesson3.html",
    "coding/lessons/lesson4.html",
    "coding/tutorials/internet-search.html",
    "coding/tutorials/files-folders.html",
    "coding/tutorials/email-basics.html",
    "coding/projects/to-do-list.html",
    "resources/lessons-and-blog/lesson-pronunciation.html",
]

FILES_RENAME_CONTAINER = [
    "coding/lessons/lesson1.html",
    "coding/lessons/lesson2.html",
    "coding/lessons/lesson3.html",
    "coding/lessons/lesson4.html",
    "coding/tutorials/internet-search.html",
    "coding/tutorials/files-folders.html",
    "coding/tutorials/email-basics.html",
    "coding/projects/to-do-list.html",
    "resources/lessons-and-blog/lesson-fluency-2026.html",
    "resources/lessons-and-blog/lesson-pronunciation.html",
    "resources/lessons-and-blog/lesson-fluency.html",
]

FILES_DELETE_ORPHAN_CONTAINER_RULE = [
    "teacher-hub/reviews/bamreview.html",
    "teacher-hub/reviews/example.html",
    "teacher-hub/reviews/temreview.html",
]


def strip_rule(css, selector):
    escaped = re.escape(selector)
    if selector == "nav":
        pattern = re.compile(r"(?<![.\w#-])" + escaped + r"\s*\{[^{}]*\}\s*", re.MULTILINE)
    else:
        pattern = re.compile(escaped + r"\s*\{[^{}]*\}\s*", re.MULTILINE)
    return pattern.subn("", css)


def process(filepath, dry_run):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    orig = content
    rel = os.path.relpath(filepath, ROOT)
    notes = []

    style_re = re.compile(r"(<style[^>]*>)(.*?)(</style>)", re.DOTALL | re.IGNORECASE)

    if rel in FILES_STRIP_NAV_REMNANTS:
        total = 0

        def sub_strip(m):
            nonlocal total
            css = m.group(2)
            for sel in STRIP_SELECTORS:
                css, n = strip_rule(css, sel)
                total += n
            return m.group(1) + css + m.group(3)

        content = style_re.sub(sub_strip, content)
        if total:
            notes.append(f"stripped {total} nav-remnant rule(s)")

    if rel in FILES_RENAME_CONTAINER:
        # Rename the ONE inline `.container {` CSS rule to `.page-container {`
        content, n_css = re.subn(r"\.container(\s*\{)", r".page-container\1", content, count=1)
        # Rename the middle `class="container"` occurrence (index 1 of 3: header, content, footer)
        parts = content.split('class="container"')
        if len(parts) == 4:  # 3 occurrences -> 4 parts
            content = 'class="container"'.join(parts[:2]) + 'class="page-container"' + 'class="container"'.join(parts[2:])
            notes.append("renamed page-content .container -> .page-container")
        elif n_css:
            # CSS renamed but HTML didn't have exactly 3 occurrences; revert CSS rename to be safe
            content, _ = re.subn(r"\.page-container(\s*\{)", r".container\1", content, count=1)
            notes.append("SKIPPED rename: unexpected container count")

    if rel in FILES_DELETE_ORPHAN_CONTAINER_RULE:
        def sub_delete(m):
            css = m.group(2)
            css, n = strip_rule(css, ".container")
            return m.group(1) + css + m.group(3), n

        total = 0

        def sub_delete2(m):
            nonlocal total
            css = m.group(2)
            css, n = strip_rule(css, ".container")
            total += n
            return m.group(1) + css + m.group(3)

        content = style_re.sub(sub_delete2, content)
        if total:
            notes.append(f"deleted {total} orphaned .container rule(s)")

    changed = content != orig
    print(f"{rel}: {', '.join(notes) if notes else 'no changes'}")
    if changed and not dry_run:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)


def main():
    dry_run = "--dry-run" in sys.argv
    all_files = set(FILES_STRIP_NAV_REMNANTS) | set(FILES_RENAME_CONTAINER) | set(FILES_DELETE_ORPHAN_CONTAINER_RULE)
    for rel in sorted(all_files):
        process(os.path.join(ROOT, rel), dry_run)


if __name__ == "__main__":
    main()
