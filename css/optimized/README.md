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
