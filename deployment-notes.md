# Free Fun Icebreaker Games — Deployment Notes

## Production URL Replacement Checklist

Before deploying to production at `https://www.freefunicebreakergames.com/`, complete these steps:

1. **Canonical URLs**: Replace all `<!-- Canonical URL will be added before production deployment -->` comments with actual `<link rel="canonical" href="https://www.freefunicebreakergames.com/PATH">` tags.

2. **Sitemap URLs**: Update `/sitemap.xml` to use full absolute URLs prefixed with `https://www.freefunicebreakergames.com`.

3. **Robots.txt**: Update the `Sitemap:` line to point to `https://www.freefunicebreakergames.com/sitemap.xml`.

4. **JSON-LD Schema URLs**: Update all `"url"` and `"item"` fields in JSON-LD blocks to use absolute production URLs.

5. **Open Graph URLs**: Update all `og:url` values to use absolute production URLs.

6. **Test all pages after deployment** — verify 200 responses for all public pages.

7. **Submit sitemap** in Google Search Console only after deployment is confirmed.
