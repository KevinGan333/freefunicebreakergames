/**
 * Free Fun Icebreaker Games — Local Audit Script
 * Usage: node tools/audit-site.mjs
 * Scans all .html files for broken links, schema issues, sitemap problems.
 */

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, extname, relative, dirname } from "path";

const ROOT = process.cwd();
const DOMAIN = "https://www.freefunicebreakergames.com";
const EXCLUDE_DIRS = ["node_modules", ".git", ".vercel", "audit-reports", "tools"];
const REPORT_DIR = join(ROOT, "audit-reports");
const BAD_PATTERNS = [/\/topics\/topics\//, /\/templates\/questions\//, /\/categories\/games\//];

if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR);

const brokenLinks = [];
const schemaIssues = [];
const sitemapIssues = [];
let htmlFiles = 0;

function walkDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith(".") || EXCLUDE_DIRS.includes(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) walkDir(full);
    else if (e.name.endsWith(".html")) {
      htmlFiles++;
      auditHtml(full);
    }
  }
}

function auditHtml(filePath) {
  const content = readFileSync(filePath, "utf8");
  const relPath = relative(ROOT, filePath).replace(/\\/g, "/");

  // Check for bad path patterns
  for (const pattern of BAD_PATTERNS) {
    if (pattern.test(content)) {
      brokenLinks.push({ file: relPath, issue: `Contains bad pattern: ${pattern}`, severity: "high" });
    }
  }

  // Check for bare relative href (missing leading /)
  const bareHrefMatches = content.match(/href="(topics|questions|templates|games|categories)\/[^"]+"/g);
  if (bareHrefMatches) {
    bareHrefMatches.forEach(m => {
      if (!m.includes('href="/')) {
        brokenLinks.push({ file: relPath, issue: `Bare relative href: ${m}`, severity: "high" });
      }
    });
  }

  // Check canonical is absolute
  const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)"/);
  if (canonicalMatch) {
    const canonical = canonicalMatch[1];
    if (!canonical.startsWith(DOMAIN)) {
      schemaIssues.push({ file: relPath, issue: `Canonical not absolute: ${canonical}`, severity: "high" });
    }
  } else if (!filePath.includes("/embed/")) {
    schemaIssues.push({ file: relPath, issue: "Missing canonical link", severity: "medium" });
  }

  // Check BreadcrumbList for relative URLs
  if (content.includes("BreadcrumbList")) {
    const bcMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)"@type":\s*"BreadcrumbList"([\s\S]*?)<\/script>/);
    if (bcMatch) {
      const bc = bcMatch[0];
      if (bc.includes('"item": "/') && !bc.includes(`"item": "${DOMAIN}`)) {
        schemaIssues.push({ file: relPath, issue: "BreadcrumbList uses relative URLs", severity: "high" });
      }
      if (bc.includes('"id"') || bc.includes('"@id"')) {
        schemaIssues.push({ file: relPath, issue: "BreadcrumbList contains id field", severity: "high" });
      }
    }
  }
}

function auditSitemap() {
  const sitemapPath = join(ROOT, "sitemap.xml");
  if (!existsSync(sitemapPath)) { sitemapIssues.push("sitemap.xml missing"); return; }
  const content = readFileSync(sitemapPath, "utf8");
  const urls = content.match(/<loc>([^<]+)<\/loc>/g) || [];
  
  for (const u of urls) {
    const url = u.replace(/<\/?loc>/g, "");
    if (url.includes("/embed/")) sitemapIssues.push(`Embed URL in sitemap: ${url}`);
    if (url.includes("/404.html")) sitemapIssues.push("404.html in sitemap");
    if (url.includes("topics/topics") || url.includes("templates/questions") || url.includes("categories/games")) {
      sitemapIssues.push(`Bad nested URL in sitemap: ${url}`);
    }
  }
  
  sitemapIssues.push(`Total sitemap URLs: ${urls.length}`);
}

// RUN
console.log("Starting audit...");
walkDir(ROOT);
auditSitemap();

// Write reports
writeFileSync(join(REPORT_DIR, "broken-links-report.json"), JSON.stringify(brokenLinks, null, 2));
writeFileSync(join(REPORT_DIR, "schema-report.json"), JSON.stringify(schemaIssues, null, 2));
writeFileSync(join(REPORT_DIR, "sitemap-report.json"), JSON.stringify(sitemapIssues, null, 2));

const summary = [
  `=== Free Fun Icebreaker Games — Audit Summary ===`,
  `Files scanned: ${htmlFiles}`,
  `Broken links: ${brokenLinks.length}`,
  `Schema issues: ${schemaIssues.length}`,
  `Sitemap issues: ${sitemapIssues.filter(i => !i.startsWith("Total")).length}`,
  sitemapIssues.find(i => i.startsWith("Total")) || "",
  `\n=== VERDICT ===`,
  brokenLinks.length + schemaIssues.length + sitemapIssues.filter(i => !i.startsWith("Total")).length === 0
    ? "✅ Site is clean. No issues found."
    : "⚠ Issues found. See detailed reports in audit-reports/."
].join("\n");

writeFileSync(join(REPORT_DIR, "summary.txt"), summary);
console.log(summary);
console.log("\nReports saved to audit-reports/");
