#!/bin/bash

# ==============================================
# PERFORMANCE AUDIT SCRIPT - ESL Fun Online
# Comprehensive website performance analysis
# ==============================================

echo "🚀 ESL Fun Online Performance Audit"
echo "===================================="

BASE_DIR="/Users/dillchalisas/ESLonline"
cd "$BASE_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    case $1 in
        "success") echo -e "${GREEN}✓${NC} $2" ;;
        "warning") echo -e "${YELLOW}⚠${NC} $2" ;;
        "error") echo -e "${RED}✗${NC} $2" ;;
        "info") echo -e "${BLUE}ℹ${NC} $2" ;;
    esac
}

echo ""
echo "1. IMAGE OPTIMIZATION ANALYSIS"
echo "=============================="

# Check for WebP images
webp_count=$(find images/ -name "*.webp" 2>/dev/null | wc -l)
png_count=$(find images/ -name "*.png" 2>/dev/null | wc -l)
jpg_count=$(find images/ -name "*.jpg" -o -name "*.jpeg" 2>/dev/null | wc -l)

print_status "info" "WebP images: $webp_count"
print_status "info" "PNG images: $png_count"
print_status "info" "JPG/JPEG images: $jpg_count"

if [ $webp_count -gt 0 ]; then
    print_status "success" "WebP format detected - Good for performance"
else
    print_status "warning" "No WebP images found - Consider converting for better performance"
fi

echo ""
echo "2. CSS OPTIMIZATION ANALYSIS"
echo "============================"

# Check for optimization CSS files
optimization_files=("performance-optimizations.css" "seo-optimizations.css" "ux-ui-enhancements.css")

for file in "${optimization_files[@]}"; do
    if [ -f "css/$file" ]; then
        print_status "success" "$file found"
    else
        print_status "error" "$file missing"
    fi
done

# Count total CSS files
css_count=$(find css/ -name "*.css" 2>/dev/null | wc -l)
print_status "info" "Total CSS files: $css_count"

if [ $css_count -gt 10 ]; then
    print_status "warning" "Many CSS files detected - Consider combining for better performance"
fi

echo ""
echo "3. HTML STRUCTURE ANALYSIS"
echo "=========================="

# Check key HTML files
key_files=("index.html" "games/games.html" "lessons.html")

for file in "${key_files[@]}"; do
    if [ -f "$file" ]; then
        # Check for proper meta tags
        if grep -q "viewport" "$file"; then
            print_status "success" "$file has viewport meta tag"
        else
            print_status "error" "$file missing viewport meta tag"
        fi
        
        # Check for structured data
        if grep -q "application/ld+json" "$file"; then
            print_status "success" "$file has structured data"
        else
            print_status "warning" "$file missing structured data"
        fi
        
        # Check for WebP usage
        if grep -q "image/webp" "$file"; then
            print_status "success" "$file uses WebP images"
        else
            print_status "warning" "$file not optimized for WebP"
        fi
        
        # Check for performance optimizations
        if grep -q "performance-optimizations.css" "$file"; then
            print_status "success" "$file includes performance optimizations"
        else
            print_status "warning" "$file missing performance optimization CSS"
        fi
    else
        print_status "error" "$file not found"
    fi
done

echo ""
echo "4. SERVICE WORKER ANALYSIS"
echo "=========================="

sw_files=("sw.js" "sw-simple.js" "sw-optimized.js")
sw_found=false

for file in "${sw_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "success" "$file found"
        sw_found=true
        
        # Check if it caches WebP images
        if grep -q "webp" "$file"; then
            print_status "success" "$file caches WebP images"
        else
            print_status "warning" "$file should cache WebP images"
        fi
    fi
done

if [ "$sw_found" = false ]; then
    print_status "error" "No service worker found - Missing caching capabilities"
fi

echo ""
echo "5. MANIFEST FILE ANALYSIS"
echo "========================="

if [ -f "site.webmanifest" ]; then
    print_status "success" "Web App Manifest found"
    
    # Check for WebP icons
    if grep -q "webp" "site.webmanifest"; then
        print_status "success" "Manifest uses WebP icons"
    else
        print_status "warning" "Manifest should use WebP icons"
    fi
else
    print_status "error" "Web App Manifest missing"
fi

echo ""
echo "6. SECURITY HEADERS ANALYSIS"
echo "============================"

# Check for security headers in HTML
security_headers=("Content-Security-Policy" "X-Content-Type-Options" "Referrer-Policy")

for header in "${security_headers[@]}"; do
    if grep -r "$header" *.html > /dev/null 2>&1; then
        print_status "success" "$header found in HTML files"
    else
        print_status "warning" "$header missing - Should be added for security"
    fi
done

echo ""
echo "7. ACCESSIBILITY ANALYSIS"
echo "========================="

# Check for alt attributes in images
missing_alt=0
for file in *.html **/*.html; do
    if [ -f "$file" ]; then
        # Count img tags without alt attributes
        img_no_alt=$(grep -o '<img[^>]*>' "$file" | grep -cv 'alt=')
        missing_alt=$((missing_alt + img_no_alt))
    fi
done

if [ $missing_alt -eq 0 ]; then
    print_status "success" "All images have alt attributes"
else
    print_status "warning" "$missing_alt images missing alt attributes"
fi

echo ""
echo "8. FILE SIZE ANALYSIS"
echo "===================="

# Check for large files
large_files=$(find . -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" | xargs du -h | sort -hr | head -10)

echo "Top 10 largest files:"
echo "$large_files"

echo ""
echo "9. RECOMMENDATIONS"
echo "=================="

print_status "info" "Performance Recommendations:"
echo "  • Ensure all images are converted to WebP format"
echo "  • Combine CSS files where possible to reduce HTTP requests"
echo "  • Use lazy loading for images below the fold"
echo "  • Implement proper caching headers"
echo "  • Optimize JavaScript loading with async/defer"
echo "  • Consider using a CDN for static assets"

print_status "info" "SEO Recommendations:"
echo "  • Ensure all pages have unique meta descriptions"
echo "  • Add structured data to all relevant pages"
echo "  • Implement proper heading hierarchy (H1-H6)"
echo "  • Add breadcrumb navigation"
echo "  • Optimize for Core Web Vitals"

print_status "info" "UX/UI Recommendations:"
echo "  • Test on various device sizes"
echo "  • Ensure touch targets are at least 44px"
echo "  • Implement proper focus indicators"
echo "  • Test with screen readers"
echo "  • Provide fallbacks for JavaScript functionality"

echo ""
echo "🎉 Audit Complete!"
echo "Check the recommendations above to improve your site's performance."