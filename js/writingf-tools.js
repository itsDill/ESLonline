// ===== WRITING TOOLS & INTERACTIVE UTILITIES =====

// ===== THESIS STATEMENT BUILDER =====
function initThesisBuilder() {
  const form = document.getElementById("thesisForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    generateThesis();
  });
}

function generateThesis() {
  const topic = document.getElementById("thesisTopic")?.value || "";
  const position = document.getElementById("thesisPosition")?.value || "";
  const reasons =
    document
      .getElementById("thesisReasons")
      ?.value.split("\n")
      .filter((r) => r.trim()) || [];

  if (!topic || !position || reasons.length === 0) {
    alert("Please fill in all fields");
    return;
  }

  const reasonList = reasons
    .map((r, i) => `${String.fromCharCode(97 + i)}) ${r.trim()}`)
    .join(", ");
  const thesis = `${position} regarding ${topic} because ${reasonList}.`;

  const output = document.getElementById("thesisOutput");
  if (output) {
    output.innerHTML = `
      <div class="generated-output">
        <div class="output-label">Generated Thesis Statement:</div>
        <div class="output-text">"${thesis}"</div>
        <div class="output-tips">
          <strong>Tips:</strong>
          <ul>
            <li>Make sure your thesis is specific and debatable</li>
            <li>It should preview your main arguments</li>
            <li>Revise for clarity and conciseness</li>
          </ul>
        </div>
        <button class="btn-copy" onclick="copyToClipboard('${thesis.replace(/"/g, "&quot;")}')">
          <i class="fas fa-copy"></i> Copy
        </button>
      </div>
    `;
  }
}

// ===== WRITING STYLE ANALYZER =====
function initStyleAnalyzer() {
  const form = document.getElementById("styleAnalyzerForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    analyzeStyle();
  });
}

function analyzeStyle() {
  const text = document.getElementById("analyzerText")?.value || "";
  if (!text.trim()) {
    alert("Please enter some text to analyze");
    return;
  }

  const sentences = text.match(/[.!?]+/g) || [];
  const words = text.match(/\b\w+\b/g) || [];
  const avgWordPerSentence =
    sentences.length > 0 ? (words.length / sentences.length).toFixed(1) : 0;

  // Count passive voice (rough estimate)
  const passiveRegex = /\b(was|were|is|are|be|been|being)\s+\w+(?:ed|en)\b/gi;
  const passiveCount = (text.match(passiveRegex) || []).length;
  const passivePercentage =
    sentences.length > 0
      ? ((passiveCount / sentences.length) * 100).toFixed(1)
      : 0;

  // Readability score (Flesch Kincaid approximation)
  const syllableEstimate = words.filter((w) => w.length > 3).length;
  const readabilityScore = Math.max(
    0,
    Math.min(100, 100 - (syllableEstimate / words.length) * 50),
  );

  const output = document.getElementById("analyzerOutput");
  if (output) {
    output.innerHTML = `
      <div class="analysis-results">
        <div class="analysis-row">
          <span class="analysis-label">Total Words:</span>
          <span class="analysis-value">${words.length}</span>
        </div>
        <div class="analysis-row">
          <span class="analysis-label">Total Sentences:</span>
          <span class="analysis-value">${sentences.length}</span>
        </div>
        <div class="analysis-row">
          <span class="analysis-label">Avg Words/Sentence:</span>
          <span class="analysis-value">${avgWordPerSentence}</span>
          <span class="analysis-note">(Goal: 15-20 words)</span>
        </div>
        <div class="analysis-row">
          <span class="analysis-label">Passive Voice Usage:</span>
          <span class="analysis-value">${passivePercentage}%</span>
          <span class="analysis-note">(Try to stay under 15%)</span>
        </div>
        <div class="analysis-row">
          <span class="analysis-label">Readability Score:</span>
          <span class="analysis-value ${readabilityScore > 65 ? "good" : readabilityScore > 40 ? "fair" : "poor"}">${readabilityScore.toFixed(0)}/100</span>
        </div>
        <div class="analysis-recommendation">
          <strong>Recommendation:</strong>
          ${avgWordPerSentence > 25 ? "• Consider breaking long sentences<br/>" : ""}
          ${passivePercentage > 15 ? "• Try converting passive to active voice<br/>" : ""}
          ${readabilityScore < 40 ? "• Simplify vocabulary and sentence structure" : "Great balance of clear and engaging writing!"}
        </div>
      </div>
    `;
  }
}

// ===== ESSAY TEMPLATE GENERATOR =====
function initTemplateGenerator() {
  const form = document.getElementById("templateForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    generateTemplate();
  });
}

function generateTemplate() {
  const essayType = document.getElementById("essayType")?.value || "";
  const topic = document.getElementById("templateTopic")?.value || "";
  const thesis = document.getElementById("templateThesis")?.value || "";
  const points =
    document
      .getElementById("templatePoints")
      ?.value.split("\n")
      .filter((p) => p.trim()) || [];

  if (!essayType || !topic || !thesis || points.length === 0) {
    alert("Please fill in all fields");
    return;
  }

  const templates = {
    argumentative: `
I. Introduction
   A. Hook/Opening statement
   B. Background on ${topic}
   C. Thesis: ${thesis}

II. Body Paragraph 1 - ${points[0] || "First Argument"}
    A. Topic sentence
    B. Evidence/Example
    C. Analysis
    D. Transition

III. Body Paragraph 2 - ${points[1] || "Second Argument"}
     A. Topic sentence
     B. Evidence/Example
     C. Analysis
     D. Address counterarguments

IV. Body Paragraph 3 - ${points[2] || "Third Argument"}
    A. Topic sentence
    B. Evidence/Example
    C. Analysis

V. Conclusion
   A. Restate thesis in new way
   B. Summarize main points
   C. Call to action or final thought
    `,
    analytical: `
I. Introduction
   A. Hook about ${topic}
   B. Context/Background
   C. Thesis: ${thesis}

II. Analysis of ${points[0] || "First Element"}
    A. Description/Overview
    B. Key characteristics
    C. Significance

III. Analysis of ${points[1] || "Second Element"}
     A. Description/Overview
     B. Key characteristics
     C. Connection to thesis

IV. Synthesis and Deeper Analysis
    A. Relationships between elements
    B. Patterns and implications
    C. Broader significance

V. Conclusion
   A. Restate thesis with new insight
   B. Implications
   C. Final reflection
    `,
    narrative: `
I. Introduction
   A. Hook with vivid detail
   B. Setting (time, place)
   C. Preview of main event/conflict: ${thesis}

II. Background/Rising Action
    A. Introduce characters
    B. Establish context for ${points[0] || "first event"}
    C. Build tension

III. Key Event/Climax - ${points[1] || "Main turning point"}
     A. What happened
     B. Sensory details
     C. Emotional impact

IV. Resolution and Reflection
    A. How situation resolved
    B. Lesson learned
    C. Personal growth/insight

V. Conclusion
   A. Final reflection on experience
   B. How it changed you
   C. Broader significance
    `,
  };

  const template = templates[essayType] || templates.argumentative;
  const output = document.getElementById("templateOutput");
  if (output) {
    output.innerHTML = `
      <div class="template-outline">
        <div class="template-label">Essay Outline Template:</div>
        <pre class="template-text">${template}</pre>
        <button class="btn-copy" onclick="copyToClipboard(${JSON.stringify(template).replace(/"/g, "&quot;")})">
          <i class="fas fa-copy"></i> Copy Template
        </button>
      </div>
    `;
  }
}

// ===== UTILITY FUNCTIONS =====
function copyToClipboard(text) {
  // Remove HTML entities for copying
  const decoded = text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  navigator.clipboard.writeText(decoded).then(() => {
    alert("Copied to clipboard!");
  });
}

function downloadPDF(filename, content) {
  // Simple text to PDF download (basic implementation)
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(content),
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function downloadEditingChecklist() {
  const checklist = `WRITING EDITING CHECKLIST
===========================

CONTENT & ORGANIZATION
☐ Clear thesis statement that presents main argument
☐ Introduction hooks reader and provides context
☐ Logical paragraph order that builds argument
☐ Each paragraph has topic sentence
☐ Supporting evidence for each claim
☐ Smooth transitions between paragraphs
☐ Strong conclusion that doesn't just repeat thesis
☐ All sources properly cited

STYLE & CLARITY
☐ Varied sentence structure throughout
☐ Active voice used (avoid passive when possible)
☐ Clear, concise language (no unnecessary words)
☐ Tone is appropriate for audience
☐ Vocabulary matches intended audience level
☐ Consistent verb tense
☐ No awkward phrasing

GRAMMAR & MECHANICS
☐ Correct spelling (run spell-check twice)
☐ Proper punctuation
☐ Subject-verb agreement throughout
☐ Pronoun-antecedent agreement
☐ No sentence fragments
☐ No run-on sentences
☐ Proper comma usage
☐ Consistent formatting

FINAL REVIEW
☐ Read aloud to catch errors
☐ Proofread one more time
☐ Check page formatting
☐ Verify all required elements included
☐ Ready to submit!
  `;
  downloadPDF("editing-checklist.txt", checklist);
}

function downloadOutlineTemplate() {
  const template = `ESSAY OUTLINE TEMPLATE
======================

I. INTRODUCTION
   A. Hook/Opening statement
   B. Background information
   C. THESIS STATEMENT

II. BODY PARAGRAPH 1
    A. Topic Sentence
    B. Supporting Point 1
       1. Evidence/Example
       2. Explanation
    C. Supporting Point 2
       1. Evidence/Example
       2. Explanation
    D. Transition to next paragraph

III. BODY PARAGRAPH 2
     A. Topic Sentence
     B. Supporting Point 1
        1. Evidence/Example
        2. Explanation
     C. Supporting Point 2
        1. Evidence/Example
        2. Explanation
     D. Transition to next paragraph

IV. BODY PARAGRAPH 3 (Optional)
    A. Topic Sentence
    B. Supporting Point 1
       1. Evidence/Example
       2. Explanation
    C. Counterargument (if applicable)
    D. Transition to conclusion

V. CONCLUSION
   A. Restate thesis (in new words)
   B. Synthesize main points
   C. Broader implications
   D. Call to action or final thought

INSTRUCTIONS:
- Fill in each section with your own ideas
- Delete optional sections as needed
- Convert outline to full paragraphs
- Ensure smooth transitions between ideas
  `;
  downloadPDF("essay-outline-template.txt", template);
}

function downloadTransitions() {
  const transitions = `WRITING TRANSITIONS REFERENCE
============================

ADDING INFORMATION
- Additionally, ... | Moreover, ... | Furthermore, ... | In addition, ...
- Also, ... | Another ... | Likewise, ... | Similarly, ...

SHOWING CONTRAST
- However, ... | Nevertheless, ... | On the other hand, ...
- In contrast, ... | Conversely, ... | While ... | Although ...
- Yet, ... | Instead, ... | Rather, ...

SHOWING CAUSE & EFFECT
- Because, ... | As a result, ... | Therefore, ... | Consequently, ...
- For this reason, ... | Thus, ... | Since, ... | As, ...
- This causes, ... | Leading to, ... | Results in, ...

SHOWING TIME/SEQUENCE
- First, ... | Second, ... | Third, ... | Next, ... | Then, ...
- Before, ... | After, ... | Meanwhile, ... | Subsequently, ...
- Finally, ... | In conclusion, ... | Last, ...

SHOWING EMPHASIS
- In fact, ... | Indeed, ... | Certainly, ... | Obviously, ...
- Most importantly, ... | Notably, ... | Significantly, ...
- Undoubtedly, ... | Clearly, ...

GIVING EXAMPLES
- For example, ... | For instance, ... | Such as, ...
- To illustrate, ... | In particular, ... | Specifically, ...
- Like, ... | Case in point, ...

CONCLUDING/SUMMARIZING
- In conclusion, ... | To summarize, ... | In short, ...
- Ultimately, ... | In essence, ... | To reiterate, ...
- The bottom line, ... | All in all, ...

TIP: Use transitions to improve flow and help readers follow your logic!
  `;
  downloadPDF("writing-transitions.txt", transitions);
}

// Initialize all tools on page load
document.addEventListener("DOMContentLoaded", () => {
  initThesisBuilder();
  initStyleAnalyzer();
  initTemplateGenerator();
});
