#!/usr/bin/env python3
"""
Comprehensive broken link fixer for ESL Fun Online website
This script identifies and fixes the most common broken internal links
"""

import os
import re
import shutil
from pathlib import Path

def backup_file(filepath):
    """Create a backup of the file before modifying"""
    backup_path = f"{filepath}.backup"
    shutil.copy2(filepath, backup_path)
    return backup_path

def fix_navigation_links(content, current_file_path):
    """Fix common navigation link issues"""
    
    # Get the depth level (how many folders deep we are)
    depth = len(Path(current_file_path).parts) - 1
    prefix = "../" * depth if depth > 0 else ""
    
    # Common fixes for navigation
    fixes = [
        # Fix empty href attributes
        (r'href=""', f'href="{prefix}index.html"'),
        
        # Fix incorrect index.html references
        (r'href="index\.html"', f'href="{prefix}index.html"'),
        
        # Fix missing page references with proper relative paths
        (r'href="register\.html"', f'href="{prefix}register.html"'),
        (r'href="contact\.html"', f'href="{prefix}contact.html"'),
        
        # Fix tools directory references
        (r'href="([^"]*)/index\.html"', lambda m: f'href="{prefix}{m.group(1)}.html"' if m.group(1) in ['tools', 'games', 'english', 'coding', 'blog'] else m.group(0)),
    ]
    
    for pattern, replacement in fixes:
        if callable(replacement):
            content = re.sub(pattern, replacement, content)
        else:
            content = re.sub(pattern, replacement, content)
    
    return content

def fix_relative_paths(content, current_file_path):
    """Fix relative path issues based on file location"""
    
    current_dir = os.path.dirname(current_file_path)
    depth = len(Path(current_file_path).parts) - 1
    
    if depth > 0:  # Not in root directory
        # Fix CSS and JS paths
        content = re.sub(r'href="css/', f'href="{"../" * depth}css/', content)
        content = re.sub(r'href="js/', f'href="{"../" * depth}js/', content)
        content = re.sub(r'src="js/', f'src="{"../" * depth}js/', content)
        content = re.sub(r'src="images/', f'src="{"../" * depth}images/', content)
        
        # Fix navigation menu links to main sections
        main_sections = ['english/', 'coding/', 'games/', 'tools/', 'blog/', 'vocab/', 'business/']
        for section in main_sections:
            pattern = f'href="{section}'
            replacement = f'href="{"../" * depth}{section}'
            content = re.sub(pattern, replacement, content)
    
    return content

def process_html_file(filepath):
    """Process a single HTML file to fix broken links"""
    print(f"Processing: {filepath}")
    
    try:
        # Backup the original file
        backup_path = backup_file(filepath)
        
        # Read the file
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original_content = content
        
        # Apply fixes
        content = fix_navigation_links(content, filepath)
        content = fix_relative_paths(content, filepath)
        
        # Write back if changes were made
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Fixed links in {filepath}")
            return True
        else:
            # Remove backup if no changes were made
            os.remove(backup_path)
            print(f"  - No changes needed for {filepath}")
            return False
            
    except Exception as e:
        print(f"  ✗ Error processing {filepath}: {e}")
        return False

def create_missing_pages():
    """Create essential missing pages"""
    missing_pages = {
        'register.html': {
            'title': 'Register - ESL Fun Online',
            'description': 'Create your account to access premium ESL learning resources and personalized learning paths.',
            'content': '''
            <section class="register-section">
                <div class="container">
                    <h1>Register for ESL Fun Online</h1>
                    <p>Create your account to access premium learning resources</p>
                    <div class="register-form-container">
                        <p>Registration system coming soon! For now, explore our free resources:</p>
                        <div class="quick-links">
                            <a href="english/eslresources.html" class="btn btn-primary">Explore English Resources</a>
                            <a href="coding/codingresources.html" class="btn btn-secondary">Try Coding Tutorials</a>
                            <a href="games/games.html" class="btn">Play Learning Games</a>
                        </div>
                    </div>
                </div>
            </section>
            '''
        },
        'contact.html': {
            'title': 'Contact Us - ESL Fun Online',
            'description': 'Get in touch with ESL Fun Online for support, partnerships, or questions about our learning resources.',
            'content': '''
            <section class="contact-section">
                <div class="container">
                    <h1>Contact ESL Fun Online</h1>
                    <p>We'd love to hear from you! Get in touch for support or partnership opportunities.</p>
                    <div class="contact-info">
                        <div class="contact-method">
                            <i class="fas fa-envelope"></i>
                            <h3>Email</h3>
                            <p>Send us a message and we'll respond within 24 hours</p>
                            <a href="mailto:contact@eslfunonline.com">contact@eslfunonline.com</a>
                        </div>
                        <div class="contact-method">
                            <i class="fas fa-comments"></i>
                            <h3>Support</h3>
                            <p>Need help with our resources or have questions?</p>
                            <p>Visit our <a href="blog/blog.html">blog</a> for FAQs and guides</p>
                        </div>
                    </div>
                </div>
            </section>
            '''
        }
    }
    
    for filename, page_data in missing_pages.items():
        filepath = f"/Users/dillchalisas/ESLonline/{filename}"
        if not os.path.exists(filepath):
            print(f"Creating missing page: {filename}")
            
            # Read the index.html as a template
            with open('/Users/dillchalisas/ESLonline/index.html', 'r', encoding='utf-8') as f:
                template = f.read()
            
            # Replace title and description
            template = re.sub(r'<title>.*?</title>', f'<title>{page_data["title"]}</title>', template)
            template = re.sub(r'name="description" content="[^"]*"', f'name="description" content="{page_data["description"]}"', template)
            
            # Replace main content (everything between hero section and footer)
            hero_start = template.find('<section id="home" class="hero">')
            footer_start = template.find('<!-- Enhanced Professional Footer -->')
            
            if hero_start != -1 and footer_start != -1:
                new_content = template[:hero_start] + page_data["content"] + template[footer_start:]
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"  ✓ Created {filename}")

def main():
    """Main function to fix broken links across the website"""
    print("🔧 Starting ESL Fun Online Broken Link Repair")
    print("=" * 50)
    
    # Change to the website directory
    os.chdir('/Users/dillchalisas/ESLonline')
    
    # Create missing essential pages first
    print("\n📄 Creating missing essential pages...")
    create_missing_pages()
    
    # Find all HTML files
    html_files = []
    for root, dirs, files in os.walk('.'):
        # Skip backup files and certain directories
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', 'dist']]
        for file in files:
            if file.endswith('.html') and not file.endswith('.backup'):
                html_files.append(os.path.join(root, file))
    
    print(f"\n🔍 Found {len(html_files)} HTML files to process")
    
    # Process each file
    fixed_count = 0
    for html_file in html_files:
        if process_html_file(html_file):
            fixed_count += 1
    
    print(f"\n✅ Repair complete!")
    print(f"📊 Files processed: {len(html_files)}")
    print(f"📊 Files modified: {fixed_count}")
    print(f"📊 Files unchanged: {len(html_files) - fixed_count}")
    
    print("\n💡 Next steps:")
    print("1. Test the website locally")
    print("2. Update sitemap.xml with any new pages")
    print("3. Submit updated sitemap to Google Search Console")
    print("4. Request re-indexing of fixed pages")

if __name__ == "__main__":
    main()