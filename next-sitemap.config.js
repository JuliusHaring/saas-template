const fs = require("fs/promises");
const path = require("path");
const { globby } = require("globby");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.<REPLACE_ME>.de",
  generateRobotsTxt: true,
  exclude: ["/api/*", "/stripe/*"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", disallow: "/api", allow: "/" }],
    additionalSitemaps: [
      "https://www.<REPLACE_ME>.de/sitemap.xml",
      "https://www.<REPLACE_ME>.de/sitemap-0.xml",
    ],
  },
  async additionalPaths(config) {
    const now = new Date().toISOString();

    // Static app routes
    const globResult = await globby(["src/app/**/!([.*])/page.tsx"]);
    const staticPages = globResult
      .filter((e) => !e.includes("["))
      .map((e) => e.replace(/^src\/app/, "").replace("/page.tsx", ""))
      .map((e) => new URL(e, config.siteUrl).toString())
      .map((loc) => ({
        loc,
        lastmod: now,
        changefreq: config.changefreq,
      }));

    // Blog posts from public/content/blog/*.mdx
    const blogDir = path.join(process.cwd(), "public/content/blog");
    const files = await fs.readdir(blogDir);

    const blogPosts = files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(".mdx", ""))
      .map((slug) => ({
        loc: `${config.siteUrl}/blog/${slug}`,
        lastmod: now,
        changefreq: config.changefreq,
      }));

    return [...staticPages, ...blogPosts];
  },
};
