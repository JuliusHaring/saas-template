import { ChatBot } from "@prisma/client";
import { RAGFile, RAGSourceCrawler } from "./i-rag-source-crawler";
import { getWebsiteSource } from "@/lib/db/source";
import axios from "axios";
import * as cheerio from "cheerio";

export class WebsiteSourceCrawler implements RAGSourceCrawler {
  private static _instance: WebsiteSourceCrawler;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {}

  async listFiles(
    userId: ChatBot["userId"],
    assistantId: string,
  ): Promise<RAGFile[]> {
    const websiteSource = await getWebsiteSource(userId, assistantId);

    const { url, url_exceptions } = websiteSource;

    const visitedUrls = new Set<string>();
    const regexPatterns = url_exceptions.map((pattern) => new RegExp(pattern));

    const files: RAGFile[] = [];
    await this.crawlWebsite(
      url,
      regexPatterns,
      visitedUrls,
      files,
      new URL(url).hostname,
    );

    return files;
  }

  private async crawlWebsite(
    url: string,
    urlExceptions: RegExp[],
    visitedUrls: Set<string>,
    files: RAGFile[],
    baseHostname: string,
  ) {
    if (visitedUrls.has(url)) return;
    visitedUrls.add(url);

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Extract all links
      const links: string[] = [];
      $("a[href]").each((_, element) => {
        const link = $(element).attr("href");
        if (link) {
          const absoluteLink = new URL(link, url).href; // Resolve relative links
          const linkHostname = new URL(absoluteLink).hostname;

          // Ensure the link is within the same website
          if (
            linkHostname === baseHostname && // Same hostname
            !urlExceptions.some((pattern) => pattern.test(absoluteLink)) // Not in exceptions
          ) {
            links.push(absoluteLink);
          }
        }
      });

      // Save the current page content as a file
      files.push({
        name: this.extractFileName(url),
        content: response.data,
      });

      // Recursively crawl the links
      for (const link of links) {
        await this.crawlWebsite(
          link,
          urlExceptions,
          visitedUrls,
          files,
          baseHostname,
        );
      }
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
    }
  }

  private extractFileName(url: string): string {
    return url.replace(/[^a-zA-Z0-9]/g, "_") + ".html";
  }
}
