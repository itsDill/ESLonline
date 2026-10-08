(() => {
  "use strict";

  if (!/\/resources\//.test(window.location.pathname)) return;
  if (document.body?.classList.contains("resource-page-experience")) return;

  const currentScript = document.currentScript;
  const scriptUrl =
    currentScript?.src ||
    new URL("./resource-page-experience.js", document.baseURI).href;
  const publisherId = "ca-pub-2456627863532019";
  const adSlot = "1608321981";

  const themes = {
    grammar: { label: "Grammar guide", first: "#1769aa", second: "#18a999" },
    vocabulary: {
      label: "Vocabulary practice",
      first: "#7048c8",
      second: "#d64b91",
    },
    business: {
      label: "Business English",
      first: "#0c766e",
      second: "#e39a28",
    },
    exams: { label: "Exam preparation", first: "#4338a8", second: "#7775ec" },
    tools: { label: "Learning tool", first: "#bf541c", second: "#e19a35" },
    teaching: {
      label: "Teaching resource",
      first: "#287447",
      second: "#9aab39",
    },
    learning: {
      label: "English learning",
      first: "#147d91",
      second: "#55a978",
    },
  };

  function getTheme(title) {
    const path = window.location.pathname.toLowerCase();
    const text = `${path} ${title}`.toLowerCase();
    if (
      /\/business\//.test(path) ||
      /business english|workplace|meeting|negotiat|presentation|email template|interview/.test(
        text,
      )
    )
      return themes.business;
    if (/\/tools\//.test(path)) return themes.tools;
    if (
      /\/lessons-and-blog\//.test(path) &&
      /teacher|teaching|classroom|lesson plan/.test(text)
    )
      return themes.teaching;
    if (
      /\/vocabulary\//.test(path) ||
      /vocab|flashcard|word famil|word form|idiom|phrasal verb|collocation|pronunciation|spelling/.test(
        text,
      )
    )
      return themes.vocabulary;
    if (
      /ielts|toefl|toeic|eiken|cambridge|exam preparation|test preparation/.test(
        text,
      )
    )
      return themes.exams;
    if (
      /\/english\//.test(path) &&
      /grammar|tense|verb|noun|adjective|adverb|article|preposition|clause|conditional|punctuation|pronoun|passive|gerund|modal/.test(
        text,
      )
    )
      return themes.grammar;
    if (/teacher|teaching|classroom|teacher-hub/.test(text))
      return themes.teaching;
    if (/\/lessons-and-blog\//.test(path)) return themes.learning;
    return themes.learning;
  }

  function addStylesheet() {
    if (document.querySelector("link[data-resource-experience-css]")) return;
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = new URL(
      "../css/resource-page-experience.css",
      scriptUrl,
    ).href;
    stylesheet.dataset.resourceExperienceCss = "true";
    document.head.append(stylesheet);
  }

  function pageTitle() {
    const heading = document.querySelector("h1:not([hidden])");
    return (
      heading?.textContent.trim() ||
      document.title.replace(/\s*[|–-].*$/, "").trim() ||
      "English learning resource"
    );
  }

  function addSiteNavigation() {
    const existingHeader = document.querySelector("header:not(.page-header)");
    if (existingHeader && !existingHeader.querySelector("nav")) {
      existingHeader.classList.add("rpe-existing-site-nav");
      const path = window.location.pathname;
      const isIndex = /\/resources\/(?:index\.html)?$/.test(path);
      const relativeRoot = isIndex ? "../" : "../../";
      const nav = document.createElement("nav");
      nav.className = "rpe-site-links";
      nav.setAttribute("aria-label", "Main navigation");
      nav.innerHTML = `
        <a href="${relativeRoot}index.html">Home</a>
        <a href="${relativeRoot}games/games.html">Games</a>
        <a href="${isIndex ? "index.html" : "../index.html"}" aria-current="page">Resources</a>
        <a href="${relativeRoot}teacher-hub/index.html">Teacher hub</a>
        <a href="${isIndex ? "lessons-and-blog/blog.html" : "../lessons-and-blog/blog.html"}">Blog</a>`;
      existingHeader.append(nav);
      return;
    }
    if (existingHeader || document.querySelector(".rpe-site-nav")) return;

    const path = window.location.pathname;
    const isIndex = /\/resources\/(?:index\.html)?$/.test(path);
    const relativeRoot = isIndex ? "../" : "../../";
    const header = document.createElement("header");
    header.className = "rpe-site-nav";
    header.innerHTML = `
      <a class="rpe-brand" href="${relativeRoot}index.html" aria-label="ESL Fun Online home">
        <span class="rpe-brand-mark" aria-hidden="true">E</span>
        <span>ESL Fun Online</span>
      </a>
      <nav class="rpe-site-links" aria-label="Main navigation">
        <a href="${relativeRoot}index.html">Home</a>
        <a href="${relativeRoot}games/games.html">Games</a>
        <a href="${isIndex ? "index.html" : "../index.html"}" aria-current="page">Resources</a>
        <a href="${relativeRoot}teacher-hub/index.html">Teacher hub</a>
        <a href="${isIndex ? "lessons-and-blog/blog.html" : "../lessons-and-blog/blog.html"}">Blog</a>
      </nav>`;

    document.body.prepend(header);
  }

  function getOrCreateHero(title, description, theme) {
    const h1 = document.querySelector("h1:not([hidden])");
    let hero = h1?.closest(
      ".hero-section, .hero, .page-hero, .page-header, [data-page-hero]",
    );

    if (!hero && h1) {
      hero = document.createElement("section");
      hero.className = "rpe-hero rpe-generated-hero";
      h1.id ||= "rpe-page-title";
      hero.setAttribute("aria-labelledby", h1.id);
      let pageRoot = h1;
      while (
        pageRoot.parentElement &&
        pageRoot.parentElement !== document.body
      ) {
        pageRoot = pageRoot.parentElement;
      }
      pageRoot.parentElement.insertBefore(hero, pageRoot);
      hero.append(h1);
      const nearbyDescription = hero.nextElementSibling?.matches("p")
        ? hero.nextElementSibling
        : null;
      if (nearbyDescription) hero.append(nearbyDescription);
      else if (description) {
        const summary = document.createElement("p");
        summary.className = "rpe-hero-summary";
        summary.textContent = description;
        hero.append(summary);
      }
    }

    if (!hero) {
      hero = document.createElement("section");
      hero.className = "rpe-hero rpe-generated-hero";
      const heading = document.createElement("h1");
      heading.id = "rpe-page-title";
      heading.textContent = title;
      hero.setAttribute("aria-labelledby", heading.id);
      hero.append(heading);
      if (description) {
        const summary = document.createElement("p");
        summary.className = "rpe-hero-summary";
        summary.textContent = description;
        hero.append(summary);
      }
      const main =
        document.querySelector("main") || document.body.firstElementChild;
      if (main) main.before(hero);
      else document.body.append(hero);
    }

    hero.classList.add("rpe-hero");
    hero.dataset.resourceTopic = theme.label.toLowerCase().replace(/\s+/g, "-");
    const content = hero.querySelector(".hero-content") || hero;
    let heroHeading = content.querySelector("h1") || hero.querySelector("h1");
    if (!heroHeading) {
      heroHeading = document.createElement("h1");
      heroHeading.textContent = title;
      content.prepend(heroHeading);
    }
    heroHeading.classList.add("rpe-hero-title");

    if (!hero.querySelector(".rpe-hero-kicker")) {
      const kicker = document.createElement("span");
      kicker.className = "rpe-hero-kicker";
      kicker.textContent = theme.label;
      heroHeading.before(kicker);
    }

    if (
      !hero.querySelector(
        ".hero-subtitle, .hero-description, .rpe-hero-summary",
      ) &&
      description
    ) {
      const summary = document.createElement("p");
      summary.className = "rpe-hero-summary";
      summary.textContent = description;
      heroHeading.after(summary);
    }

    hero
      .querySelectorAll(".hero-bg")
      .forEach((image) => image.setAttribute("aria-hidden", "true"));
    return hero;
  }

  function ensureAd(hero) {
    let ad = document.querySelector("ins.adsbygoogle[data-ad-slot]");
    if (ad) {
      const section = ad.closest("section") || ad.parentElement;
      section?.classList.add("rpe-ad-band");
      ad.parentElement?.classList.add("rpe-ad-inner");
      return section || hero;
    }

    const section = document.createElement("section");
    section.className = "rpe-ad-band";
    section.setAttribute("aria-label", "Advertisement");
    section.innerHTML = `
      <div class="rpe-ad-inner">
        <span class="rpe-ad-label">Advertisement</span>
        <ins class="adsbygoogle rpe-ad-unit"
          style="display:block"
          data-ad-client="${publisherId}"
          data-ad-slot="${adSlot}"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      </div>`;
    hero.insertAdjacentElement("afterend", section);

    if (
      !document.querySelector(
        'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
      )
    ) {
      const loader = document.createElement("script");
      loader.async = true;
      loader.crossOrigin = "anonymous";
      loader.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      document.head.append(loader);
    }
    if (!document.querySelector('meta[name="google-adsense-account"]')) {
      const account = document.createElement("meta");
      account.name = "google-adsense-account";
      account.content = publisherId;
      document.head.append(account);
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn(
        "Resource-page advertisement could not be initialized.",
        error,
      );
    }
    return section;
  }

  function uniqueId(heading, used) {
    const base =
      heading.textContent
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "section";
    let id = heading.id || base;
    let suffix = 2;
    while (
      used.has(id) ||
      (document.getElementById(id) && document.getElementById(id) !== heading)
    ) {
      id = `${base}-${suffix++}`;
    }
    heading.id = id;
    used.add(id);
    return id;
  }

  function ensureLocalNavigation(hero, adSection, title) {
    let nav = document.querySelector(
      ".quick-nav, nav[aria-label*='section' i], nav[aria-label*='page' i]",
    );
    const headings = [
      ...document.querySelectorAll(
        "main h2, main h3, article h2, article h3, body > h2, body > h3",
      ),
    ]
      .filter(
        (heading) =>
          !heading.closest("header, footer, nav, [hidden], .rpe-hero"),
      )
      .slice(0, 7);
    const used = new Set();

    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "rpe-section-nav";
      nav.setAttribute("aria-label", `Sections in ${title}`);
      nav.innerHTML =
        '<span class="rpe-nav-title">Explore this page</span><div class="quick-nav-links"></div>';
      const insertionPoint = adSection || hero;
      insertionPoint.insertAdjacentElement("afterend", nav);
    } else {
      nav.classList.add("rpe-section-nav");
      if (!nav.hasAttribute("aria-label"))
        nav.setAttribute("aria-label", `Sections in ${title}`);
    }
    if (
      nav.compareDocumentPosition(adSection) & Node.DOCUMENT_POSITION_PRECEDING
    ) {
      adSection.insertAdjacentElement("afterend", nav);
    }

    let links =
      nav.querySelector(".quick-nav-links, .rpe-nav-links, ul") || nav;
    if (!links.querySelector('a[data-rpe-resource-link="true"]')) {
      const path = window.location.pathname;
      const isIndex = /\/resources\/(?:index\.html)?$/.test(path);
      const resourceLink = document.createElement("a");
      resourceLink.href = isIndex ? "index.html" : "../index.html";
      resourceLink.className = "rpe-resource-link";
      resourceLink.dataset.rpeResourceLink = "true";
      resourceLink.textContent = "All resources";
      links.prepend(resourceLink);
    }

    for (const heading of headings) {
      const id = uniqueId(heading, used);
      if (nav.querySelector(`a[href="#${CSS.escape(id)}"]`)) continue;
      const link = document.createElement("a");
      link.href = `#${id}`;
      link.textContent = heading.textContent.trim().replace(/\s+/g, " ");
      link.className = "rpe-section-link";
      links.append(link);
    }

    if (!headings.length && !links.querySelector("a[href^='#']")) {
      const target =
        document.querySelector("main, #main-content, article") || hero;
      target.id ||= "resource-content";
      const link = document.createElement("a");
      link.href = `#${CSS.escape(target.id)}`;
      link.className = "rpe-section-link";
      link.textContent = "Start learning";
      links.append(link);
    }
  }

  function setActiveGlobalNavigation() {
    document
      .querySelectorAll("header .nav-link, header nav a")
      .forEach((link) => {
        if (
          /resources\/index\.html|resources\/?$/.test(
            link.getAttribute("href") || "",
          )
        ) {
          link.classList.add("rpe-active");
        }
      });
  }

  function enhance() {
    if (
      !document.body ||
      document.body.classList.contains("resource-page-experience")
    )
      return;
    document.body.classList.add("resource-page-experience");
    addStylesheet();

    const title = pageTitle();
    const description =
      document.querySelector('meta[name="description"]')?.content?.trim() ||
      "Explore clear explanations, examples, and practical English-learning activities.";
    const theme = getTheme(title);
    const pagePadding = getComputedStyle(document.body);
    document.body.style.setProperty(
      "--rpe-page-gutter-left",
      pagePadding.paddingLeft || "0px",
    );
    document.body.style.setProperty(
      "--rpe-page-gutter-right",
      pagePadding.paddingRight || "0px",
    );
    document.body.style.setProperty("--rpe-accent", theme.first);
    document.body.style.setProperty("--rpe-accent-2", theme.second);
    document.body.dataset.resourceTopic = theme.label
      .toLowerCase()
      .replace(/\s+/g, "-");

    addSiteNavigation();
    const hero = getOrCreateHero(title, description, theme);
    const adSection = ensureAd(hero);
    ensureLocalNavigation(hero, adSection, title);
    setActiveGlobalNavigation();

    if (!document.querySelector(".skip-link, a[href='#main-content']")) {
      const skip = document.createElement("a");
      skip.className = "rpe-skip-link";
      skip.href = "#main-content";
      skip.textContent = "Skip to content";
      document.body.prepend(skip);
      const main =
        document.querySelector("main") || document.querySelector("article");
      if (main) main.id ||= "main-content";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhance, { once: true });
  } else {
    enhance();
  }
})();
