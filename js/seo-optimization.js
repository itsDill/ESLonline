/* SEO Meta Description Optimization for ESL Fun Online
   This file contains functions to dynamically update meta descriptions
   based on page content for better SEO performance.
*/

// Enhanced meta tag management for SEO
class SEOManager {
  constructor() {
    this.init();
  }

  init() {
    this.updateMetaDescriptions();
    this.addMissingAltTags();
    this.optimizeImages();
    this.addSchemaMarkup();
  }

  // Update meta descriptions based on page content
  updateMetaDescriptions() {
    const currentPage = window.location.pathname;
    const metaDescriptions = {
      "/": "Master English with ESL Fun Online - Premium interactive resources, IELTS/TOEIC prep, business English, coding tutorials & educational games. Join 10,000+ successful learners worldwide!",
      "/english/grammar.html":
        "Master English grammar with comprehensive guides & interactive exercises. Learn verb tenses, articles, prepositions & more with clear explanations for all levels.",
      "/english/vocabguide.html":
        "Build your English vocabulary with our comprehensive word guides, interactive exercises, and practical usage examples for beginner to advanced learners.",
      "/english/business.html":
        "Master business English with professional communication skills, workplace vocabulary, email etiquette, and presentation techniques for career success.",
      "/coding/codingresources.html":
        "Learn programming from scratch with beginner-friendly tutorials covering HTML, CSS, JavaScript, Python & computer science fundamentals.",
      "/games/games.html":
        "Play educational games to improve English & coding skills. Interactive quizzes, word games, puzzles & programming challenges for fun learning.",
      "/blog/blog.html":
        "Expert ESL articles, teaching tips, coding tutorials & educational resources. Stay updated with latest learning strategies & language acquisition techniques.",
    };

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && metaDescriptions[currentPage]) {
      metaDescription.setAttribute("content", metaDescriptions[currentPage]);
    }
  }

  // Add missing alt tags to images
  addMissingAltTags() {
    const images = document.querySelectorAll("img:not([alt])");
    images.forEach((img) => {
      const src = img.src;
      const fileName = src.split("/").pop().split(".")[0];

      // Generate meaningful alt text based on context
      let altText = "ESL Fun Online educational content";

      if (fileName.includes("grammar")) {
        altText = "English grammar learning materials and exercises";
      } else if (fileName.includes("vocab")) {
        altText = "Vocabulary building resources and word guides";
      } else if (fileName.includes("coding")) {
        altText = "Programming and coding tutorial materials";
      } else if (fileName.includes("game")) {
        altText = "Educational games for language learning";
      }

      img.setAttribute("alt", altText);
    });
  }

  // Optimize images with lazy loading
  optimizeImages() {
    const images = document.querySelectorAll("img:not([loading])");
    images.forEach((img, index) => {
      // Add lazy loading to images below the fold
      if (index > 2) {
        img.setAttribute("loading", "lazy");
      }

      // Add proper dimensions if missing
      if (!img.hasAttribute("width") || !img.hasAttribute("height")) {
        img.onload = function () {
          this.setAttribute("width", this.naturalWidth);
          this.setAttribute("height", this.naturalHeight);
        };
      }
    });
  }

  // Add dynamic schema markup
  addSchemaMarkup() {
    const pageType = this.getPageType();

    if (pageType === "course") {
      this.addCourseSchema();
    } else if (pageType === "article") {
      this.addArticleSchema();
    }
  }

  getPageType() {
    const pathname = window.location.pathname;

    if (pathname.includes("/english/") || pathname.includes("/coding/")) {
      return "course";
    } else if (pathname.includes("/blog/")) {
      return "article";
    }

    return "website";
  }

  addCourseSchema() {
    const title = document.querySelector("h1")?.textContent || document.title;
    const description =
      document.querySelector('meta[name="description"]')?.content || "";

    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: title,
      description: description,
      provider: {
        "@type": "Organization",
        name: "ESL Fun Online",
        url: "https://eslfunonline.com",
      },
      courseMode: "online",
      educationalCredentialAwarded: "Certificate of Completion",
      timeRequired: "PT1H",
      inLanguage: "en",
      availableLanguage: "English",
      teaches: title.toLowerCase().includes("grammar")
        ? "English Grammar"
        : title.toLowerCase().includes("vocab")
        ? "English Vocabulary"
        : title.toLowerCase().includes("business")
        ? "Business English"
        : title.toLowerCase().includes("coding")
        ? "Programming"
        : "English",
    };

    this.insertSchema(schema);
  }

  addArticleSchema() {
    const title = document.querySelector("h1")?.textContent || document.title;
    const description =
      document.querySelector('meta[name="description"]')?.content || "";

    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: description,
      author: {
        "@type": "Organization",
        name: "ESL Fun Online",
      },
      publisher: {
        "@type": "Organization",
        name: "ESL Fun Online",
        logo: {
          "@type": "ImageObject",
          url: "https://eslfunonline.com/images/1.png",
        },
      },
      datePublished: new Date().toISOString().split("T")[0],
      dateModified: new Date().toISOString().split("T")[0],
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": window.location.href,
      },
    };

    this.insertSchema(schema);
  }

  insertSchema(schema) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // Update page title for better SEO
  static updatePageTitle(newTitle) {
    document.title = newTitle;

    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", newTitle);
    }

    // Update Twitter title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute("content", newTitle);
    }
  }

  // Track page views for analytics
  static trackPageView() {
    if (typeof gtag !== "undefined") {
      gtag("config", "G-9G9RD6BHLN", {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }
}

// Initialize SEO Manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SEOManager();
  SEOManager.trackPageView();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = SEOManager;
}
