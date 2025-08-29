/**
 * Enhanced Footer Component
 * ESL Fun Online - Professional Footer for All Pages
 */

const FooterComponent = {
  // Generate the enhanced footer HTML dynamically based on page location
  generateFooterHTML(pagePath = "") {
    // Determine the relative path based on current page location
    const basePath = this.getBasePath(pagePath);

    return `
    <!-- Enhanced Professional Footer -->
    <footer>
      <div class="container">
        <!-- Newsletter Section -->
        <div class="footer-newsletter">
          <div class="newsletter-content">
            <div class="newsletter-text">
              <h3><i class="fas fa-paper-plane"></i> Stay Updated</h3>
              <p>Get the latest learning resources and tips delivered to your inbox</p>
            </div>
            <div class="newsletter-form">
              <input type="email" placeholder="Enter your email address" id="newsletterEmail">
              <button type="button" class="btn-newsletter" onclick="subscribeNewsletter()">
                <i class="fas fa-arrow-right"></i>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div class="footer-content">
          <!-- Brand Section with enhanced info -->
          <div class="footer-section footer-brand">
            <div class="brand-header">
              <img src="${basePath}images/1.png" alt="ESL Fun Online" class="footer-logo">
              <h3>ESL Fun Online</h3>
            </div>
            <p>
              Transform your English and coding skills with our premium interactive resources. 
              Join thousands of successful learners mastering IELTS, TOEIC, business English, 
              and cutting-edge programming languages.
            </p>
            
            <!-- Achievement Stats -->
            <div class="footer-stats">
              <div class="stat-item">
                <span class="stat-number">100+</span>
                <span class="stat-label">Students</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">15</span>
                <span class="stat-label">Courses</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">17</span>
                <span class="stat-label">Countries</span>
              </div>
            </div>

            <!-- Social Media Links -->
            <div class="social-links">
              <a href="#" class="social-link" data-tooltip="Facebook">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-link" data-tooltip="Twitter">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-link" data-tooltip="LinkedIn">
                <i class="fab fa-linkedin-in"></i>
              </a>
              <a href="#" class="social-link" data-tooltip="YouTube">
                <i class="fab fa-youtube"></i>
              </a>
              <a href="#" class="social-link" data-tooltip="Instagram">
                <i class="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <!-- English Learning Section -->
          <div class="footer-section">
            <h3><i class="fas fa-graduation-cap"></i> English Learning</h3>
            <ul>
              <li>
                <a href="${basePath}english/grammar.html">
                  <i class="fas fa-spell-check"></i>
                  <span>Grammar Guides</span>
                </a>
              </li>
              <li>
                <a href="${basePath}english/vocabguide.html">
                  <i class="fas fa-book-open"></i>
                  <span>Vocabulary Builder</span>
                </a>
              </li>
              <li>
                <a href="${basePath}english/ielts.html">
                  <i class="fas fa-certificate"></i>
                  <span>IELTS Preparation</span>
                </a>
              </li>
              <li>
                <a href="${basePath}english/toeic.html">
                  <i class="fas fa-briefcase"></i>
                  <span>TOEIC Preparation</span>
                </a>
              </li>
              <li>
                <a href="${basePath}english/business.html">
                  <i class="fas fa-handshake"></i>
                  <span>Business English</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Programming Section -->
          <div class="footer-section">
            <h3><i class="fas fa-code"></i> Programming</h3>
            <ul>
              <li>
                <a href="${basePath}coding/computerbasics.html">
                  <i class="fas fa-desktop"></i>
                  <span>Computer Basics</span>
                </a>
              </li>
              <li>
                <a href="${basePath}coding/ai.html">
                  <i class="fas fa-robot"></i>
                  <span>AI Fundamentals</span>
                </a>
              </li>
              <li>
                <a href="${basePath}coding/codingresources.html">
                  <i class="fas fa-terminal"></i>
                  <span>Coding Resources</span>
                </a>
              </li>
              <li>
                <a href="${basePath}games/games.html">
                  <i class="fas fa-gamepad"></i>
                  <span>Educational Games</span>
                </a>
              </li>
              <li>
                <a href="${basePath}tools/tools.html">
                  <i class="fas fa-tools"></i>
                  <span>Developer Toolkit</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Quick Links Section -->
          <div class="footer-section">
            <h3><i class="fas fa-link"></i> Quick Links</h3>
            <ul>
              <li>
                <a href="${basePath}blog/blog.html">
                  <i class="fas fa-blog"></i>
                  <span>Learning Blog</span>
                </a>
              </li>
              <li>
                <a href="${basePath}lessons.html">
                  <i class="fas fa-chalkboard-teacher"></i>
                  <span>Online Lessons</span>
                </a>
              </li>
              <li>
                <a href="${basePath}contact.html">
                  <i class="fas fa-envelope"></i>
                  <span>Contact Us</span>
                </a>
              </li>
              <li>
                <a href="#" onclick="openFeedbackModal()">
                  <i class="fas fa-star"></i>
                  <span>Leave Feedback</span>
                </a>
              </li>
              <li>
                <a href="#" onclick="openSupportModal()">
                  <i class="fas fa-question-circle"></i>
                  <span>Get Support</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Enhanced Footer Bottom -->
        <div class="footer-bottom">
          <div class="footer-bottom-left">
            <p>&copy; 2025 <strong>ESL Fun Online</strong>. All rights reserved.</p>
            <p class="footer-subtitle">Empowering learners worldwide since 2020</p>
          </div>
          
          <div class="footer-bottom-center">
            <div class="footer-links">
              <a href="${basePath}privacy.html">
                <i class="fas fa-shield-alt"></i>
                Privacy Policy
              </a>
              <a href="${basePath}terms.html">
                <i class="fas fa-file-contract"></i>
                Terms of Service
              </a>
              <a href="${basePath}cookies.html">
                <i class="fas fa-cookie-bite"></i>
                Cookie Policy
              </a>
            </div>
          </div>

          <div class="footer-bottom-right">
            <div class="footer-badges">
              <div class="badge" data-tooltip="Trusted by students worldwide">
                <i class="fas fa-award"></i>
                <span>Certified</span>
              </div>
              <div class="badge" data-tooltip="Secure learning platform">
                <i class="fas fa-lock"></i>
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Back to Top Button -->
        <button class="back-to-top" id="backToTop" onclick="scrollToTop()">
          <i class="fas fa-chevron-up"></i>
        </button>
      </div>
    </footer>
    `;
  },

  // Enhanced functionality injection
  injectFooterFunctionality() {
    // Only inject if not already injected
    if (window.footerFunctionalityInjected) return;

    const script = document.createElement("script");
    script.textContent = `
      // Enhanced Footer Functionality
      
      // Newsletter subscription
      function subscribeNewsletter() {
        const emailInput = document.getElementById('newsletterEmail');
        const email = emailInput.value.trim();
        
        if (!email) {
          showNotification('Please enter your email address', 'warning');
          return;
        }
        
        if (!isValidEmail(email)) {
          showNotification('Please enter a valid email address', 'error');
          return;
        }
        
        // Simulate subscription (replace with actual API call)
        const btn = document.querySelector('.btn-newsletter');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        btn.disabled = true;
        
        setTimeout(() => {
          showNotification('Thank you for subscribing! Check your email for confirmation.', 'success');
          emailInput.value = '';
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 2000);
      }
      
      // Email validation
      function isValidEmail(email) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return emailRegex.test(email);
      }
      
      // Smooth scroll to top
      function scrollToTop() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
      // Initialize back to top button
      function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
          // Show/hide based on scroll position
          function toggleBackToTop() {
            if (window.scrollY > 500) {
              backToTopBtn.classList.add('show');
            } else {
              backToTopBtn.classList.remove('show');
            }
          }

          window.addEventListener('scroll', toggleBackToTop);
          toggleBackToTop(); // Initial check
        }
      }
      
      // Feedback modal
      function openFeedbackModal() {
        showNotification('Feedback form coming soon! Please contact us directly for now.', 'info');
      }
      
      // Support modal
      function openSupportModal() {
        showNotification('Support chat coming soon! Please use our contact form for help.', 'info');
      }
      
      // Notification system
      function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = \`notification notification-\${type}\`;
        notification.innerHTML = \`
          <div class="notification-content">
            <i class="fas fa-\${getNotificationIcon(type)}"></i>
            <span>\${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
              <i class="fas fa-times"></i>
            </button>
          </div>
        \`;
        
        // Add notification styles if not already added
        if (!document.querySelector('#notification-styles')) {
          const styles = document.createElement('style');
          styles.id = 'notification-styles';
          styles.textContent = \`
            .notification {
              position: fixed;
              top: 100px;
              right: 20px;
              z-index: 10000;
              max-width: 400px;
              padding: 1rem 1.5rem;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
              backdrop-filter: blur(10px);
              animation: slideInRight 0.3s ease-out;
              margin-bottom: 10px;
            }
            
            .notification-info {
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
            }
            
            .notification-success {
              background: linear-gradient(135deg, #10b981, #059669);
              color: white;
            }
            
            .notification-warning {
              background: linear-gradient(135deg, #f59e0b, #d97706);
              color: white;
            }
            
            .notification-error {
              background: linear-gradient(135deg, #ef4444, #dc2626);
              color: white;
            }
            
            .notification-content {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            
            .notification-close {
              background: none;
              border: none;
              color: currentColor;
              cursor: pointer;
              padding: 4px;
              border-radius: 4px;
              margin-left: auto;
              opacity: 0.8;
              transition: opacity 0.2s ease;
            }
            
            .notification-close:hover {
              opacity: 1;
              background: rgba(255, 255, 255, 0.1);
            }
            
            @keyframes slideInRight {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            
            @media (max-width: 480px) {
              .notification {
                left: 20px;
                right: 20px;
                max-width: none;
              }
            }
          \`;
          document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
          if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease-in reverse';
            setTimeout(() => notification.remove(), 300);
          }
        }, 5000);
      }
      
      function getNotificationIcon(type) {
        switch (type) {
          case 'success': return 'check-circle';
          case 'warning': return 'exclamation-triangle';
          case 'error': return 'times-circle';
          default: return 'info-circle';
        }
      }

      // Initialize footer functionality
      document.addEventListener('DOMContentLoaded', function() {
        initBackToTop();
        
        // Enter key support for newsletter
        const emailInput = document.getElementById('newsletterEmail');
        if (emailInput) {
          emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
              subscribeNewsletter();
            }
          });
        }
      });
      
      window.footerFunctionalityInjected = true;
    `;
    document.head.appendChild(script);
  },

  // Determine the base path for links based on current page location
  getBasePath(pagePath) {
    // If no path provided, try to determine from current location
    if (!pagePath) {
      const currentPath = window.location.pathname;
      const pathParts = currentPath
        .split("/")
        .filter((part) => part.length > 0);

      // Count how many levels deep we are
      const depth = pathParts.length - 1; // -1 because we don't count the filename

      if (depth === 0) {
        return "./"; // Root level
      } else {
        return "../".repeat(depth);
      }
    }

    // If path provided, calculate relative path
    const parts = pagePath
      .split("/")
      .filter((part) => part.length > 0 && part !== "index.html");
    return parts.length === 0 ? "./" : "../".repeat(parts.length);
  },

  // Initialize footer on page load
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.insertFooter();
      this.injectFooterFunctionality();
    });
  },

  // Insert footer into the page if it doesn't exist
  insertFooter() {
    const existingFooter = document.querySelector("footer");
    const footerPlaceholder = document.querySelector("#footer-placeholder");

    if (!existingFooter && !footerPlaceholder) {
      // Insert footer before the closing body tag
      const footerHTML = this.generateFooterHTML();
      document.body.insertAdjacentHTML("beforeend", footerHTML);
    } else if (footerPlaceholder) {
      // Replace placeholder with actual footer
      footerPlaceholder.outerHTML = this.generateFooterHTML();
    }
  },

  // Update existing footer if needed
  updateFooter(pagePath) {
    const existingFooter = document.querySelector("footer");
    if (existingFooter) {
      const newFooterHTML = this.generateFooterHTML(pagePath);
      existingFooter.outerHTML = newFooterHTML;
      this.injectFooterFunctionality();
    }
  },
};

// Auto-initialize if not already initialized
if (typeof window !== "undefined") {
  FooterComponent.init();
}

// Export for use in other scripts
window.FooterComponent = FooterComponent;
