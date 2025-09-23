
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
            const suffix = target.replace(/\d/g, '');
            
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
