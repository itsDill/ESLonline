
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
