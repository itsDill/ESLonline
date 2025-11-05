import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the learning paths section
start_marker = '<!-- Learning Paths Grid -->'
end_marker = '<!-- FAQ Schema Markup -->'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find learning paths section")
    exit(1)

# Extract before and after
before = content[:start_idx]
after = content[end_idx:]

# Create new simplified learning paths section
new_section = '''<!-- Learning Paths Grid -->
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
            gap: 3rem;
            margin: 3rem auto;
            max-width: 1400px;
          "
        >
          <!-- Beginner Path -->
          <div
            style="
              background: white;
              border-radius: 20px;
              padding: 2.5rem;
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
              border-left: 6px solid #10b981;
              transition: all 0.3s ease;
            "
            onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 40px rgba(16, 185, 129, 0.2)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 30px rgba(0, 0, 0, 0.1)'"
          >
            <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem">
              <div
                style="
                  width: 70px;
                  height: 70px;
                  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                "
              >
                <i class="fas fa-seedling" style="font-size: 2rem; color: white"></i>
              </div>
              <div>
                <h3 style="font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem 0">
                  Beginner English
                </h3>
                <span
                  style="
                    display: inline-block;
                    background: #d1fae5;
                    color: #065f46;
                    padding: 0.4rem 1rem;
                    border-radius: 25px;
                    font-size: 0.9rem;
                    font-weight: 600;
                  "
                  >A1-A2 Level</span
                >
              </div>
            </div>
            <p style="color: #64748b; line-height: 1.8; font-size: 1.05rem; margin-bottom: 2rem">
              Start your English journey with essential grammar, 500+ vocabulary words, and basic conversation skills for everyday situations.
            </p>
            <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0">
              <li style="padding: 0.9rem 0; border-bottom: 1px solid #e5e7eb">
                <i class="fas fa-check-circle" style="color: #10b981; margin-right: 0.75rem; font-size: 1.1rem"></i>
                <strong style="color: #1e293b">Essential Vocabulary</strong>
              </li>
              <li style="padding: 0.9rem 0; border-bottom: 1px solid #e5e7eb">
                <i class="fas fa-check-circle" style="color: #10b981; margin-right: 0.75rem; font-size: 1.1rem"></i>
                <strong style="color: #1e293b">Basic Grammar Rules</strong>
              </li>
              <li style="padding: 0.9rem 0; border-bottom: 1px solid #e5e7eb">
                <i class="fas fa-check-circle" style="color: #10b981; margin-right: 0.75rem; font-size: 1.1rem"></i>
                <strong style="color: #1e293b">Simple Conversations</strong>
              </li>
              <li style="padding: 0.9rem 0">
                <i class="fas fa-clock" style="color: #f59e0b; margin-right: 0.75rem; font-size: 1.1rem"></i>
                <strong style="color: #64748b">3-6 months</strong>
              </li>
            </ul>
            <a
              href="english/grammar.html"
              style="
                display: inline-flex;
                align-items: center;
                gap: 0.75rem;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 1rem 2rem;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1.05rem;
                transition: all 0.3s;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
              "
              onmouseover="this.style.transform='scale(1.05)'"
              onmouseout="this.style.transform='scale(1)'"
            >
              Start Learning <i class="fas fa-arrow-right"></i>
            </a>
          </div>

          <!-- Intermediate Path -->
          <div
            style="
              background: white;
              border-radius: 20px;
              padding: 2.5rem;
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
              border-left: 6px solid #3b82f6;
              transition: all 0.3s ease;
            "
            onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 40px rgba(59, 130, 246, 0.2)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 30px rgba(0, 0, 0, 0.1)'"
          >
            <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem">
              <div
                style="
                  width: 70px;
                  height: 70px;
                  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                "
              >
                <i class="fas fa-rocket" style="font-size: 2rem; color: white"></i>
              </div>
              <div>
                <h3 style="font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem 0">
                  Intermediate English
                </h3>
                <span
                  style="
                    display: inline-block;
                    background: #dbeafe;
                    color: #1e40af;
                    padding: 0.4rem 1rem;
                    border-radius: 25px;
                    font-size: 0.9rem;
                    font-weight: 600;
                  "
                  >B1-B2 Level</span
                >
              </div>
            </div>
            <p style="color: #64748b; line-height: 1.8; font-size: 1.05rem; margin-bottom: 2rem">
              Take your English to the next level. Master complex grammar, expand your vocabulary with 2,000+ words, and communicate fluently in professional and social settings.
            </p>
            <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0">
              <li style="padding: 0.9rem 0; border-bottom: 1px solid #e5e7eb">
                <i class="fas fa-check-circle" style="color: #3b82f6; margin-right: 0.75rem; font-size: 1.1rem"></i>
                <strong style="color: #1e293b">Phrasal Verbs & Idioms</strong>
              </li>
              <li style="padding: 0.9rem 0; border-bottom: 1px solid #e5e7eb">
                <i class="fas fa-check-circle" style="color: #3b82f6; margin-right: 0.75rem; font-size: 1.1rem"></i>
                <strong style="color: #1e293b">All Tenses & Conditionals</strong>
              </li>
              <li style="padding: 0.9rem 0; border-bottom: 1px solid #e5e7eb">
                <i class="fas fa-check-circle" style="color: #3b82f6; margin-right: 0.75rem; font-size: 1.1rem"></i>
                <strong style="color: #1e293b">Fluent Conversations</strong>
              </li>
              <li style="padding: 0.9rem 0">
                <i class="fas fa-clock" style="color: #f59e0b; margin-right: 0.75rem; font-size: 1.1rem"></i>
                <strong style="color: #64748b">6-12 months</strong>
              </li>
            </ul>
            <a
              href="english/phrasal-verbs.html"
              style="
                display: inline-flex;
                align-items: center;
                gap: 0.75rem;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                padding: 1rem 2rem;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1.05rem;
                transition: all 0.3s;
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
              "
              onmouseover="this.style.transform='scale(1.05)'"
              onmouseout="this.style.transform='scale(1)'"
            >
              Continue Learning <i class="fas fa-arrow-right"></i>
            </a>
          </div>

          <!-- Business English -->
          <div
            style="
              background: white;
              border-radius: 20px;
              padding: 2.5rem;
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
              border-left: 6px solid #f59e0b;
              transition: all 0.3s ease;
            "
            onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 40px rgba(245, 158, 11, 0.2)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 30px rgba(0, 0, 0, 0.1)'"
          >
            <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem">
              <div
                style="
                  width: 70px;
                  height: 70px;
                  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
                "
              >
                <i class="fas fa-briefcase" style="font-size: 2rem; color: white"></i>
              </div>
              <div>
                <h3 style="font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem 0">
                  Business English
                </h3>
                <span
                  style="
                    display: inline-block;
                    background: #fef3c7;
                    color: #92400e;
                    padding: 0.4rem 1rem;
                    border-radius: 25px;
                    font-size: 0.9rem;
                    font-weight: 600;
                  "
                  >Professional</span
                >
              </div>
            </div>
            <p style="color: #64748b; line-height: 1.8; font-size: 1.05rem; margin-bottom: 2rem">
              Excel in your career with professional English. Master business communication, presentations, emails, meetings, and industry-specific vocabulary.
            </p>
            <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0">
              <li style="padding: 0.9rem 0; border-bottom: 1px solid #e5e7eb">
                <i class="fas fa-check-circle" style="color: #f59e0b; margin-right: 0.75rem; font-size: 1.1rem"></i>
                <strong style="color: #1e293b">Business Communication</strong>
              </li>
              <li style="padding: 0.9rem 0; border-bottom: 1px solid #e5e7eb">
                <i class="fas fa-check-circle" style="color: #f59e0b; margin-right: 0.75rem; font-size: 1.1rem"></i>
                <strong style="color: #1e293b">Presentations & Meetings</strong>
              </li>
              <li style="padding: 0.9rem 0; border-bottom: 1px solid #e5e7eb">
                <i class="fas fa-check-circle" style="color: #f59e0b; margin-right: 0.75rem; font-size: 1.1rem"></i>
                <strong style="color: #1e293b">Professional Writing</strong>
              </li>
              <li style="padding: 0.9rem 0">
                <i class="fas fa-clock" style="color: #f59e0b; margin-right: 0.75rem; font-size: 1.1rem"></i>
                <strong style="color: #64748b">3-6 months</strong>
              </li>
            </ul>
            <a
              href="english/business.html"
              style="
                display: inline-flex;
                align-items: center;
                gap: 0.75rem;
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
                padding: 1rem 2rem;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1.05rem;
                transition: all 0.3s;
                box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
              "
              onmouseover="this.style.transform='scale(1.05)'"
              onmouseout="this.style.transform='scale(1)'"
            >
              Advance Career <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    '''

# Combine
new_content = before + new_section + after

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Learning paths simplified to 3!")
print("   • Beginner (A1-A2) → english/grammar.html")
print("   • Intermediate (B1-B2) → english/phrasal-verbs.html") 
print("   • Business English → english/business.html")
