# Contact Form Email Setup Guide

## Overview

This guide will help you set up your contact form to send emails to your inbox. There are several methods you can use, each with different pros and cons.

---

## Method 1: EmailJS (Recommended - Free & Easy)

### Why EmailJS?

- ✅ No backend server needed
- ✅ Free tier (200 emails/month)
- ✅ Works with static HTML sites
- ✅ Easy setup (10 minutes)

### Setup Steps:

1. **Create EmailJS Account**

   - Go to https://www.emailjs.com/
   - Sign up for free account
   - Verify your email

2. **Add Email Service**

   - Go to Email Services section
   - Click "Add New Service"
   - Choose your email provider (Gmail recommended)
   - Follow connection wizard
   - Note your **Service ID**

3. **Create Email Template**

   - Go to Email Templates
   - Click "Create New Template"
   - Use this template:

   ```
   Subject: New Contact Form Submission from {{from_name}}

   Name: {{from_name}}
   Email: {{from_email}}
   Message: {{message}}
   ```

   - Note your **Template ID**

4. **Update Your Contact Form**
   Add this to your contact.html (before closing </body> tag):

   ```html
   <script
     type="text/javascript"
     src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
   ></script>
   <script type="text/javascript">
     (function () {
       emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your public key
     })();

     document
       .getElementById("contact-form")
       .addEventListener("submit", function (event) {
         event.preventDefault();

         // Show loading state
         const submitBtn = event.target.querySelector('button[type="submit"]');
         const originalText = submitBtn.textContent;
         submitBtn.textContent = "Sending...";
         submitBtn.disabled = true;

         // Send email
         emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this).then(
           function () {
             alert("Message sent successfully!");
             document.getElementById("contact-form").reset();
             submitBtn.textContent = originalText;
             submitBtn.disabled = false;
           },
           function (error) {
             alert("Failed to send message. Please try again.");
             console.error("EmailJS Error:", error);
             submitBtn.textContent = originalText;
             submitBtn.disabled = false;
           }
         );
       });
   </script>
   ```

5. **Update Your HTML Form**
   Make sure your form has these attributes:
   ```html
   <form id="contact-form">
     <input type="text" name="from_name" placeholder="Your Name" required />
     <input type="email" name="from_email" placeholder="Your Email" required />
     <textarea name="message" placeholder="Your Message" required></textarea>
     <button type="submit">Send Message</button>
   </form>
   ```

---

## Method 2: Formspree (Alternative - Free & Simple)

### Why Formspree?

- ✅ Even simpler than EmailJS
- ✅ Free tier (50 submissions/month)
- ✅ No JavaScript needed
- ✅ Spam protection included

### Setup Steps:

1. **Create Account**

   - Go to https://formspree.io/
   - Sign up for free

2. **Create Form**

   - Click "New Form"
   - Enter your email address
   - Get your form endpoint

3. **Update Your Form**
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
     <label for="name">Name:</label>
     <input type="text" name="name" required />

     <label for="email">Email:</label>
     <input type="email" name="email" required />

     <label for="message">Message:</label>
     <textarea name="message" required></textarea>

     <button type="submit">Send</button>
   </form>
   ```

---

## Method 3: PHP Mail (Requires PHP Server)

### If Your Host Supports PHP:

1. **Create contact-process.php**

   ```php
   <?php
   if ($_SERVER["REQUEST_METHOD"] == "POST") {
       // Get form data
       $name = strip_tags(trim($_POST["name"]));
       $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
       $message = trim($_POST["message"]);

       // Validate
       if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
           http_response_code(400);
           echo "Please complete all fields.";
           exit;
       }

       // Set recipient email
       $recipient = "dillynvermeulen@gmail.com";
       $subject = "New Contact from $name";

       // Build email content
       $email_content = "Name: $name\n";
       $email_content .= "Email: $email\n\n";
       $email_content .= "Message:\n$message\n";

       // Build email headers
       $email_headers = "From: $name <$email>";

       // Send email
       if (mail($recipient, $subject, $email_content, $email_headers)) {
           http_response_code(200);
           echo "Thank you! Your message has been sent.";
       } else {
           http_response_code(500);
           echo "Oops! Something went wrong.";
       }
   } else {
       http_response_code(403);
       echo "There was a problem with your submission.";
   }
   ?>
   ```

2. **Update Your HTML Form**
   ```html
   <form action="contact-process.php" method="POST">
     <input type="text" name="name" placeholder="Name" required />
     <input type="email" name="email" placeholder="Email" required />
     <textarea name="message" placeholder="Message" required></textarea>
     <button type="submit">Send</button>
   </form>
   ```

---

## Method 4: Google Forms Embed (Quick & Easy)

### Steps:

1. **Create Google Form**

   - Go to https://forms.google.com
   - Create new form with fields: Name, Email, Message
   - Go to Send → Embed HTML
   - Copy iframe code

2. **Embed in Your Page**
   ```html
   <iframe
     src="YOUR_GOOGLE_FORM_LINK"
     width="640"
     height="800"
     frameborder="0"
     marginheight="0"
     marginwidth="0"
   >
     Loading…
   </iframe>
   ```

---

## Recommended Setup for Your Site

**I recommend EmailJS because:**

1. Your site is static HTML (no backend)
2. It's free for your needs
3. Professional appearance
4. Easy to customize
5. Reliable delivery

**Quick Start (5 minutes):**

1. Sign up at emailjs.com
2. Connect your Gmail
3. Create a template
4. Add the script to your contact page
5. Test it!

---

## Testing Your Form

After setup, test with:

1. Valid email → Should receive email
2. Invalid email → Should show error
3. Empty fields → Should show validation
4. Multiple submissions → Should all work

---

## Troubleshooting

### Emails Not Arriving?

- Check spam folder
- Verify email service connection
- Check EmailJS dashboard for errors
- Ensure correct Service ID and Template ID

### Form Not Submitting?

- Open browser console (F12)
- Look for JavaScript errors
- Verify form ID matches script
- Check internet connection

---

## Security Best Practices

1. **Add ReCAPTCHA** (prevent spam)

   - Go to https://www.google.com/recaptcha
   - Get site key
   - Add to form

2. **Input Validation**

   - Already included in examples
   - Never trust user input

3. **Rate Limiting**
   - EmailJS includes this
   - Prevents abuse

---

## Need Help?

If you run into issues:

1. Check EmailJS documentation: https://www.emailjs.com/docs/
2. Email me with specific error messages
3. Check browser console for errors

---

## Your Current Setup

Your contact page already has:

- ✅ Email display (dillynvermeulen@gmail.com)
- ✅ Professional layout
- ⚠️ Missing: Form submission handler

Add EmailJS and you're done!
