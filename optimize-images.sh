#!/bin/bash

# ==============================================
# IMAGE OPTIMIZATION SCRIPT - ESL Fun Online
# Optimizes images for web performance
# ==============================================

echo "Starting image optimization for ESL Fun Online..."

# Set the base directory
BASE_DIR="/Users/dillchalisas/ESLonline"
IMAGES_DIR="$BASE_DIR/images"

cd "$BASE_DIR"

# Create a backup directory if it doesn't exist
mkdir -p "$IMAGES_DIR/originals"

echo "Converting PNG images to WebP format..."

# Convert PNG images to WebP with high quality
for file in "$IMAGES_DIR"/*.png; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .png)
        
        # Skip if WebP version already exists and is newer
        if [ -f "$IMAGES_DIR/${filename}.webp" ] && [ "$IMAGES_DIR/${filename}.webp" -nt "$file" ]; then
            echo "Skipping $filename.webp (already exists and is newer)"
            continue
        fi
        
        # Create backup if it doesn't exist
        if [ ! -f "$IMAGES_DIR/originals/${filename}.png" ]; then
            cp "$file" "$IMAGES_DIR/originals/"
            echo "Backed up $filename.png"
        fi
        
        # Convert to WebP with quality 85 for better compression
        magick "$file" -quality 85 -define webp:method=6 "$IMAGES_DIR/${filename}.webp"
        echo "Converted $filename.png to WebP"
    fi
done

# Convert JPG images to WebP format
for file in "$IMAGES_DIR"/*.jpg "$IMAGES_DIR"/*.jpeg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        extension="${filename##*.}"
        name="${filename%.*}"
        
        # Skip if WebP version already exists and is newer
        if [ -f "$IMAGES_DIR/${name}.webp" ] && [ "$IMAGES_DIR/${name}.webp" -nt "$file" ]; then
            echo "Skipping ${name}.webp (already exists and is newer)"
            continue
        fi
        
        # Create backup if it doesn't exist
        if [ ! -f "$IMAGES_DIR/originals/$filename" ]; then
            cp "$file" "$IMAGES_DIR/originals/"
            echo "Backed up $filename"
        fi
        
        # Convert to WebP with quality 80 for photos
        magick "$file" -quality 80 -define webp:method=6 "$IMAGES_DIR/${name}.webp"
        echo "Converted $filename to WebP"
    fi
done

echo "Image optimization completed!"

# Generate image size report
echo ""
echo "Image Size Report:"
echo "=================="

total_original=0
total_webp=0

for file in "$IMAGES_DIR"/*.png "$IMAGES_DIR"/*.jpg "$IMAGES_DIR"/*.jpeg; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        filename=$(basename "$file")
        name="${filename%.*}"
        
        if [ -f "$IMAGES_DIR/${name}.webp" ]; then
            webp_size=$(du -h "$IMAGES_DIR/${name}.webp" | cut -f1)
            echo "$filename: $size → ${name}.webp: $webp_size"
        fi
    fi
done

echo ""
echo "Optimization complete! WebP images generated with fallback PNGs/JPGs maintained."
echo "Remember to update your HTML to use <picture> elements for better browser support."

# Generate HTML snippet examples
echo ""
echo "Example HTML usage:"
echo '<picture>'
echo '  <source srcset="images/logo-optimized.webp" type="image/webp">'
echo '  <img src="images/logo-optimized.png" alt="ESL Fun Online Logo" loading="lazy" decoding="async" width="40" height="40">'
echo '</picture>'