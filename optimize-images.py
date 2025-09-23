#!/usr/bin/env python3
"""
Image Optimization Script for ESL Fun Online
Optimizes the hero background image to improve LCP scores
"""

import os
import sys
from PIL import Image, ImageOps
import subprocess

def optimize_hero_image():
    """Optimize the hero background image for better performance"""
    
    input_path = "images/Blue Night Sky Cute Whale Desktop Wallpaper.png"
    
    if not os.path.exists(input_path):
        print(f"❌ Hero image not found: {input_path}")
        return False
    
    print(f"🖼️  Optimizing hero background image...")
    print(f"📁 Input: {input_path}")
    
    try:
        # Load the original image
        with Image.open(input_path) as img:
            original_size = os.path.getsize(input_path)
            print(f"📊 Original size: {original_size / 1024 / 1024:.2f} MB")
            print(f"📐 Original dimensions: {img.size[0]}x{img.size[1]}")
            
            # Create optimized versions
            optimizations = [
                # Desktop version (1920x1080, high quality)
                {
                    'size': (1920, 1080),
                    'quality': 85,
                    'suffix': '-desktop',
                    'format': 'JPEG'
                },
                # Tablet version (1024x768, medium quality)
                {
                    'size': (1024, 768),
                    'quality': 80,
                    'suffix': '-tablet',
                    'format': 'JPEG'
                },
                # Mobile version (768x1024, optimized for mobile)
                {
                    'size': (768, 1024),
                    'quality': 75,
                    'suffix': '-mobile',
                    'format': 'JPEG'
                }
            ]
            
            base_name = "hero-bg"
            
            for opt in optimizations:
                # Resize image maintaining aspect ratio
                resized = ImageOps.fit(img, opt['size'], Image.Resampling.LANCZOS)
                
                # Convert to RGB if needed (for JPEG)
                if opt['format'] == 'JPEG' and resized.mode in ('RGBA', 'LA', 'P'):
                    # Create white background for transparency
                    background = Image.new('RGB', resized.size, (255, 255, 255))
                    if resized.mode == 'P':
                        resized = resized.convert('RGBA')
                    background.paste(resized, mask=resized.split()[-1] if resized.mode == 'RGBA' else None)
                    resized = background
                
                # Save optimized version
                output_path = f"images/{base_name}{opt['suffix']}.{opt['format'].lower()}"
                resized.save(output_path, opt['format'], quality=opt['quality'], optimize=True)
                
                new_size = os.path.getsize(output_path)
                reduction = ((original_size - new_size) / original_size) * 100
                
                print(f"✅ Created {output_path}")
                print(f"   📊 Size: {new_size / 1024 / 1024:.2f} MB ({reduction:.1f}% reduction)")
                print(f"   📐 Dimensions: {opt['size'][0]}x{opt['size'][1]}")
                print()
        
        # Generate WebP versions if possible
        try_webp_conversion()
        
        # Generate CSS for responsive images
        generate_responsive_css()
        
        print("🎉 Image optimization complete!")
        return True
        
    except Exception as e:
        print(f"❌ Error optimizing image: {str(e)}")
        return False

def try_webp_conversion():
    """Try to convert images to WebP format for even better compression"""
    print("🔄 Attempting WebP conversion...")
    
    image_files = [
        "images/hero-bg-desktop.jpeg",
        "images/hero-bg-tablet.jpeg", 
        "images/hero-bg-mobile.jpeg"
    ]
    
    for jpeg_file in image_files:
        if os.path.exists(jpeg_file):
            try:
                with Image.open(jpeg_file) as img:
                    webp_file = jpeg_file.replace('.jpeg', '.webp')
                    img.save(webp_file, 'WebP', quality=80, method=6)
                    
                    jpeg_size = os.path.getsize(jpeg_file)
                    webp_size = os.path.getsize(webp_file)
                    reduction = ((jpeg_size - webp_size) / jpeg_size) * 100
                    
                    print(f"✅ Created WebP: {webp_file} ({reduction:.1f}% smaller)")
            except Exception as e:
                print(f"⚠️  WebP conversion failed for {jpeg_file}: {str(e)}")

def generate_responsive_css():
    """Generate CSS for responsive background images"""
    
    css_content = """
/* Optimized Hero Background Images */
.hero-bg {
  /* Default fallback */
  background-image: url('images/hero-bg-desktop.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* WebP support with fallbacks */
.webp .hero-bg {
  background-image: url('images/hero-bg-desktop.webp');
}

/* Responsive background images */
@media (max-width: 1024px) {
  .hero-bg {
    background-image: url('images/hero-bg-tablet.jpeg');
  }
  
  .webp .hero-bg {
    background-image: url('images/hero-bg-tablet.webp');
  }
}

@media (max-width: 768px) {
  .hero-bg {
    background-image: url('images/hero-bg-mobile.jpeg');
  }
  
  .webp .hero-bg {
    background-image: url('images/hero-bg-mobile.webp');
  }
}

/* Alternative using <picture> element for better control */
/*
Replace your current img tag with:

<picture class="hero-bg-picture">
  <source media="(max-width: 768px)" 
          srcset="images/hero-bg-mobile.webp" 
          type="image/webp">
  <source media="(max-width: 768px)" 
          srcset="images/hero-bg-mobile.jpeg" 
          type="image/jpeg">
  <source media="(max-width: 1024px)" 
          srcset="images/hero-bg-tablet.webp" 
          type="image/webp">
  <source media="(max-width: 1024px)" 
          srcset="images/hero-bg-tablet.jpeg" 
          type="image/jpeg">
  <source srcset="images/hero-bg-desktop.webp" 
          type="image/webp">
  <img src="images/hero-bg-desktop.jpeg" 
       alt="ESL Fun Online Background" 
       class="hero-bg"
       loading="eager"
       width="1920" 
       height="1080">
</picture>
*/
"""
    
    with open('css/optimized-hero-bg.css', 'w') as f:
        f.write(css_content)
    
    print("📝 Generated responsive CSS: css/optimized-hero-bg.css")

def generate_html_suggestions():
    """Generate HTML suggestions for better performance"""
    
    html_suggestions = """
<!-- PERFORMANCE OPTIMIZATION: Hero Image Implementation -->

<!-- Method 1: Preload critical image -->
<link rel="preload" href="images/hero-bg-desktop.webp" as="image" type="image/webp">
<link rel="preload" href="images/hero-bg-desktop.jpeg" as="image" type="image/jpeg">

<!-- Method 2: Use picture element with responsive images -->
<picture class="hero-bg-picture">
  <!-- Mobile -->
  <source media="(max-width: 768px)" 
          srcset="images/hero-bg-mobile.webp" 
          type="image/webp">
  <source media="(max-width: 768px)" 
          srcset="images/hero-bg-mobile.jpeg" 
          type="image/jpeg">
  
  <!-- Tablet -->
  <source media="(max-width: 1024px)" 
          srcset="images/hero-bg-tablet.webp" 
          type="image/webp">
  <source media="(max-width: 1024px)" 
          srcset="images/hero-bg-tablet.jpeg" 
          type="image/jpeg">
  
  <!-- Desktop -->
  <source srcset="images/hero-bg-desktop.webp" 
          type="image/webp">
  
  <!-- Fallback -->
  <img src="images/hero-bg-desktop.jpeg" 
       alt="ESL Fun Online Background" 
       class="hero-bg"
       loading="eager"
       width="1920" 
       height="1080">
</picture>

<!-- Method 3: CSS Background with WebP detection -->
<script>
// Detect WebP support
function supportsWebP() {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => resolve(webP.height === 2);
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

supportsWebP().then((supported) => {
  if (supported) {
    document.documentElement.classList.add('webp');
  }
});
</script>
"""
    
    with open('hero-optimization-guide.html', 'w') as f:
        f.write(html_suggestions)
    
    print("📖 Generated implementation guide: hero-optimization-guide.html")

if __name__ == "__main__":
    print("🚀 ESL Fun Online Image Optimization")
    print("=" * 50)
    
    # Check if PIL is available
    try:
        from PIL import Image, ImageOps
    except ImportError:
        print("❌ PIL (Pillow) not found. Please install it:")
        print("   pip install Pillow")
        sys.exit(1)
    
    success = optimize_hero_image()
    
    if success:
        generate_html_suggestions()
        print("\n📋 Next Steps:")
        print("1. Replace your hero background image with the optimized versions")
        print("2. Update your CSS to use the responsive background images")
        print("3. Add WebP detection script to your HTML")
        print("4. Test the changes and measure performance improvements")
        print("\n🎯 Expected improvements:")
        print("   • 60-80% reduction in image file size")
        print("   • Faster LCP (Largest Contentful Paint)")
        print("   • Better mobile performance")
        print("   • Improved Core Web Vitals scores")
    else:
        print("\n❌ Optimization failed. Please check the error messages above.")
        sys.exit(1)