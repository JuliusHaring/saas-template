/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.knex-ai.de",
  alternateRefs: ["https://www.knex-ai.de"],
  generateRobotsTxt: true,
  exclude: ["/api/*", "/stripe/*"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", disallow: "/api", allow: "/" }],
  },
  async additionalPaths(config) {
    const { globby } = await import("globby");
    const globResult = await globby(["src/app/**/!([.*])/page.tsx"]);
    const now = new Date().toISOString();

    const pages = globResult
      .filter((e) => !e.includes("["))
      .map((e) => e.replace(/^src\/app/, "").replace("/page.tsx", ""))
      .map((e) => new URL(e, "https://www.knex-ai.de").toString())
      .map((loc) => ({
        loc,
        lastmod: now,
        changefreq: config.changefreq,
      }));

    return [...pages];
  },
  async transform(config, path) {
    const loc = new URL(path, config.siteUrl);

    return {
      loc: loc.toString(),
      changefreq: config.changefreq,
      lastmod: config.lastmod,
    };
  },
};
