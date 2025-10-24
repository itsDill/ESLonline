#!/bin/bash

# Script to update all headers across the site with Worksheets link
# ESL Fun Online - Header Update

# Define the old and new content
OLD_CONTENT='<a href="../english/vocabguide.html" class="dropdown-item">
              <i class="fas fa-book-open"></i>
              Vocabulary Building
            </a>
            <a href="../english/writingf.html" class="dropdown-item">'

NEW_CONTENT='<a href="../english/vocabguide.html" class="dropdown-item">
              <i class="fas fa-book-open"></i>
              Vocabulary Building
            </a>
            <a href="../english/worksheets.html" class="dropdown-item">
              <i class="fas fa-file-alt"></i>
              Worksheets
            </a>
            <a href="../english/writingf.html" class="dropdown-item">'

# Find all HTML files (excluding backups and certain directories)
find . -type f -name "*.html" ! -name "*.backup" ! -path "./node_modules/*" ! -path "./.git/*" | while read -r file; do
    # Check if file contains the old pattern
    if grep -q "Grammar Guides" "$file" && grep -q "Vocabulary Building" "$file"; then
        echo "Processing: $file"
        
        # Determine the correct path prefix based on file location
        if [[ "$file" == "./index.html" ]] || [[ "$file" == "./contact.html" ]] || [[ "$file" == "./register.html" ]] || [[ "$file" == ./login.html ]]; then
            # Root level files - use relative path without ../
            sed -i '' '/<a href="english\/vocabguide.html" class="dropdown-item">/,/<a href="english\/writingf.html" class="dropdown-item">/{
                /<a href="english\/writingf.html" class="dropdown-item">/i\
            <a href="english/worksheets.html" class="dropdown-item">\
              <i class="fas fa-file-alt"></i>\
              Worksheets\
            </a>
            }' "$file" 2>/dev/null
        else
            # Subdirectory files - use ../
            sed -i '' '/<a href="\.\.\/english\/vocabguide.html" class="dropdown-item">/,/<a href="\.\.\/english\/writingf.html" class="dropdown-item">/{
                /<a href="\.\.\/english\/writingf.html" class="dropdown-item">/i\
            <a href="../english/worksheets.html" class="dropdown-item">\
              <i class="fas fa-file-alt"></i>\
              Worksheets\
            </a>
            }' "$file" 2>/dev/null
        fi
    fi
done

echo "Header update complete!"
