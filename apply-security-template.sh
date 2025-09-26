#!/bin/bash

# ESL Fun Online - Security Template Application Script
# This script applies security headers to all HTML files in the project

echo "🛡️  ESL Fun Online - Security Template Application"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Counter for files processed
count=0

# Find all HTML files (excluding template)
echo -e "${BLUE}Scanning for HTML files...${NC}"

find . -name "*.html" -not -name "SECURITY_TEMPLATE.html" | while read -r file; do
    count=$((count + 1))
    echo -e "${GREEN}Processing: ${file}${NC}"
    
    # Determine correct path to security script based on file location
    depth=$(echo "$file" | grep -o "/" | wc -l)
    case $depth in
        1) script_path="js/security-enhancements.js" ;;
        2) script_path="../js/security-enhancements.js" ;;
        3) script_path="../../js/security-enhancements.js" ;;
        *) script_path="../js/security-enhancements.js" ;;
    esac
    
    # Check if file already has security headers
    if grep -q "ENHANCED SECURITY CONFIGURATION" "$file"; then
        echo "  ✅ Security headers already present"
    else
        echo "  ⚠️  Security headers missing - needs manual update"
        echo "  📝 Add security template from SECURITY_TEMPLATE.html"
        echo "  🔧 Use script path: $script_path"
    fi
    
    # Check if security script is included
    if grep -q "security-enhancements.js" "$file"; then
        echo "  ✅ Security script already included"
    else
        echo "  ⚠️  Security script missing"
        echo "  📝 Add: <script src=\"$script_path\"></script>"
    fi
    
    echo ""
done

echo -e "${BLUE}Security audit complete!${NC}"
echo ""
echo "📋 MANUAL STEPS REQUIRED:"
echo "1. Review each file marked with ⚠️"
echo "2. Copy security headers from SECURITY_TEMPLATE.html"
echo "3. Add security script with correct relative path"
echo "4. Remove any X-Frame-Options meta tags"
echo "5. Test each page for CSP violations"
echo ""
echo "🧪 TESTING CHECKLIST:"
echo "□ Run Google PageSpeed Insights on updated pages"
echo "□ Check console for CSP violations"
echo "□ Verify security headers at securityheaders.com"
echo "□ Test Google Ads functionality"
echo "□ Validate all interactive features work"
echo ""
echo "📚 For detailed instructions, see: SECURITY_FIXES_IMPLEMENTATION.md"