# ESL Fun Online — Full Site Audit

**Date:** 2026-08-11  
**Auditor:** GitHub Copilot (automated static analysis + live-site check)  
**Scope:** Local codebase vs. live site at https://eslfunonline.com  
**Note:** No code changes were made. This is a read-only audit.

---

## Executive Summary — Top 5 Issues by Impact

| #   | Issue                                                                                                                                                                                                                                                                    | Impact                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| 1   | **`index.html` is missing `<meta name="viewport">`** — the homepage has no viewport meta tag; on mobile browsers without it, the page renders at desktop width. Confirmed absent by code search; all other pages include it.                                             | Critical — affects every mobile visitor and Core Web Vitals |
| 2   | **"Placeholder" dates on 4 live blog cards** — `index.html` homepage shows the literal text "Placeholder" as the publication date on 4 blog article cards, visible on the live site right now. Professional credibility and AdSense policy risk.                         | High — visible to all visitors, damages trust               |
| 3   | **~50+ pages missing canonical tags** — entire coding/lessons, coding/projects, coding/tutorials, many english/ grammar pages, and most tools/ pages have no `<link rel="canonical">`. Google may choose incorrect canonical URLs, causing ranking dilution.             | High — SEO signal fragmentation                             |
| 4   | **90 CSS files, none bundled or minified** — each page loads its own CSS file plus shared ones. Causes multiple render-blocking round trips. Combined with 319 images missing `loading="lazy"` and 26 non-webp images in /images/, this significantly hurts LCP and TBT. | High — Core Web Vitals / PageSpeed                          |
| 5   | **`AggregateRating` schema with hardcoded fictional values** (`"ratingValue": "4.8", "reviewCount": "250"`) on every page via index.html, with no real review system on the site. Google's structured data policies prohibit fake reviews; this risks a manual action.   | High — structured data penalty risk                         |

---

## 1. SEO & Content

### 1.1 Meta Tags

| Location                                  | Issue                                                                                                                                                                                      | Why It Matters                                                                                                                      | Suggested Fix                                                                                                                     | Priority   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `index.html`                              | **Missing `<meta name="viewport">`** — the only public page lacking it                                                                                                                     | Mobile browsers render page at ~980px desktop width; Google's mobile-first indexing penalises non-mobile-optimised pages            | Add `<meta name="viewport" content="width=device-width, initial-scale=1.0">` as the second tag in `<head>` after `<meta charset>` | **High**   |
| `blog/blog.html` and most blog post pages | **`og:type` is `website`** on what should be article/blog pages                                                                                                                            | Social sharing previews and Google Discover miss the content type; article-type OG signals help content distribution                | Change to `og:type: article` and add `article:published_time` and `article:author` tags on each blog post                         | **Medium** |
| `blog/blog.html`                          | **`og:image` uses `/images/1.png`** (the logo) instead of a content image                                                                                                                  | Logo thumbnails perform poorly on social previews; a relevant article image improves CTR                                            | Use a dedicated hero image or blog cover graphic for the og:image                                                                 | **Medium** |
| All pages                                 | **`<meta name="keywords">`** present on every page (e.g. index.html has 11 keywords)                                                                                                       | Keywords meta is ignored by Google and Bing; it wastes head bandwidth and can signal low technical quality                          | Remove `<meta name="keywords">` across all pages                                                                                  | **Low**    |
| All pages                                 | **Multiple `<meta name="google-adsense-account">` before `<meta charset>`** — in `blog/blog.html` the AdSense `<script>` and adsense account meta appear _before_ `<meta charset="UTF-8">` | Charset should be the first tag in `<head>`; placing scripts before it can trigger speculative parsing issues and is incorrect HTML | Move `<meta charset="UTF-8">` to be the very first tag in `<head>` on all pages                                                   | **Medium** |

### 1.2 Missing Meta Descriptions

The following 7 public-facing pages have no `<meta name="description">`:

- `blog/lesson-countries.html`
- `blog/units-1-3-grammar-review.html`
- `english/questions-negation.html`
- `english/reported-speech.html`
- `english/speakinglesson.html`
- `games/word-jenga.html`
- `tools/random.html`

**Why it matters:** Google generates auto-snippets when description is absent, which are often poor quality and lower CTR.  
**Fix:** Add a unique 140–160 character `<meta name="description">` to each.  
**Priority:** Medium

### 1.3 Missing Canonical Tags (~54 pages)

The following sections have pages with **no `<link rel="canonical">`**:

- `coding/lessons/lesson1–4.html`
- `coding/projects/calculator.html`, `guessing-game.html`, `to-do-list.html`
- `coding/tutorials/email-basics.html`, `files-folders.html`, `internet-search.html`
- `contact.html`
- `english/cambridge.html`, `clauses.html`, `collocations.html`, `comparatives.html`, `conditionals.html`, `discourse-markers.html`, `gerunds-infinitives.html`, `nouns.html`, `onet-placeholder.html`, `parts-of-speech.html`, `passive.html`, `prefixessuffixes.html`, `prepositions.html`, `pronouns.html`, `punctuation.html`, `questions-negation.html`, `relative-clauses.html`, `reported-speech.html`, `speakinglesson.html`, `structure.html`, `toefl.html`, `vocab-*-flashcard.html` (9 files), `wordfamilies.html`, `wordforms.html`
- `games/picturereveal.html`, `spin.html`, `word-jenga.html`, `xo.html`
- `tools/case-study.html`, `decision-matrix.html`, `flashcards-chinese.html`, `flashcards-japanese.html`, `maths-test.html`, `presentation-timer.html`, `random.html`, `spin.html`, `swot-analysis.html`, `typing-test.html`
- `blog/units-1-3-grammar-review.html`

**Why it matters:** Without canonicals, Google picks a canonical itself; it may choose a cached, crawled variant with query parameters.  
**Fix:** Add `<link rel="canonical" href="https://eslfunonline.com/[path]">` to every page.  
**Priority:** High for top-traffic pages; Medium for tools/flashcards

### 1.4 Heading Hierarchy

| Location                             | Issue                                                                                                             | Suggested Fix                                                                                | Priority   |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------- |
| `blog/eiken.html`                    | **Two `<h1>` tags** (lines 35 and 181) — identical text                                                           | Remove or demote the duplicate; keep one H1                                                  | **High**   |
| `blog/grammar-mistakes.html`         | **Two `<h1>` tags** (lines 325 and 620)                                                                           | Demote second H1 to `<h2>`                                                                   | **High**   |
| `coding/ai/ai-tools.html`            | **Two `<h1>` tags** — "Discover AI Tools" (line 945) + "Tools Coming Soon!" (line 1716)                           | The "Coming Soon" fallback page should use `<h2>` or `<p>`                                   | **Medium** |
| `coding/ai/beginner-guide.html`      | **Two `<h1>` tags** — "Complete Beginner's Guide to AI" + "Guide Coming Soon!"                                    | Same as above — demote or remove the Coming Soon H1                                          | **Medium** |
| `coding/projects/calculator.html`    | **Two `<h1>` tags** — main title + "Project Coming Soon!"                                                         | Demote Coming Soon to `<h2>`                                                                 | **Medium** |
| `coding/projects/guessing-game.html` | **Two `<h1>` tags**                                                                                               | Same fix                                                                                     | **Medium** |
| `coding/webdev.html`                 | **Four `<h1>` tags** — one main title + three `<h1 style="margin: 0 0 10px">Welcome!</h1>` inside code demo boxes | Wrap code examples in `<code>` or `<pre>` and escape the HTML, or use `<h2>` for demo labels | **High**   |

### 1.5 Structured Data / Schema

| Location                                       | Issue                                                                                                                                                         | Suggested Fix                                                                                                                                  | Priority   |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `index.html` (and propagated via the homepage) | **`AggregateRating` with fabricated data** — `"ratingValue": "4.8"`, `"reviewCount": "250"` hardcoded in schema with no actual user review system on the site | Remove `aggregateRating` from schema entirely or integrate a real review mechanism. This violates Google's structured data quality guidelines. | **High**   |
| All blog post pages                            | **No `Article` or `BlogPosting` schema** — blog posts have `ld+json` blocks only in some business/ pages; most blog/ articles have none                       | Add `BlogPosting` schema to each blog article with `headline`, `datePublished`, `author`, `image`, and `url`                                   | **High**   |
| `blog/blog.html`                               | **`@type: website`** in schema instead of `Blog`                                                                                                              | Change to `"@type": "Blog"` with `blogPost` array or individual `BlogPosting` items                                                            | **Medium** |
| Games and tools pages                          | **No schema at all** — `games/games.html` and most tools/ pages have no structured data                                                                       | Consider `SoftwareApplication` schema for games/tools with `applicationCategory: "Educational"`                                                | **Low**    |
| `english/` grammar pages                       | **Missing `Course` or `Article` schema** — 30+ individual grammar lesson pages have no structured data                                                        | Add `Course` or `Article` schema with `educationalLevel`, `teaches`, and `author`                                                              | **Medium** |

### 1.6 Sitemap Coverage

The sitemap.xml contains **146 URLs**; the repo has **221+ HTML files**. The gap (~75 files) includes:

- All `coding/lessons/`, `coding/projects/`, `coding/tutorials/` pages
- Individual vocab flashcard pages (`english/vocab-*-flashcard.html`)
- Most `tools/` sub-pages
- `blog/lesson-fluency-2026.html`, `blog/lesson-countries.html`, `blog/units-1-3-grammar-review.html`
- Music pages, some games

**Why it matters:** Uncrawled or unsitemapped pages receive no crawl-budget prioritisation.  
**Fix:** Audit which pages should be indexed (exclude drafts/placeholders), then add missing pages to sitemap.xml with accurate `<lastmod>` dates.  
**Priority:** Medium

### 1.7 Placeholder & Incomplete Content

| Location                                                                                                                            | Issue                                                                                                                                                                                                 | Priority                                |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `index.html` lines 1287, 1321, 1355, 1389                                                                                           | **4 blog cards show "Placeholder" as date** on the live site — "Business English: Master Workplace Communication", "Job Interview English", "IELTS & TOEFL Preparation", "Professional Communication" | **High** — live issue                   |
| `blog/blog.html` lines 2913, 3156                                                                                                   | **2 blog post cards link to `href="#"`** — unpublished articles with no target page exist on the blog index                                                                                           | **Medium** — broken links in blog index |
| `blog/blog.html` sidebar                                                                                                            | **All category and tag links use `href="#"`** — sidebar categories (ESL Learners, ESL Teachers, etc.) and tags (ESL Tips, Grammar, etc.) are non-functional                                           | **Medium**                              |
| `coding/ai/ai-tools.html`, `coding/ai/beginner-guide.html`, `coding/projects/calculator.html`, `coding/projects/guessing-game.html` | **"Coming Soon!" fallback H1** visible in page source — these pages appear to have two states (live + placeholder) with both H1s present in DOM                                                       | **Medium**                              |
| `english/cambridge.html`                                                                                                            | H1: "Cambridge B2 First (FCE) Coming Soon!" — stub page is publicly accessible and indexed (not in robots Disallow)                                                                                   | **Medium**                              |
| `english/onet-placeholder.html`                                                                                                     | Placeholder page publicly accessible                                                                                                                                                                  | **Low**                                 |

### 1.8 URL Structure & Robots

| Issue                                                                                                                                             | Details                                                                                                     | Priority   |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------- |
| **robots.txt blocks `/scripts/`** but `scripts/` appears to only contain backend Python/shell files — confirm these aren't needed                 | Appropriate if they are server-side scripts; verify nothing essential is blocked                            | Low        |
| **`tools/lessonplan-old-backup.html`** and **`tools/flashcards-chinese-old.html`**, **`tools/flashcards-japanese-old.html`** not in Disallow list | Old backup files are publicly crawlable; add `Disallow: /*-old*` to robots.txt                              | **Medium** |
| Canonical URLs in blog/ pages use `.html` extension (e.g. `blog/blog.html`)                                                                       | Consistent — no issue, but ensure redirects resolve `/blog/` to `/blog/blog.html` if used in social sharing | Low        |

---

## 2. Performance & Core Web Vitals

### 2.1 Viewport Meta (Critical — affects mobile LCP)

`index.html` is the only page confirmed missing `<meta name="viewport">`. Without it, mobile browsers render the page at ~980px virtual viewport. This directly inflates LCP time on mobile (the hero image will be rendered at full desktop size).

**Priority: High**

### 2.2 Image Optimization

| Issue                                                                                                                                | Details                                                                                                                        | Priority   |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| **319 `<img>` elements missing `loading="lazy"`** across public pages                                                                | Every above-the-fold image with lazy loading causes unnecessary network requests on first load                                 | **High**   |
| **26 JPG/PNG images vs. only 4 WebP images** in `/images/`                                                                           | JPG/PNG are 2–5× larger than WebP equivalents; main offenders include `1.png` (logo used everywhere) and various lesson images | **High**   |
| Logo (`images/1.png`) loaded in PNG format at 1181×1181px, displayed at 40×40px                                                      | Massive size mismatch — serving an ~1181px PNG for a 40px display element                                                      | **High**   |
| `og:image` and Twitter card image both point to `images/hero.webp` (homepage) or `images/1.png` (blog) — `1.png` is a large PNG logo | Replace OG image with a compressed, descriptively named WebP at 1200×630px                                                     | **Medium** |
| No `srcset` or `<picture>` elements for responsive images                                                                            | All images served at one fixed size regardless of device                                                                       | **Medium** |

### 2.3 CSS Bloat

| Issue                                                                      | Details                                                                                                                               | Priority   |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **90 CSS files in `/css/`** — one per page component/section, none bundled | Every page makes multiple CSS HTTP requests; even with HTTP/2 multiplexing, 4–6 CSS files per page is expensive vs. 1–2 bundled files | **High**   |
| No minification                                                            | All CSS files are unminified source; typically 30–50% size savings from minification                                                  | **High**   |
| **68 inline `style=` attributes on `index.html`**                          | Significant inline style bloat prevents caching and makes CSS hard to maintain                                                        | **Medium** |
| **47 inline `style=` attributes on `blog/blog.html`**                      | Same issue                                                                                                                            | **Medium** |
| Hero CSS preloaded with `media="(max-width: 768px)"`                       | Good pattern — keep this                                                                                                              | ✅ Good    |

### 2.4 JavaScript

| Issue                                                                                      | Details                                                                                                              | Priority   |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ---------- |
| **AdSense script loaded in `<head>` before `<meta charset>`** on blog.html                 | Charset must be first; AdSense should ideally load after page content or be deferred                                 | **Medium** |
| 15 JS files in `/js/` — none bundled or minified                                           | Same issue as CSS; multiple round trips                                                                              | **Medium** |
| **GTM + AdSense both load in `<head>`** on every page                                      | Two third-party analytics/ad scripts blocking render; GTM should be as early as possible but AdSense can be deferred | **Medium** |
| `onmouseover`/`onmouseout` inline JS on lesson promo cards and "Continue Learning" section | Inline event handlers bloat HTML; should be moved to stylesheet transitions and external JS                          | **Low**    |

### 2.5 Font Loading

| Issue                                                                                         | Details                                                                                                            | Priority |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------- |
| **Font Awesome 6.4.0 loaded at full weight (~402KB CSS + fonts) on ~150 pages** via cdnjs CDN | Only a fraction of icons are used; consider subsetting or using SVG icons for frequently-used icons                | **High** |
| Google Fonts (`Inter + Poppins`) loaded with `display=swap`                                   | Font-display: swap is correct — prevents FOIT                                                                      | ✅ Good  |
| Google Fonts link not preloaded (only `preconnect`)                                           | Adding `<link rel="preload" as="style" href="...fonts.googleapis.com...">` before the stylesheet link reduces FOUT | **Low**  |

### 2.6 Caching

`.htaccess` has well-configured cache headers:

- Images: 1 year ✅
- CSS/JS: 1 month ✅
- HTML: 1 day ✅
- GZIP compression enabled ✅
- HSTS configured ✅

**No issues in caching configuration.**

### 2.7 Core Web Vitals Prediction

Based on code inspection and live-site check:

| Metric                        | Expected Issue        | Cause                                                                                                                            |
| ----------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **LCP**                       | Likely poor on mobile | Missing viewport meta on homepage; large PNG logo; hero WebP preloaded only for desktop ≥769px                                   |
| **TBT (Total Blocking Time)** | Moderate              | Font Awesome + GTM + AdSense all in `<head>` block main thread before first render                                               |
| **CLS**                       | Potentially affected  | Images without explicit `width`/`height` attributes cause layout shift on load; many `<img>` tags examined lack `width`/`height` |

---

## 3. Accessibility

### 3.1 Color Contrast

| Issue                                                                                                   | Details                                                                                                                                                                                                                     | Priority   |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **`#46bbe5` (primary theme color) on white `#ffffff`** has a contrast ratio of approximately **2.29:1** | WCAG AA requires 4.5:1 for normal text, 3:1 for large text. The theme color is used for nav link hover states, CTA buttons, and the mobile toggle button background (white icon on #46bbe5 background, same issue reversed) | **High**   |
| White text on `#46bbe5` hero button                                                                     | Same contrast issue in reverse                                                                                                                                                                                              | **High**   |
| Light grey stat labels on white background                                                              | Need to verify exact hex, but typical `var(--text-secondary)` patterns can fail contrast on light backgrounds                                                                                                               | **Medium** |

### 3.2 Alt Text

The following file categories contain `<img>` elements **without `alt` attributes**:

- `tools/keywords.html`, `tools/jobs.html`, `tools/maths-test.html`, `tools/decision-matrix.html`, `tools/typing-test.html`, `tools/case-study.html`, `tools/lessonplan.html`, `tools/presentation-timer.html`, `tools/swot-analysis.html`, `tools/tools.html`
- All `business/` pages (email-templates, negotiation, presentation-coach, cultural-guide, conversation-practice, writing-assistant, meeting-phrases, vocabulary, interview, networking-phrases, reports)
- `index.html` (3 img elements), `contact.html`, `header-template.html`
- `vocab/vbeginner.html`, `register.html`
- `music/fundamentals.html`, `music/bass.html`, `music/guitar.html`

**Estimated ~50+ images with missing alt text** across these pages.  
**Why it matters:** Screen readers skip over images without alt text, breaking content flow for visually impaired users; also impacts image SEO.  
**Fix:** Add descriptive `alt` text; use `alt=""` for purely decorative images.  
**Priority:** High

### 3.3 Keyboard Navigation & ARIA

| Location                                        | Issue                                                                                               | Suggested Fix                                                                                                                                                   | Priority   |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `index.html` — "Featured Tools" section         | **Three `<div class="tool-card" onclick="...">` elements** are not keyboard-navigable               | Replace `<div onclick>` with `<a href="...">` elements styled as cards                                                                                          | **High**   |
| `index.html` — "Continue Learning" section      | **Six `<a>` elements use `onmouseover`/`onmouseout` for hover effects** instead of CSS              | Move hover effects to CSS; inline JS on links can interfere with screen readers and keyboard navigation                                                         | **Medium** |
| `index.html` — "English Mastery Challenge" quiz | **No `aria-live` region** for quiz answer feedback (`#resultMessage`)                               | Add `aria-live="polite"` or `aria-live="assertive"` to `#resultMessage` so screen readers announce correct/incorrect feedback                                   | **High**   |
| `index.html`, most pages                        | **Nav dropdown buttons use `aria-expanded="false"` but this is never toggled in CSS-only dropdown** | Confirm JS toggles `aria-expanded` on click; if not, add it — screen readers rely on this to announce dropdown state                                            | **Medium** |
| `blog/blog.html` sidebar                        | **All tag and category links use `href="#"`**                                                       | These should either link to real filtered views or be removed; `href="#"` scroll-to-top behavior is unexpected                                                  | **Medium** |
| `index.html` — Quick Action buttons             | `<button onclick="window.location.href='...'>` used for navigation                                  | Navigation should use `<a>` tags; buttons with `onclick` for navigation are accessible but miss right-click/middle-click open-in-tab behavior expected by users | **Low**    |
| Contact form (`contact.html`)                   | Needs verification of `<label for>` associations on all inputs                                      | Review that every form field has an explicit `<label>` element (not just placeholder text)                                                                      | **Medium** |

### 3.4 Focus States

| Issue                                                                                                                                                 | Details                                                                                        | Priority   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------- |
| Cannot fully verify from static code, but `.mobile-toggle` and `.control-btn` buttons styled purely via background color may lack visible focus rings | Check that `:focus-visible` styles exist for all interactive elements with sufficient contrast | **Medium** |

---

## 4. Code Quality & Structure

### 4.1 CSS Architecture

| Issue                                                                                                                                                         | Details                                                                                                                                                                        | Priority   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| **90 CSS files** — one CSS file per page/component with no shared bundling                                                                                    | `adjectives-adverbs-page.css`, `articles-page.css`, etc. — each english/ page has its own CSS; `main.css`, `header.css` are shared but page-specific CSS is never consolidated | **High**   |
| **Page-specific CSS loaded via `<link>` is identical or near-identical across sections**                                                                      | e.g., all grammar pages likely share the same `.hero`, `.section`, `.card` patterns duplicated in individual CSS files                                                         | **Medium** |
| `business/presentation-coach.html` and `business/writing-assistant.html` have H1 with `style="font-size: 3rem; font-weight: 700; margin-bottom: 1rem"` inline | Move to page CSS                                                                                                                                                               | **Low**    |

### 4.2 Broken & Stale Links

| Location                                                   | Issue                                                                                                                 | Priority                                |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `blog/blog.html` lines 2913, 3156                          | **Two blog cards with `href="#"`** — no target page exists                                                            | **High**                                |
| `blog/blog.html` — sidebar tags/categories                 | **All `href="#"`** — non-functional filter links                                                                      | **Medium**                              |
| `index.html` — 4 blog cards                                | **"Placeholder" date text** — cosmetic but visible on live site                                                       | **High**                                |
| Various pages                                              | `tools/flashcards-chinese-old.html` and `tools/flashcards-japanese-old.html` are publicly accessible old backup files | **Medium** — add to robots.txt Disallow |
| `tools/lessonplan-old-backup.html`                         | Old backup publicly accessible                                                                                        | **Medium**                              |
| `english/onet-placeholder.html`                            | Stub/placeholder publicly accessible                                                                                  | **Low**                                 |
| `coding/ai/ai-tools.html`, `coding/ai/beginner-guide.html` | "Coming Soon" H1 visible in DOM alongside main H1                                                                     | **Medium**                              |

### 4.3 Console Errors / Broken Links (from live-site crawl)

The live `blog/blog.html` page redirected to `https://googleads.g.doubleclick.net/pagead/drt/si?ST=NO_DATA` during automated crawl — the AdSense initialisation script appears to trigger a redirect in headless/automated browser contexts. This is likely not user-facing but could impact SEO bot crawling of the blog index.

### 4.4 Inline Style Overuse

| Page                               | Inline `style=` count | Notable Patterns                                                                                                                        |
| ---------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                       | **68**                | Hero stats grid, lesson promo section, tool cards, continue-learning cards — all use full inline `style=` blocks instead of CSS classes |
| `blog/blog.html`                   | **47**                | Similar pattern                                                                                                                         |
| `business/presentation-coach.html` | Estimated high        | Has H1 with inline font-size/weight                                                                                                     |
| `business/writing-assistant.html`  | Estimated high        | Same pattern                                                                                                                            |

This makes responsive design, dark mode, and theme changes significantly harder to maintain.

### 4.5 Mobile Responsiveness

| Issue                                                                                                                                       | Details                                                                     | Priority     |
| ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------ |
| **`index.html` missing viewport meta** (repeated from SEO — the single highest-impact issue)                                                | Mobile viewport is not configured                                           | **Critical** |
| Lesson promotion card uses full inline styles including `display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))` inline | Works but cannot be overridden by media queries without specificity battles | **Low**      |
| "Continue Learning" 6-card grid uses inline `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`                                   | Generally responsive but not overridable                                    | **Low**      |

### 4.6 Consistency Issues

| Issue                                                                                                                                                                          | Details                                                                                            | Priority   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ---------- |
| **Footer "Business" link points to `business/vocabulary.html`** in the "Continue Learning" section, but main nav links to `english/business.html`                              | Inconsistent destination — users expect "Business English" to go to the main business English page | **Medium** |
| `nav` on `index.html` links `english/business.html`; homepage journey card also links `english/business.html`; but the continue-learning card links `business/vocabulary.html` | Three-way inconsistency for the "Business" destination                                             | **Medium** |
| Logo uses `images/1.png` (PNG) — no descriptive filename, making alt text the only signal                                                                                      | Rename to `esl-fun-online-logo.webp` and convert to WebP                                           | **Low**    |

---

## Quick Wins Checklist

Low effort, high impact items that can be addressed in under 30 minutes each:

- [ ] **Add `<meta name="viewport" content="width=device-width, initial-scale=1.0">` to `index.html`** — single line, fixes all mobile rendering for the homepage
- [ ] **Replace 4 "Placeholder" date strings** in `index.html` blog cards with real dates (e.g. "Aug 2026")
- [ ] **Move `<meta charset="UTF-8">` to the first position** in `<head>` on all pages where AdSense script precedes it (notably `blog/blog.html`)
- [ ] **Remove `aggregateRating` block** from `index.html` structured data (or from all pages if it propagates) — eliminates schema penalty risk with zero design change
- [ ] **Remove `<meta name="keywords">` from all pages** — 5-second search-and-replace, zero user impact
- [ ] **Add `alt=""` to decorative logo images** and descriptive alt text to all missing-alt `<img>` elements
- [ ] **Add `aria-live="polite"` to `#resultMessage`** in the "English Mastery Challenge" quiz on index.html
- [ ] **Add `Disallow: /*-old*` and `Disallow: /english/onet-placeholder*`** to `robots.txt`
- [ ] **Add canonical tags to all coding/lessons/\*, coding/projects/\*, coding/tutorials/\* pages** — copy the pattern from pages that already have it
- [ ] **Add meta descriptions** to the 7 pages that are missing them (listed in §1.2)
- [ ] **Fix `href="#"` on the 2 unpublished blog cards** in `blog/blog.html` — either link to real pages or remove the cards
- [ ] **Unify "Business English" footer link** — change `business/vocabulary.html` in the continue-learning section to `english/business.html` to match nav consistency
- [ ] **Convert `images/1.png` to WebP** and update all references — single conversion, improves every page load since it's the logo on all pages
- [ ] **Add `loading="lazy"` to all below-the-fold `<img>` tags** — the homepage has at least 3 non-lazy images; a global pass is needed

---

_End of audit. Total public HTML pages audited: ~180 (excluding dash/, students/, .dev-files/). Live site confirmed at https://eslfunonline.com._
