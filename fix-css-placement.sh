#!/bin/bash

cd /Users/dillchalisas/ESLonline/games

echo "Fixing CSS placement in game files..."

for game in balanceman.html quizchamp.html slingshot.html snakeslad.html uno.html whowants.html; do
    if [ -f "$game" ]; then
        # Create a clean version without misplaced CSS
        awk '
        /^  <\/head>/ {
            # Add CSS before </head>
            print "    <!-- CSS Files -->"
            print "    <link rel=\"stylesheet\" href=\"../css/main.css\" />"
            print "    <link rel=\"stylesheet\" href=\"../css/mobile-optimized.css\" />"
            print "    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css\" />"
            print $0
            in_head_close = 1
            next
        }
        in_head_close && /<body>/ {
            in_head_close = 0
        }
        !(in_head_close && /CSS Files|stylesheet/) {
            print $0
        }
        ' "$game" > "${game}.tmp" && mv "${game}.tmp" "$game"
        
        echo "  ✓ Fixed $game"
    fi
done

echo "Done!"
