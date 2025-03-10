import { getWebsiteSource } from "@/lib/db/source";
import axios from "axios";
import * as cheerio from "cheerio";
import { UserIdType } from "@/lib/db/types";
import { RAGSourceCrawler } from "@/lib/services/api-services/crawling/i-rag-source-crawler";
import { RAGFile } from "@/lib/services/api-services/rag/types";
import { TextService } from "@/lib/services/api-services/text-service";

export class WebsiteSourceCrawler extends RAGSourceCrawler {
  private static _instance: WebsiteSourceCrawler;
  textService: TextService;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    super();
    this.textService = TextService.Instance;
  }

  async _listFiles(
    userId: UserIdType,
    chatBotId: string,
    n: number = Number.MAX_SAFE_INTEGER,
  ): Promise<RAGFile[]> {
    const websiteSource = await getWebsiteSource(userId, chatBotId);

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
      n,
    );

    return files;
  }

  private async crawlWebsite(
    url: string,
    urlExceptions: RegExp[],
    visitedUrls: Set<string>,
    files: RAGFile[],
    baseHostname: string,
    n: number,
  ) {
    if (visitedUrls.size >= n) return;
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
        content: this.textService.convertHtmlToText(response.data),
      });

      // Recursively crawl the links
      for (const link of links) {
        await this.crawlWebsite(
          link,
          urlExceptions,
          visitedUrls,
          files,
          baseHostname,
          n,
        );
      }
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
    }
  }

  private extractFileName(url: string): string {
    return url.replace(/[^a-zA-Z0-9]/g, "_");
  }
}
