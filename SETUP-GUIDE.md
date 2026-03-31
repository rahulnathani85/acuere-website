# Acuere Consultancy Website — Deployment Guide

## Step 1: Create GitHub Repository

1. Go to **https://github.com/new**
2. Repository name: `acuere-website`
3. Keep it **Private**
4. Click **Create repository**
5. Open **Command Prompt** on your computer, navigate to the website folder, and run:

```
cd C:\Users\lenovo\Desktop\acuere-website
git init
git add .
git commit -m "Initial commit - Acuere Consultancy website"
git branch -M main
git remote add origin https://github.com/rahulnathani85/acuere-website.git
git push -u origin main
```

If prompted, sign in to GitHub.

---

## Step 2: Set Up Supabase

1. Go to **https://supabase.com** and sign in (use GitHub login)
2. Click **New Project**
   - Name: `acuere-website`
   - Database password: choose a strong password (save it!)
   - Region: **South Asia (Mumbai)** — ap-south-1
   - Click **Create new project**
3. Wait for the project to be created (~2 minutes)
4. Go to **SQL Editor** (left sidebar)
5. Paste the contents of `supabase-setup.sql` and click **Run**
6. Go to **Settings > API** (left sidebar)
   - Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - Copy your **anon/public** key

7. Open `script.js` and replace:
   - `YOUR_SUPABASE_URL` with your Project URL
   - `YOUR_SUPABASE_ANON_KEY` with your anon key

8. Commit and push the change:
```
git add script.js
git commit -m "Add Supabase connection"
git push
```

---

## Step 3: Set Up Email Notifications

### Option A: Supabase Database Webhook + Resend (simplest)

1. Sign up at **https://resend.com** (free tier: 100 emails/day)
2. Verify your domain `acuereconsultancy.com` in Resend
3. Get your Resend API key
4. In Supabase Dashboard, go to **Database > Webhooks**
5. Create a new webhook:
   - Name: `email-notification`
   - Table: `contact_inquiries`
   - Events: `INSERT`
   - Type: HTTP Request
   - URL: Resend API endpoint
   - Configure to send email to `rahul@acuereconsultancy.com`

### Option B: Check Supabase Dashboard manually
- Go to **Table Editor > contact_inquiries** to see all submissions
- You can also enable email notifications through Supabase integrations

---

## Step 4: Deploy to Vercel

1. Go to **https://vercel.com** and sign in with GitHub
2. Click **Add New... > Project**
3. Import `rahulnathani85/acuere-website`
4. Framework Preset: **Other** (it's a static site)
5. Click **Deploy**
6. Your site will be live at: `acuere-website.vercel.app`

---

## Step 5: Connect Custom Domain

1. In Vercel, go to your project **Settings > Domains**
2. Add `acuereconsultancy.com`
3. Vercel will show you DNS records to add
4. Log into your domain registrar and add:
   - **A Record**: `76.76.21.21` (for `acuereconsultancy.com`)
   - **CNAME**: `cname.vercel-dns.com` (for `www.acuereconsultancy.com`)
5. Wait for DNS propagation (can take up to 48 hours, usually 10-30 minutes)
6. Vercel will automatically provision an SSL certificate

---

## Done!

Your website will be live at **https://acuereconsultancy.com**

Every time you push changes to GitHub, Vercel will automatically redeploy.
Contact form submissions will be stored in Supabase.
