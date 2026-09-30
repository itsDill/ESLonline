#!/usr/bin/env python3
"""
Fix pages that use an old, non-standard header/footer design (no 'navbar' class,
sometimes no footer at all, sometimes no header.css link). Forcibly replaces the
first <header>...</header> and <footer>...</footer> (if present) with the
canonical templates, and ensures css/header.css is linked.
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from standardize_header_footer import HEADER_TEMPLATE, FOOTER_TEMPLATE, get_prefix, ROOT

FILES = [
    "resources/lessons-and-blog/lesson-fluency-2026.html",
    "resources/lessons-and-blog/lesson-pronunciation.html",
    "resources/lessons-and-blog/lesson-fluency.html",
    "coding/projects/to-do-list.html",
    "coding/lessons/lesson2.html",
    "coding/lessons/lesson3.html",
    "coding/lessons/lesson4.html",
    "coding/lessons/lesson1.html",
    "coding/tutorials/internet-search.html",
    "coding/tutorials/files-folders.html",
    "coding/tutorials/email-basics.html",
    "teacher-hub/reviews/bamreview.html",
    "teacher-hub/reviews/example.html",
    "teacher-hub/reviews/temreview.html",
]

HEADER_RE = re.compile(r"<header>.*?</header>", re.DOTALL | re.IGNORECASE)
FOOTER_RE = re.compile(r"<footer>.*?</footer>", re.DOTALL | re.IGNORECASE)
HEAD_CLOSE_RE = re.compile(r"</head>", re.IGNORECASE)
BODY_CLOSE_RE = re.compile(r"</body>", re.IGNORECASE)


def main():
    dry_run = "--dry-run" in sys.argv
    for rel in FILES:
        filepath = os.path.join(ROOT, rel)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        prefix = get_prefix(filepath)
        header_html = HEADER_TEMPLATE.format(P=prefix)
        footer_html = FOOTER_TEMPLATE.format(P=prefix)

        changes = []

        new_content, n = HEADER_RE.subn(lambda m: header_html, content, count=1)
        if n:
            changes.append("header replaced")
        content = new_content

        new_content, n = FOOTER_RE.subn(lambda m: footer_html, content, count=1)
        if n:
            changes.append("footer replaced")
        else:
            # No footer at all - insert before </body>
            new_content, n = BODY_CLOSE_RE.subn(
                lambda m: "    " + footer_html + "\n  </body>", content, count=1
            )
            if n:
                changes.append("footer inserted")
        content = new_content

        css_link = f'<link rel="stylesheet" href="{prefix}css/header.css" />'
        needs_css = "header.css" not in content and "header-consolidated.css" not in content
        needs_fa = "font-awesome" not in content.lower()

        inject = ""
        if needs_fa:
            inject += (
                '\n    <link rel="stylesheet" '
                'href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />'
            )
        if needs_css:
            inject += "\n    " + css_link

        if inject:
            new_content, n = HEAD_CLOSE_RE.subn(
                lambda m: inject + "\n  </head>", content, count=1
            )
            if n:
                if needs_fa:
                    changes.append("font-awesome link added")
                if needs_css:
                    changes.append("css link added")
            content = new_content

        print(f"{rel}: {', '.join(changes) if changes else 'NO CHANGES'}")

        if not dry_run and changes:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)


if __name__ == "__main__":
    main()
