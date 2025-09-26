#!/usr/bin/env python3
"""
ESL Fun Online - Performance Audit Script
Addresses the Page Insights metrics issues identified
Analyzes implemented optimizations for CLS, LCP, FCP, TBT improvements
"""

import os
import sys
import json
import time
from pathlib import Path
import re

def analyze_current_performance():
    """Analyze the current performance issues"""
    
    print("🔍 Performance Analysis - ESL Fun Online")
    print("=" * 60)
    
    issues = {
        "critical": [],
        "high": [],
        "medium": [],
        "low": []
    }
    
    # Check file sizes
    print("\n📊 File Size Analysis:")
    files_to_check = [
        "index.html",
        "css/main.css",
        "css/header.css", 
        "css/index.css",
        "js/navigation.js",
        "images/Blue Night Sky Cute Whale Desktop Wallpaper.png"
    ]
    
    for file_path in files_to_check:
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            size_mb = size / (1024 * 1024)
            print(f"   {file_path}: {size_mb:.2f} MB")
            
            # Flag large files
            if file_path.endswith('.png') and size_mb > 1:
                issues["critical"].append(f"Large image file: {file_path} ({size_mb:.2f} MB)")
            elif file_path.endswith('.css') and size_mb > 0.1:
                issues["medium"].append(f"Large CSS file: {file_path} ({size_mb:.2f} MB)")
            elif file_path.endswith('.js') and size_mb > 0.1:
                issues["medium"].append(f"Large JS file: {file_path} ({size_mb:.2f} MB)")
    
    # Analyze HTML structure
    if os.path.exists("index.html"):
        with open("index.html", "r", encoding="utf-8") as f:
            html_content = f.read()
            
        # Check for render-blocking resources
        css_links = re.findall(r'<link[^>]*rel=["\']stylesheet["\'][^>]*>', html_content)
        js_scripts_in_head = re.findall(r'<head>.*?<script[^>]*src=[^>]*>.*?</head>', html_content, re.DOTALL)
        
        if len(css_links) > 3:
            issues["high"].append(f"Too many CSS files ({len(css_links)}) - consider combining")
        
        if js_scripts_in_head:
            issues["high"].append("JavaScript files in <head> blocking render")
        
        # Check for missing preload hints
        if "rel=\"preload\"" not in html_content:
            issues["medium"].append("Missing preload hints for critical resources")
        
        # Check for missing width/height on images
        img_tags = re.findall(r'<img[^>]*>', html_content)
        for img in img_tags:
            if 'width=' not in img or 'height=' not in img:
                issues["medium"].append("Images missing width/height attributes (causes CLS)")
    
    return issues

def generate_optimization_plan(issues):
    """Generate a comprehensive optimization plan"""
    
    print("\n🎯 Optimization Plan:")
    print("=" * 40)
    
    plan = {
        "immediate": [],
        "phase1": [],
        "phase2": [],
        "phase3": []
    }
    
    # Immediate fixes (can be done today)
    plan["immediate"] = [
        "Add preload link for hero background image",
        "Add width/height attributes to all images",  
        "Move Google Analytics to end of body",
        "Add font-display: swap to Google Fonts",
        "Defer non-critical CSS loading"
    ]
    
    # Phase 1: Critical performance (1-2 days)
    plan["phase1"] = [
        "Optimize and compress hero background image",
        "Inline critical CSS in <head>",
        "Implement lazy loading for below-fold images",
        "Minify CSS and JavaScript files",
        "Remove unused CSS and JavaScript"
    ]
    
    # Phase 2: Advanced optimizations (3-5 days)  
    plan["phase2"] = [
        "Implement responsive images with WebP",
        "Add service worker for caching",
        "Optimize third-party script loading",
        "Implement resource hints (dns-prefetch, preconnect)",
        "Add security headers (CSP, HSTS, etc.)"
    ]
    
    # Phase 3: Long-term improvements (1-2 weeks)
    plan["phase3"] = [
        "Set up performance monitoring",
        "Implement HTTP/2 server push",
        "Add progressive web app features",
        "Optimize cache policies",
        "Consider using a CDN"
    ]
    
    return plan

def create_optimized_files():
    """Create optimized versions of key files"""
    
    print("\n🔧 Creating Optimized Files:")
    print("=" * 35)
    
    # Create minified CSS combining critical styles
    create_minified_css()
    
    # Create optimized JavaScript
    create_optimized_js()
    
    # Create performance monitoring script
    create_performance_monitor()
    
    # Create .htaccess for server optimizations
    create_htaccess()

def create_minified_css():
    """Create a minified CSS file with only essential styles"""
    
    minified_css = """
/* Minified Critical CSS - ESL Fun Online */
:root{--primary-color:#46bbe5;--primary-hover:#05425c;--text-primary:#1f2937;--text-inverse:#fff;--bg-primary:#fff;--border-color:#e5e7eb;--shadow-lg:0 10px 15px -3px rgb(0 0 0/.1),0 4px 6px -4px rgb(0 0 0/.1);--font-family-primary:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{font-family:var(--font-family-primary);line-height:1.6;color:var(--text-primary);background:var(--bg-primary);overflow-x:hidden;min-height:100vh}
.container{width:100%;max-width:1200px;margin:0 auto;padding:0 1rem}
header{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(255,255,255,.95);backdrop-filter:blur(10px);border-bottom:1px solid var(--border-color)}
.navbar{display:flex;align-items:center;justify-content:space-between;padding:1rem 0;min-height:70px}
.logo-container{display:flex;align-items:center;text-decoration:none;gap:.5rem}
.logo-image{width:40px;height:40px;border-radius:50%}
.logo-text{font-weight:700;font-size:1.25rem;color:var(--primary-color)}
.nav-links{display:flex;list-style:none;gap:2rem;align-items:center}
.nav-link{display:flex;align-items:center;gap:.5rem;text-decoration:none;color:var(--text-primary);font-weight:500;padding:.5rem 1rem;border-radius:.5rem;transition:all .3s ease}
.nav-link:hover{color:var(--primary-color);background:rgba(70,187,229,.1)}
.mobile-toggle{display:none;background:none;border:none;font-size:1.25rem;color:var(--primary-color);cursor:pointer;padding:.5rem}
.hero{position:relative;padding:150px 0 80px;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,rgba(70,187,229,.1),rgba(13,79,102,.1))}
.hero-bg{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:-2;opacity:.3}
.hero-content{width:100%;max-width:800px;margin:0 auto;z-index:2}
.hero-title{font-size:clamp(2.5rem,8vw,4rem);font-weight:800;margin-bottom:1.5rem;background:linear-gradient(135deg,var(--primary-color),#0d4f66);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.2}
.hero-subtitle{font-size:clamp(1.125rem,4vw,1.25rem);line-height:1.7;margin-bottom:2rem;color:var(--text-primary);opacity:.9}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1.5rem;font-weight:500;text-decoration:none;border-radius:.5rem;transition:all .3s ease;min-height:44px}
.btn-primary{background:linear-gradient(135deg,var(--primary-color),#0d4f66);color:var(--text-inverse);border:2px solid transparent}
.btn-primary:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.btn-secondary{background:transparent;color:var(--primary-color);border:2px solid var(--primary-color)}
.hero-buttons{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:2rem}
@media (max-width:768px){.mobile-toggle{display:block}.nav-links{position:fixed;top:70px;left:-100%;width:100%;height:calc(100vh - 70px);background:white;flex-direction:column;justify-content:flex-start;padding:2rem;gap:1rem;transition:left .3s ease;z-index:999}.nav-links.active{left:0}.hero{padding:120px 0 60px;min-height:calc(100vh - 70px)}.hero-buttons{flex-direction:column;align-items:center}}
"""
    
    with open("css/critical-minified.css", "w") as f:
        f.write(minified_css)
    
    print("✅ Created critical-minified.css")

def create_optimized_js():
    """Create optimized JavaScript with performance improvements"""
    
    optimized_js = """
// Optimized Navigation & Performance - ESL Fun Online
(function() {
    'use strict';
    
    // Performance monitoring
    const perf = {
        start: performance.now(),
        metrics: {},
        
        mark(name) {
            this.metrics[name] = performance.now() - this.start;
        },
        
        report() {
            console.log('Performance Metrics:', this.metrics);
        }
    };
    
    // Efficient DOM ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    // Mobile navigation
    function initMobileNav() {
        const toggle = document.getElementById('mobileToggle');
        const nav = document.getElementById('navLinks');
        
        if (!toggle || !nav) return;
        
        let isOpen = false;
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            isOpen = !isOpen;
            nav.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
            
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            }
        });
        
        // Close on resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && isOpen) {
                isOpen = false;
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        perf.mark('mobileNavInit');
    }
    
    // Theme toggle
    function initTheme() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;
        
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        
        toggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
        
        perf.mark('themeInit');
    }
    
    // Lazy loading for images
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, { rootMargin: '50px' });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
            
            perf.mark('lazyLoadInit');
        }
    }
    
    // Stats counter animation
    function initStatsCounter() {
        const stats = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => observer.observe(stat));
        
        function animateCounter(element) {
            const target = element.getAttribute('data-target');
            const num = parseInt(target) || 0;
            const suffix = target.replace(/\\d/g, '');
            
            let current = 0;
            const increment = num / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= num) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
            }, 40);
        }
        
        perf.mark('statsInit');
    }
    
    // Initialize everything
    ready(function() {
        perf.mark('domReady');
        
        initMobileNav();
        initTheme();
        initLazyLoading();
        initStatsCounter();
        
        perf.mark('allInit');
        
        // Report performance after page load
        window.addEventListener('load', function() {
            perf.mark('pageLoad');
            setTimeout(() => perf.report(), 1000);
        });
    });
    
})();
"""
    
    with open("js/optimized.js", "w") as f:
        f.write(optimized_js)
    
    print("✅ Created optimized.js")

def create_performance_monitor():
    """Create a performance monitoring script"""
    
    monitor_js = """
// Performance Monitor for ESL Fun Online
(function() {
    'use strict';
    
    // Web Vitals measurement
    function measureWebVitals() {
        // Measure FCP
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    console.log('FCP:', entry.startTime);
                }
            }
        }).observe({ entryTypes: ['paint'] });
        
        // Measure LCP
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Measure CLS
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Measure FID
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        }).observe({ entryTypes: ['first-input'] });
    }
    
    // Resource loading analysis
    function analyzeResources() {
        window.addEventListener('load', function() {
            const resources = performance.getEntriesByType('resource');
            
            console.group('Resource Analysis');
            
            resources.forEach(resource => {
                if (resource.transferSize > 100000) { // > 100KB
                    console.warn(`Large resource: ${resource.name} (${(resource.transferSize/1024).toFixed(1)}KB)`);
                }
                
                if (resource.duration > 1000) { // > 1s
                    console.warn(`Slow resource: ${resource.name} (${resource.duration.toFixed(0)}ms)`);
                }
            });
            
            console.groupEnd();
        });
    }
    
    // Initialize monitoring
    if (window.location.search.includes('debug=performance')) {
        measureWebVitals();
        analyzeResources();
    }
    
})();
"""
    
    with open("js/performance-monitor.js", "w") as f:
        f.write(monitor_js)
    
    print("✅ Created performance-monitor.js")

def create_htaccess():
    """Create .htaccess file for server-side optimizations"""
    
    htaccess_content = """
# ESL Fun Online - Performance Optimizations

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    
    # Images
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    
    # CSS and JavaScript
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/x-javascript "access plus 1 month"
    
    # Fonts
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    
    # HTML
    ExpiresByType text/html "access plus 1 day"
    
    # Default
    ExpiresDefault "access plus 1 week"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    # HSTS
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # Content Security Policy
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';"
    
    # X-Frame-Options
    Header always set X-Frame-Options "DENY"
    
    # X-Content-Type-Options
    Header always set X-Content-Type-Options "nosniff"
    
    # Referrer Policy
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Cross-Origin-Opener-Policy
    Header always set Cross-Origin-Opener-Policy "same-origin"
</IfModule>

# Enable Keep-Alive
<IfModule mod_headers.c>
    Header set Connection keep-alive
</IfModule>

# Remove ETags
FileETag None

# Redirect to HTTPS
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
"""
    
    with open(".htaccess", "w") as f:
        f.write(htaccess_content)
    
    print("✅ Created .htaccess")

def generate_implementation_checklist():
    """Generate a step-by-step implementation checklist"""
    
    checklist = """
# ESL Fun Online - Performance Optimization Checklist

## 🚨 IMMEDIATE ACTIONS (Do Today)

### 1. Image Optimization
- [ ] Run the image optimization script: `python3 optimize-images.py`
- [ ] Replace hero background with optimized version
- [ ] Add preload link for hero image in HTML head:
      `<link rel="preload" href="images/hero-bg-desktop.webp" as="image">`

### 2. Critical CSS
- [ ] Replace current CSS loading with critical CSS inline
- [ ] Move non-critical CSS to load asynchronously
- [ ] Test that above-the-fold content renders correctly

### 3. JavaScript Optimization
- [ ] Move Google Analytics script to end of body
- [ ] Add `defer` attribute to non-critical scripts
- [ ] Replace current navigation.js with optimized.js

### 4. HTML Improvements
- [ ] Add width/height attributes to all images
- [ ] Add `loading="lazy"` to below-the-fold images
- [ ] Add security headers (copy from .htaccess)

## ⚡ PHASE 1: Critical Performance (1-2 Days)

### Image Optimization
- [ ] Convert hero image to WebP format
- [ ] Create responsive image sizes (desktop, tablet, mobile)
- [ ] Implement responsive image loading

### CSS Optimization
- [ ] Combine and minify CSS files
- [ ] Remove unused CSS rules
- [ ] Inline critical above-the-fold CSS

### JavaScript Optimization
- [ ] Minify JavaScript files
- [ ] Remove unused JavaScript
- [ ] Implement lazy loading for interactive elements

### Resource Loading
- [ ] Add preconnect hints for external domains
- [ ] Implement proper font loading strategy
- [ ] Optimize third-party script loading

## 🔧 PHASE 2: Advanced Optimization (3-5 Days)

### Performance Monitoring
- [ ] Implement Web Vitals measurement
- [ ] Set up performance budget alerts
- [ ] Add resource loading analysis

### Caching Strategy
- [ ] Upload .htaccess file to server
- [ ] Configure browser caching
- [ ] Implement service worker for offline caching

### Security & Best Practices
- [ ] Add Content Security Policy
- [ ] Implement HSTS header
- [ ] Add X-Frame-Options protection
- [ ] Fix deprecated API warnings

## 📊 TESTING & VALIDATION

### Performance Testing
- [ ] Test with Lighthouse (target 90+ performance score)
- [ ] Test with WebPageTest
- [ ] Test on real devices (3G network)
- [ ] Validate Core Web Vitals improvements

### Functionality Testing
- [ ] Test mobile navigation
- [ ] Test theme toggle
- [ ] Test all interactive elements
- [ ] Test in different browsers

### Accessibility Testing
- [ ] Fix contrast ratio issues
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Validate ARIA attributes

## 🎯 SUCCESS METRICS

Target improvements:
- Performance Score: 58 → 90+
- First Contentful Paint: 6.3s → <2s  
- Largest Contentful Paint: 11.7s → <2.5s
- Total Blocking Time: 90ms → <50ms
- Cumulative Layout Shift: 0 → <0.1

## 📝 MONITORING

After implementation:
- [ ] Monitor Core Web Vitals weekly
- [ ] Check Lighthouse scores monthly
- [ ] Review server performance logs
- [ ] Track user experience metrics

## 🚀 ADVANCED FEATURES (Optional)

- [ ] Implement Progressive Web App features
- [ ] Add offline functionality
- [ ] Implement push notifications
- [ ] Add background sync
- [ ] Consider HTTP/2 server push
"""
    
    with open("PERFORMANCE_CHECKLIST.md", "w") as f:
        f.write(checklist)
    
    print("✅ Created PERFORMANCE_CHECKLIST.md")

def main():
    """Main execution function"""
    
    # Analyze current performance
    issues = analyze_current_performance()
    
    # Display issues by priority
    for priority, issue_list in issues.items():
        if issue_list:
            print(f"\n🔴 {priority.upper()} Issues:")
            for issue in issue_list:
                print(f"   • {issue}")
    
    # Generate optimization plan
    plan = generate_optimization_plan(issues)
    
    for phase, tasks in plan.items():
        print(f"\n📋 {phase.upper()}:")
        for task in tasks:
            print(f"   • {task}")
    
    # Create optimized files
    create_optimized_files()
    
    # Generate implementation checklist
    generate_implementation_checklist()
    
    print("\n" + "=" * 60)
    print("🎉 Performance optimization package created!")
    print("=" * 60)
    print("\n📁 Generated Files:")
    print("   • css/critical-minified.css - Minified critical CSS")
    print("   • js/optimized.js - Optimized JavaScript")
    print("   • js/performance-monitor.js - Performance monitoring")
    print("   • .htaccess - Server optimizations")
    print("   • PERFORMANCE_CHECKLIST.md - Implementation guide")
    print("   • optimize-images.py - Image optimization script")
    
    print("\n🚀 Next Steps:")
    print("1. Run: python3 optimize-images.py (requires Pillow)")
    print("2. Follow the PERFORMANCE_CHECKLIST.md")
    print("3. Test changes with Lighthouse")
    print("4. Monitor performance improvements")
    
    print("\n💡 Quick Wins (Implement Today):")
    print("• Add image preload links")
    print("• Move scripts to end of body") 
    print("• Add width/height to images")
    print("• Defer non-critical CSS")
    print("• Compress hero background image")

if __name__ == "__main__":
    main()