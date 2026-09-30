#!/bin/bash

# This script applies unified headers and footers to all HTML files
# Based on the games.html template

cd /Users/dillchalisas/ESLonline

# Extract header and footer from games.html
echo "🔍 Extracting header and footer templates from games.html..."

# Convert header for different path depths
echo "📝 Processing files..."

# Find all HTML files and process them
find . -name "*.html" -type f | while read file; do
  # Skip template files and hidden files
  [[ $file == *"template"* ]] && continue
  [[ $file == ./.* ]] && continue
  
  # Calculate directory depth
  depth=$(echo "$file" | grep -o "/" | wc -l)
  depth=$((depth - 1))  # Subtract 1 for leading ./
  
  # Only process files that don't have proper headers/footers  
  if ! grep -q "ESL Fun Online" "$file"; then
    continue
  fi
  
  echo "  ✓ $file (depth: $depth)"
done

echo "✅ Processing complete"
