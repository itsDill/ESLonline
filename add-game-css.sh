#!/bin/bash

# Add CSS links to game HTML files that are missing them

# CSS to add
CSS_LINKS='
    <!-- CSS Files -->
    <link rel="stylesheet" href="../css/main.css" />
    <link rel="stylesheet" href="../css/balanceman-page.css" />
    <link rel="stylesheet" href="../css/colourmagic-page.css" />
    <link rel="stylesheet" href="../css/escape-page.css" />
    <link rel="stylesheet" href="../css/mobile-optimized.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  </head>
'

# Game files to process
GAMES=("balanceman.html" "colourmagic.html" "escape.html" "floatingmarket.html" "quizchamp.html" "slingshot.html" "snakeslad.html" "uno.html" "whowants.html")

cd /Users/dillchalisas/ESLonline/games

for game in "${GAMES[@]}"; do
    if [ -f "$game" ]; then
        echo "Processing $game..."
        
        # Check if CSS links already exist
        if grep -q "css/main.css" "$game"; then
            echo "  CSS already present in $game"
        else
            # Insert CSS links before </head> or <body>
            if grep -q "</head>" "$game"; then
                sed -i.bak '/^[[:space:]]*<\/head>/i\
    <!-- CSS Files -->\
    <link rel="stylesheet" href="../css/main.css" />\
    <link rel="stylesheet" href="../css/'${game%.html}'-page.css" />\
    <link rel="stylesheet" href="../css/mobile-optimized.css" />\
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
' "$game"
                echo "  ✓ Added CSS to $game (before </head>)"
            elif grep -q "<body>" "$game"; then
                sed -i.bak '/^[[:space:]]*<body>/i\
  </head>\
  \
  <!-- CSS Files -->\
  <link rel="stylesheet" href="../css/main.css" />\
  <link rel="stylesheet" href="../css/'${game%.html}'-page.css" />\
  <link rel="stylesheet" href="../css/mobile-optimized.css" />\
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
' "$game"
                echo "  ✓ Added CSS to $game (before <body>)"
            else
                echo "  ✗ Could not find insertion point in $game"
            fi
        fi
    fi
done

echo ""
echo "Done! CSS links added to game files."
