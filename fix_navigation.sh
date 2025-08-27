#!/bin/bash

# Script to fix navigation and color scheme across all HTML files
# This script will:
# 1. Fix coding dropdown navigation structure
# 2. Update color scheme to match index.html
# 3. Fix incorrect file references

echo "Starting navigation and color scheme fix..."

# Standard color scheme from index.html
PRIMARY_COLOR="#46bbe5"
PRIMARY_HOVER="#05425c"
SECONDARY_COLOR="#10b981"
ACCENT_COLOR="#f59e0b"

# Function to fix navigation dropdown for subdirectory files (english/, games/, blog/, tools/)
fix_subdirectory_navigation() {
    local file="$1"
    echo "Fixing navigation in $file..."
    
    # Fix coding dropdown structure - remove double dropdown and fix links
    sed -i '' '
    # Remove double dropdown div
    /<div class="dropdown">/{
        N
        s|<div class="dropdown">[[:space:]]*<div class="dropdown">|<div class="dropdown">|g
    }
    
    # Fix coding dropdown items
    s|<a href="../coding/htmlcss\.html" class="dropdown-item">|<a href="../coding/computerbasics.html" class="dropdown-item">|g
    s|<a href="../coding/javascript\.html" class="dropdown-item">|<a href="../coding/ai.html" class="dropdown-item">|g
    s|<a href="../coding/python\.html" class="dropdown-item">|<a href="../coding/codingresources.html" class="dropdown-item">|g
    s|<a href="../coding/web-development\.html" class="dropdown-item">|<a href="../coding/computerbasics.html" class="dropdown-item">|g
    s|<a href="../coding/nodejs\.html" class="dropdown-item">|<a href="../coding/ai.html" class="dropdown-item">|g
    s|<a href="../coding/databases\.html" class="dropdown-item">|<a href="../coding/codingresources.html" class="dropdown-item">|g
    s|<a href="../coding/projects\.html" class="dropdown-item">|<a href="../coding/codingresources.html" class="dropdown-item">|g
    
    # Fix icons
    s|<i class="fab fa-html5"></i>[[:space:]]*Web Development|<i class="fas fa-desktop"></i>\
                  Computer Basics|g
    s|<i class="fab fa-js"></i>[[:space:]]*JavaScript|<i class="fas fa-robot"></i>\
                  AI Basics|g
    s|<i class="fab fa-python"></i>[[:space:]]*Python|<i class="fas fa-code"></i>\
                  Coding Basics|g
    s|<i class="fab fa-html5"></i>[[:space:]]*AI Basics|<i class="fas fa-robot"></i>\
                  AI Basics|g
    s|<i class="fab fa-python"></i>[[:space:]]*Coding Basics|<i class="fas fa-code"></i>\
                  Coding Basics|g
    ' "$file"
}

# Function to fix root directory navigation (lessons.html, etc.)
fix_root_navigation() {
    local file="$1"
    echo "Fixing root navigation in $file..."
    
    sed -i '' '
    # Fix coding dropdown items for root files
    s|<a href="coding/htmlcss\.html" class="dropdown-item">|<a href="coding/computerbasics.html" class="dropdown-item">|g
    s|<a href="coding/javascript\.html" class="dropdown-item">|<a href="coding/ai.html" class="dropdown-item">|g
    s|<a href="coding/python\.html" class="dropdown-item">|<a href="coding/codingresources.html" class="dropdown-item">|g
    
    # Fix icons for root files
    s|<i class="fab fa-html5"></i>[[:space:]]*Web Development|<i class="fas fa-desktop"></i>\
                  Computer Basics|g
    s|<i class="fab fa-js"></i>[[:space:]]*JavaScript|<i class="fas fa-robot"></i>\
                  AI Basics|g
    s|<i class="fab fa-python"></i>[[:space:]]*Python|<i class="fas fa-code"></i>\
                  Coding Basics|g
    ' "$file"
}

# Function to fix color scheme
fix_color_scheme() {
    local file="$1"
    echo "Fixing color scheme in $file..."
    
    sed -i '' "
    s|--primary-color: #[0-9a-fA-F]\{6\};|--primary-color: $PRIMARY_COLOR;|g
    s|--primary-hover: #[0-9a-fA-F]\{6\};|--primary-hover: $PRIMARY_HOVER;|g
    " "$file"
}

# Process all HTML files
find . -name "*.html" -type f | while read -r file; do
    echo "Processing: $file"
    
    # Skip index.html as it's already correct
    if [[ "$file" == "./index.html" ]]; then
        echo "Skipping index.html (already fixed)"
        continue
    fi
    
    # Fix color scheme for all files
    fix_color_scheme "$file"
    
    # Fix navigation based on location
    if [[ "$file" == ./lessons.html || "$file" == ./admin.html || "$file" == ./login.html || "$file" == ./privacy.html || "$file" == ./terms.html || "$file" == ./cookies.html ]]; then
        # Root directory files
        fix_root_navigation "$file"
    else
        # Subdirectory files
        fix_subdirectory_navigation "$file"
    fi
done

echo "Navigation and color scheme fix completed!"
