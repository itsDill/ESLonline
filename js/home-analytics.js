(function () {
  "use strict";

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || !document.querySelector("main")?.contains(link)) return;
    if (typeof window.gtag !== "function") return;

    const section = link.closest("section");
    let sectionName = section?.id || section?.classList[0] || "main_content";
    if (section?.classList.contains("learning-paths-section")) {
      sectionName = "learning_journey";
    } else if (section?.classList.contains("home-featured-games")) {
      sectionName = "featured_games";
    } else if (section?.classList.contains("hero")) {
      sectionName = "hero";
    }

    const destination = new URL(link.href, window.location.href);
    window.gtag("event", "home_navigation_click", {
      link_text: link.textContent.replace(/\s+/g, " ").trim().slice(0, 100),
      link_url: `${destination.pathname}${destination.hash}`,
      link_section: sectionName,
    });
  });
})();
