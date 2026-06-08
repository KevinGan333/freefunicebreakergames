# Vercel Deployment Guide for Free Fun Icebreaker Games

## Before You Begin
- All production URLs use: `https://www.freefunicebreakergames.com`
- The site is pure static HTML/CSS/JS — no build step required
- No backend, database, or serverless functions are needed

## Step 1: Confirm Local QA
```bash
cd freefunicebreakergames
python -m http.server 3000
```
- Open http://localhost:3000/
- Test homepage, all-games, random-game, icebreaker-questions
- Test mobile menu, theme toggle, Back to Top button
- Confirm no console errors

## Step 2: Create GitHub Repository
- Create a new GitHub repository (public or private)
- Push the entire project folder:
```bash
git init
git add .
git commit -m "Initial commit — Free Fun Icebreaker Games"
git remote add origin https://github.com/YOUR_USERNAME/freefunicebreakergames.git
git push -u origin main
```

## Step 3: Import into Vercel
- Go to https://vercel.com
- Click "Add New" → "Project"
- Select the GitHub repository
- Configure:
  - Framework Preset: **Other**
  - Build Command: *(leave empty)*
  - Output Directory: *(leave empty)*
  - Install Command: *(leave empty)*
- Click Deploy

## Step 4: Deploy Preview
- Vercel will provide a preview URL (e.g., `project-name.vercel.app`)
- Test the preview URL thoroughly:
  - All pages load
  - Iframe games work
  - Theme toggle works
  - Mobile menu works
  - Back to Top button works
  - 404 page works
  - Sitemap loads at `/sitemap.xml`
  - Robots.txt loads at `/robots.txt`

## Step 5: Add Production Domain
- In Vercel dashboard → Project Settings → Domains
- Add: `www.freefunicebreakergames.com`
- (Optional) Add: `freefunicebreakergames.com` and set redirect to `www`
- Follow Vercel's DNS configuration instructions
- Update DNS records at your domain registrar

## Step 6: Confirm HTTPS
- Vercel automatically provisions SSL certificates
- Wait a few minutes after DNS propagation
- Confirm `https://www.freefunicebreakergames.com` loads with a valid certificate

## Step 7: Production QA
Test these URLs after deployment:
- https://www.freefunicebreakergames.com/
- https://www.freefunicebreakergames.com/all-games.html
- https://www.freefunicebreakergames.com/random-game.html
- https://www.freefunicebreakergames.com/icebreaker-questions.html
- https://www.freefunicebreakergames.com/sitemap.xml
- https://www.freefunicebreakergames.com/robots.txt
- https://www.freefunicebreakergames.com/404.html (visit a non-existent page)
- Test iframe games, mobile menu, theme toggle, Back to Top

## Step 8: Google Search Console
- Go to https://search.google.com/search-console
- Add property for `www.freefunicebreakergames.com`
- Verify domain ownership (DNS TXT record or HTML file)
- Submit sitemap: `https://www.freefunicebreakergames.com/sitemap.xml`
- Monitor indexing over the following weeks

## Step 9: Do Not Add Yet
- Do not add Google Analytics until the owner approves
- Do not add ads until enough content is indexed
- Do not add third-party iframe games without permission
- Do not add user login, database, or backend
