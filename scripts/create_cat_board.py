#!/usr/bin/env python3
"""Create student-cat.html based on student-noonim.html"""

from pathlib import Path

src = Path("/Users/dillchalisas/ESLonline/dash/student-noonim.html")
dst = Path("/Users/dillchalisas/ESLonline/dash/business/student-cat.html")

content = src.read_text(encoding="utf-8")

# 1. Title
content = content.replace(
    "<title>Noonim - Student Dashboard</title>",
    "<title>Cat - Student Dashboard</title>"
)

# 2. H1 heading
content = content.replace(
    "<h1>👥 Noomnim</h1>",
    "<h1>👥 Cat</h1>"
)

# 3. Back link (Cat is one level deeper in dash/business/)
content = content.replace(
    'href="dashboard.html" class="back-link"',
    'href="../dashboard.html" class="back-link"'
)

# 4. Remove 'business/' prefix from all paths (already in the business folder)
content = content.replace('href="business/', 'href="')
content = content.replace("src=\"business/", "src=\"")

# 5. Progress teaching notes - replace the progress summary block
content = content.replace(
    '''          <div
            style="
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            "
          >
            <h4 style="margin: 0 0 8px 0; font-size: 1.1em">
              ✅ Progress Summary
            </h4>
            <p style="margin: 0; font-size: 0.95em">
              <strong>20 hours completed</strong> (50% of course) — Units 1–7
              done, currently on <strong>Unit 8</strong>
            </p>
          </div>''',
    '''          <div
            style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            "
          >
            <h4 style="margin: 0 0 8px 0; font-size: 1.1em">
              🚀 Progress Summary
            </h4>
            <p style="margin: 0; font-size: 0.95em">
              <strong>0 hours completed</strong> — Ready to start
              <strong>Unit 1: Jobs & Introductions</strong>
            </p>
          </div>'''
)

# 6. Remaining hours breakdown header
content = content.replace(
    '''            <h4 style="color: #f59e0b; margin: 0 0 12px 0">
              📅 Remaining 20 Hours – Teaching Plan
            </h4>
            <p style="color: #666; font-size: 0.9em; margin-bottom: 12px">
              <strong>Schedule:</strong> Tuesday &amp; Friday, 2 hours each =
              <strong>4 hours/week</strong><br />
              <strong>Estimated completion:</strong> 5 more weeks (20 hours ÷ 4
              hours/week)
            </p>''',
    '''            <h4 style="color: #f59e0b; margin: 0 0 12px 0">
              📅 Full 40 Hours – Teaching Plan
            </h4>
            <p style="color: #666; font-size: 0.9em; margin-bottom: 12px">
              <strong>Schedule:</strong> TBD<br />
              <strong>Estimated completion:</strong> 10 weeks (40 hours ÷ 4
              hours/week)
            </p>'''
)

# 7. Teacher notes
content = content.replace(
    '''            <ul
              style="
                margin: 0;
                padding-left: 20px;
                color: #555;
                line-height: 1.8;
                font-size: 0.9em;
              "
            >
              <li>
                <strong>Currently on Unit 8</strong> – focus on present perfect
                for experience (I have worked...)
              </li>
              <li>
                Student is progressing well – completed Units 1–7 in 20 hours
                (on schedule)
              </li>
              <li>
                At current pace, book completion expected in
                <strong>5 weeks</strong>
              </li>
              <li>
                Create final review quiz after Unit 12 for course completion
              </li>
              <li>
                Consider adding speaking practice topics for job interviews
                (Unit 8–9)
              </li>
            </ul>''',
    '''            <ul
              style="
                margin: 0;
                padding-left: 20px;
                color: #555;
                line-height: 1.8;
                font-size: 0.9em;
              "
            >
              <li>
                <strong>Starting Unit 1</strong> – same book as Noonim:
                Oxford Business Result (2nd Ed) Elementary
              </li>
              <li>
                Begin with countries, nationalities, jobs and introductions
              </li>
              <li>
                Set lesson schedule and confirm times with student
              </li>
              <li>
                Target: complete 40 hours over 10 weeks (4 hours/week)
              </li>
              <li>
                Use same resources as Noonim — Student Book, Teacher's Book,
                and audio files are all in this folder
              </li>
            </ul>'''
)

dst.write_text(content, encoding="utf-8")
print(f"Created: {dst}")
print(f"Lines: {content.count(chr(10))}")
