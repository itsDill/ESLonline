#!/bin/bash

# ==============================================
# CSS OPTIMIZATION SCRIPT - ESL Fun Online
# Combines and minifies CSS files for production
# ==============================================

echo "🎨 CSS Optimization for ESL Fun Online"
echo "======================================"

BASE_DIR="/Users/dillchalisas/ESLonline"
CSS_DIR="$BASE_DIR/css"
OUTPUT_DIR="$CSS_DIR/optimized"

cd "$BASE_DIR"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    case $1 in
        "success") echo -e "${GREEN}✓${NC} $2" ;;
        "warning") echo -e "${YELLOW}⚠${NC} $2" ;;
        "error") echo -e "${RED}✗${NC} $2" ;;
        "info") echo -e "${BLUE}ℹ${NC} $2" ;;
    esac
}

echo ""
echo "1. ANALYZING CSS FILES"
echo "======================"

# Count and list CSS files
css_files=($(find "$CSS_DIR" -maxdepth 1 -name "*.css" ! -path "*/optimized/*" | sort))
css_count=${#css_files[@]}

print_status "info" "Found $css_count CSS files to optimize"

for file in "${css_files[@]}"; do
    filename=$(basename "$file")
    size=$(du -h "$file" | cut -f1)
    echo "  • $filename ($size)"
done

echo ""
echo "2. CREATING OPTIMIZED BUNDLES"
echo "============================="

# Core CSS bundle (essential styles)
echo "Creating core.min.css..."
core_files=(
    "$CSS_DIR/header-unified.css"
    "$CSS_DIR/header.css"
    "$CSS_DIR/main.css"
    "$CSS_DIR/performance-optimizations.css"
)

# Check if all core files exist and combine them
core_content=""
for file in "${core_files[@]}"; do
    if [ -f "$file" ]; then
        echo "/* $(basename "$file") */" >> "$OUTPUT_DIR/core.css"
        cat "$file" >> "$OUTPUT_DIR/core.css"
        echo "" >> "$OUTPUT_DIR/core.css"
        print_status "success" "Added $(basename "$file") to core bundle"
    else
        print_status "warning" "Core file $(basename "$file") not found"
    fi
done

# SEO and UX bundle (enhancement styles)
echo ""
echo "Creating enhancements.min.css..."
enhancement_files=(
    "$CSS_DIR/seo-optimizations.css"
    "$CSS_DIR/ux-ui-enhancements.css"
    "$CSS_DIR/accessibility-fixes.css"
    "$CSS_DIR/dark-mode-comprehensive.css"
)

for file in "${enhancement_files[@]}"; do
    if [ -f "$file" ]; then
        echo "/* $(basename "$file") */" >> "$OUTPUT_DIR/enhancements.css"
        cat "$file" >> "$OUTPUT_DIR/enhancements.css"
        echo "" >> "$OUTPUT_DIR/enhancements.css"
        print_status "success" "Added $(basename "$file") to enhancements bundle"
    else
        print_status "warning" "Enhancement file $(basename "$file") not found"
    fi
done

# Page-specific CSS bundle
echo ""
echo "Creating page-specific.min.css..."
page_files=(
    "$CSS_DIR/hero-enhancements.css"
    "$CSS_DIR/layout-fixes.css"
    "$CSS_DIR/mobile-footer.css"
    "$CSS_DIR/components.css"
)

for file in "${page_files[@]}"; do
    if [ -f "$file" ]; then
        echo "/* $(basename "$file") */" >> "$OUTPUT_DIR/page-specific.css"
        cat "$file" >> "$OUTPUT_DIR/page-specific.css"
        echo "" >> "$OUTPUT_DIR/page-specific.css"
        print_status "success" "Added $(basename "$file") to page-specific bundle"
    else
        print_status "warning" "Page-specific file $(basename "$file") not found"
    fi
done

echo ""
echo "3. CSS MINIFICATION"
echo "=================="

# Simple CSS minification function (basic compression)
minify_css() {
    local input_file="$1"
    local output_file="$2"
    
    if [ -f "$input_file" ]; then
        # Basic minification: remove comments, extra whitespace, and newlines
        cat "$input_file" | \
        sed 's/\/\*.*\*\///g' | \
        sed 's/[ \t]*\/\/.*$//' | \
        tr -d '\n' | \
        sed 's/[ \t][ \t]*/ /g' | \
        sed 's/; /;/g' | \
        sed 's/{ /{/g' | \
        sed 's/ }/}/g' | \
        sed 's/, /,/g' | \
        sed 's/: /:/g' | \
        sed 's/} /}/g' > "$output_file"
        
        original_size=$(du -h "$input_file" | cut -f1)
        minified_size=$(du -h "$output_file" | cut -f1)
        print_status "success" "$(basename "$input_file"): $original_size → $minified_size"
    fi
}

# Minify the bundled files
if [ -f "$OUTPUT_DIR/core.css" ]; then
    minify_css "$OUTPUT_DIR/core.css" "$OUTPUT_DIR/core.min.css"
fi

if [ -f "$OUTPUT_DIR/enhancements.css" ]; then
    minify_css "$OUTPUT_DIR/enhancements.css" "$OUTPUT_DIR/enhancements.min.css"
fi

if [ -f "$OUTPUT_DIR/page-specific.css" ]; then
    minify_css "$OUTPUT_DIR/page-specific.css" "$OUTPUT_DIR/page-specific.min.css"
fi

echo ""
echo "4. CREATING CRITICAL CSS"
echo "========================"

# Extract critical above-the-fold CSS
cat > "$OUTPUT_DIR/critical.min.css" << 'EOF'
/* Critical CSS - Above the fold styles */
*,*::before,*::after{box-sizing:border-box}
body{margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;line-height:1.6}
header{position:relative;z-index:1000}
.container{max-width:1200px;margin:0 auto;padding:0 1rem}
.navbar{display:flex;align-items:center;justify-content:space-between;padding:1rem 0}
.logo-container{display:flex;align-items:center;gap:0.5rem;text-decoration:none;color:inherit}
.logo-image{width:40px;height:40px;object-fit:contain}
.hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#667eea;color:white}
.hero-bg{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:-1}
.hero-content{text-align:center;z-index:1}
.hero-title{font-size:clamp(2rem,4vw,3.5rem);font-weight:700;margin-bottom:1rem}
@media(max-width:768px){.navbar{flex-wrap:wrap}.hero-title{font-size:2rem}}
EOF

print_status "success" "Critical CSS created for above-the-fold content"

echo ""
echo "5. GENERATING USAGE INSTRUCTIONS"
echo "==============================="

# Create instructions file
cat > "$OUTPUT_DIR/README.md" << 'EOF'
# Optimized CSS Files

This directory contains optimized and minified CSS files for production use.

## Files

- `core.min.css` - Essential styles (header, main layout, performance optimizations)
- `enhancements.min.css` - SEO, UX/UI, accessibility, and dark mode styles
- `page-specific.min.css` - Page-specific enhancements and components
- `critical.min.css` - Above-the-fold critical CSS for fast initial render

## Usage

### Option 1: Load in sequence (recommended for development)
```html
<link rel="stylesheet" href="css/optimized/critical.min.css" />
<link rel="stylesheet" href="css/optimized/core.min.css" />
<link rel="stylesheet" href="css/optimized/enhancements.min.css" />
<link rel="stylesheet" href="css/optimized/page-specific.min.css" />
```

### Option 2: Inline critical CSS (recommended for production)
```html
<style>
/* Inline the contents of critical.min.css here */
</style>
<link rel="stylesheet" href="css/optimized/core.min.css" />
<link rel="preload" href="css/optimized/enhancements.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/optimized/enhancements.min.css"></noscript>
```

### Option 3: Single bundle (maximum compression)
Combine all files into one for maximum HTTP request reduction:
```bash
cat critical.min.css core.min.css enhancements.min.css page-specific.min.css > all.min.css
```

## Performance Benefits

- Reduced HTTP requests
- Smaller file sizes
- Faster page load times
- Better caching
- Improved Core Web Vitals scores
EOF

print_status "success" "Usage instructions created in $OUTPUT_DIR/README.md"

echo ""
echo "6. OPTIMIZATION SUMMARY"
echo "======================"

# Calculate total file size savings
original_total=0
optimized_total=0

for file in "${css_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
        original_total=$((original_total + size))
    fi
done

for file in "$OUTPUT_DIR"/*.min.css; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
        optimized_total=$((optimized_total + size))
    fi
done

# Convert bytes to human readable format
original_readable=$(echo "scale=2; $original_total / 1024" | bc 2>/dev/null || echo "$original_total bytes")
optimized_readable=$(echo "scale=2; $optimized_total / 1024" | bc 2>/dev/null || echo "$optimized_total bytes")

if [ $original_total -gt 0 ]; then
    savings_percent=$(echo "scale=1; (($original_total - $optimized_total) * 100) / $original_total" | bc 2>/dev/null || echo "N/A")
    print_status "success" "Original size: ${original_readable}KB"
    print_status "success" "Optimized size: ${optimized_readable}KB"
    print_status "success" "Space saved: ${savings_percent}%"
else
    print_status "info" "Size calculation unavailable"
fi

echo ""
print_status "success" "CSS optimization completed!"
print_status "info" "Files saved to: $OUTPUT_DIR"
print_status "info" "Update your HTML files to use the optimized CSS bundles"

echo ""
echo "Next steps:"
echo "1. Test the optimized CSS files on your website"
echo "2. Update HTML files to use the new bundles"
echo "3. Consider inlining critical.min.css for even better performance"
echo "4. Set up proper cache headers for the CSS files"