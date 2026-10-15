#!/usr/bin/env python3
"""Generate sitemap.xml from canonical, indexable HTML pages in this repo."""

import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent
SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
SKIP_DIRS = {
    ".git",
    ".venv",
    ".dev-files",
    ".idea",
    ".vscode",
    "__pycache__",
    "node_modules",
    "students",
    "teachers",
}
SKIP_FILES = {
    "404.html",
    "header-template.html",
    "idioms-grid-section.html",
    "idioms-compact.html",
    "offline.html",
    "register.html",
}


class PageMetadataParser(HTMLParser):
    """Read canonical and robots metadata without requiring third-party packages."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.canonical = None
        self.noindex = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag.lower() == "link" and "canonical" in attrs.get("rel", "").lower().split():
            self.canonical = attrs.get("href", "").strip() or None
        elif tag.lower() == "meta" and attrs.get("name", "").lower() in {
            "robots",
            "googlebot",
        }:
            directives = attrs.get("content", "").lower().replace(" ", "").split(",")
            if "noindex" in directives:
                self.noindex = True


def should_skip(path):
    """Exclude non-page fragments, private folders, and backup copies."""
    relative = path.relative_to(ROOT)
    if any(part in SKIP_DIRS or part.startswith(".") for part in relative.parts[:-1]):
        return True
    name = path.name.lower()
    return (
        name in SKIP_FILES
        or "backup" in name
        or name.endswith("-old.html")
        or name.endswith(".bak.html")
    )


def read_page_metadata(path):
    parser = PageMetadataParser()
    try:
        parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    except OSError as error:
        print(f"Skipping unreadable page {path.relative_to(ROOT)}: {error}")
        return None, True
    return parser.canonical, parser.noindex


def source_matches_url(path, url):
    """Prefer the file whose path directly represents a canonical URL on collisions."""
    url_path = urlsplit(url).path
    expected = ROOT / "index.html" if url_path in {"", "/"} else ROOT / url_path.lstrip("/")
    if url_path.endswith("/"):
        expected = expected / "index.html"
    return path.resolve() == expected.resolve()


def last_modified(path):
    """Return a UTC date from the source file's mtime, or None if unavailable."""
    try:
        return datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).date().isoformat()
    except OSError:
        return None


def generate_sitemap(domain="https://eslfunonline.com", output_file="sitemap.xml"):
    """Write sitemap entries only for unique, same-site canonical pages not marked noindex."""
    site = urlsplit(domain.rstrip("/"))
    if site.scheme not in {"http", "https"} or not site.netloc:
        raise ValueError("domain must be an absolute http(s) URL")

    pages = {}
    for html_file in sorted(ROOT.rglob("*.html")):
        if should_skip(html_file):
            continue

        canonical, noindex = read_page_metadata(html_file)
        if noindex or not canonical:
            continue

        parsed = urlsplit(canonical)
        if (
            parsed.scheme not in {"http", "https"}
            or parsed.netloc.lower() != site.netloc.lower()
            or parsed.query
            or parsed.fragment
        ):
            print(f"Skipping non-site or non-canonical URL in {html_file.relative_to(ROOT)}: {canonical}")
            continue

        existing = pages.get(canonical)
        if existing is None or source_matches_url(html_file, canonical):
            pages[canonical] = html_file
        elif not source_matches_url(existing, canonical):
            print(
                f"Skipping duplicate canonical {canonical} from "
                f"{html_file.relative_to(ROOT)}; keeping {existing.relative_to(ROOT)}"
            )

    urlset = ET.Element("urlset", xmlns=SITEMAP_NS)
    for canonical, source in sorted(pages.items()):
        url_element = ET.SubElement(urlset, "url")
        ET.SubElement(url_element, "loc").text = canonical
        modified = last_modified(source)
        if modified:
            ET.SubElement(url_element, "lastmod").text = modified

    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="  ")
    output_path = Path(output_file)
    if not output_path.is_absolute():
        output_path = ROOT / output_path
    tree.write(output_path, encoding="utf-8", xml_declaration=True)

    print(f"Sitemap generated: {output_path}")
    print(f"Canonical indexable URLs: {len(pages)}")
    return len(pages)


if __name__ == "__main__":
    domain = sys.argv[1] if len(sys.argv) > 1 else "https://eslfunonline.com"
    output = sys.argv[2] if len(sys.argv) > 2 else "sitemap.xml"
    generate_sitemap(domain, output)
