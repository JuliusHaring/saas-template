import { getWebsiteSource } from "@/lib/db/source";
import axios from "axios";
import * as cheerio from "cheerio";
import { UserIdType } from "@/lib/db/types";
import { RAGSourceCrawler } from "@/lib/services/api-services/crawling/i-rag-source-crawler";
import { RAGFile } from "@/lib/services/api-services/rag/types";
import { TextService } from "@/lib/services/text-service";

export class WebsiteSourceCrawler extends RAGSourceCrawler {
  private static _instance: WebsiteSourceCrawler;
  protected insertionSource = "WebsiteSourceCrawler";
  textService: TextService;

  public static async getInstance() {
    if (typeof this._instance !== "undefined") return this._instance;

    this._instance = new this();
    await this._instance.init();
    return this._instance;
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
    await this._crawlWebsite(
      url,
      regexPatterns,
      visitedUrls,
      files,
      new URL(url).hostname,
      n,
    );

    return files;
  }

  private async _crawlWebsite(
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
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; RAGBot/1.0)",
          "Accept-Language": "en-US,en;q=0.9,de;q=0.8",
          Accept: "text/html,application/xhtml+xml",
        },
      });
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
        insertionSource: WebsiteSourceCrawler.name,
      });

      // Recursively crawl the links
      for (const link of links) {
        await this._crawlWebsite(
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
    return new URL(url).pathname;
  }
}
