#!/usr/bin/env python3
"""
IndexNow URL submission script for eslfunonline.com
Automatically submits updated URLs to search engines via IndexNow API
"""

import requests
import json
import sys
from datetime import datetime
from pathlib import Path
from xml.etree import ElementTree as ET

# Configuration
DOMAIN = "eslfunonline.com"
API_KEY = "cc5d312e80384900a5ab12e6a9c0bd9d"
KEY_LOCATION = f"https://{DOMAIN}/cc5d312e80384900a5ab12e6a9c0bd9d.txt"
INDEXNOW_API = "https://api.indexnow.org/IndexNow"
SITE_ROOT = Path(__file__).parent
LOG_FILE = SITE_ROOT / "indexnow_submissions.log"

def log(message):
    """Log message with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_message = f"[{timestamp}] {message}"
    print(log_message)
    with open(LOG_FILE, "a") as f:
        f.write(log_message + "\n")

def get_urls_from_sitemap():
    """Extract URLs from sitemap.xml"""
    sitemap_path = SITE_ROOT / "sitemap.xml"
    urls = []
    
    try:
        tree = ET.parse(sitemap_path)
        root = tree.getroot()
        
        # Handle namespace
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        
        for url_elem in root.findall('.//ns:url/ns:loc', namespace):
            urls.append(url_elem.text)
        
        log(f"Found {len(urls)} URLs in sitemap.xml")
        return urls
    except Exception as e:
        log(f"Error reading sitemap: {e}")
        return []

def get_urls_from_filesystem():
    """Scan filesystem for HTML files"""
    urls = []
    exclude_dirs = {'.git', '.venv', 'node_modules', '__pycache__'}
    
    for html_file in SITE_ROOT.rglob("*.html"):
        # Skip excluded directories
        if any(part in exclude_dirs for part in html_file.parts):
            continue
        
        # Convert file path to URL
        rel_path = html_file.relative_to(SITE_ROOT)
        if str(rel_path) == "index.html":
            url = f"https://{DOMAIN}/"
        else:
            url = f"https://{DOMAIN}/{str(rel_path).replace(chr(92), '/')}"  # Handle Windows paths
        
        urls.append(url)
    
    log(f"Found {len(urls)} HTML files via filesystem scan")
    return urls

def submit_urls(urls):
    """Submit URLs to IndexNow API"""
    if not urls:
        log("No URLs to submit")
        return False
    
    # Limit to 10,000 URLs per request (IndexNow limit)
    urls_batch = urls[:10000]
    
    payload = {
        "host": DOMAIN,
        "key": API_KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls_batch
    }
    
    try:
        response = requests.post(
            INDEXNOW_API,
            json=payload,
            headers={"Content-Type": "application/json; charset=utf-8"},
            timeout=10
        )
        
        if response.status_code in [200, 202]:
            log(f"✓ Successfully submitted {len(urls_batch)} URLs (HTTP {response.status_code})")
            return True
        elif response.status_code == 400:
            log(f"✗ Bad request - Invalid format (HTTP 400)")
            return False
        elif response.status_code == 403:
            log(f"✗ Forbidden - API key invalid or not found (HTTP 403)")
            return False
        elif response.status_code == 422:
            log(f"✗ Unprocessable Entity - URLs don't match host or key mismatch (HTTP 422)")
            return False
        elif response.status_code == 429:
            log(f"✗ Rate limited - Too many requests (HTTP 429)")
            return False
        else:
            log(f"✗ Unexpected response: HTTP {response.status_code}")
            return False
    
    except requests.RequestException as e:
        log(f"✗ Network error: {e}")
        return False

def main():
    """Main function"""
    log("=" * 60)
    log("IndexNow URL Submission Started")
    
    # Get URLs from sitemap (preferred) or filesystem
    urls = get_urls_from_sitemap()
    if not urls:
        log("Sitemap empty or not found, scanning filesystem...")
        urls = get_urls_from_filesystem()
    
    if urls:
        success = submit_urls(urls)
        if success:
            log("✓ Submission completed successfully")
            return 0
        else:
            log("✗ Submission failed")
            return 1
    else:
        log("✗ No URLs found to submit")
        return 1

if __name__ == "__main__":
    sys.exit(main())
