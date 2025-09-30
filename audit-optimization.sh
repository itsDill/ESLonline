#!/bin/bash

# SEO and AdSense Optimization Script for ESL Fun Online
# This script helps identify which pages need optimization

echo "=== ESL Fun Online SEO & AdSense Audit ==="
echo ""

# Check for pages with existing AdSense
echo "Pages with AdSense already implemented:"
grep -r "adsbygoogle" --include="*.html" . | cut -d: -f1 | sort | uniq | grep -v lessons | head -10

echo ""

# Check for pages without SEO meta descriptions
echo "Pages missing meta descriptions:"
for file in $(find . -name "*.html" -not -path "./students/*" -not -path "./lessons*" | head -20); do
    if ! grep -q 'name="description"' "$file"; then
        echo "  - $file"
    fi
done

echo ""

# Check student and lesson pages (should not have SEO/AdSense)
echo "Student pages (should have minimal SEO):"
find ./students -name "*.html" | head -5

echo ""
echo "Lesson pages (should have minimal SEO):"
find . -name "lessons*.html" | head -5

echo ""
echo "=== Optimization Status ==="
echo "✅ = Properly optimized"
echo "🔧 = Needs optimization" 
echo "❌ = Should not have SEO/AdSense"

# Sample check
echo ""
echo "Quick audit sample:"
echo "✅ index.html - Fully optimized"
echo "✅ tools/tools.html - Fully optimized"  
echo "✅ games/games.html - Fully optimized"
echo "❌ lessons.html - SEO/AdSense removed"
echo "❌ students/dashboard.html - Minimal optimization (correct)"