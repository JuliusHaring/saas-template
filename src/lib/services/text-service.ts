import TurndownService from "turndown";
import { marked } from "marked";

export class TextService {
  private static _instance: TextService;
  private turndownService: TurndownService;

  private constructor() {
    this.turndownService = new TurndownService({
      headingStyle: "atx",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
      linkStyle: "inlined",
    });

    this.turndownService.remove(["script", "style", "meta", "link"]);

    this.turndownService.addRule("remove-jsonld", {
      filter: (node) =>
        node.tagName === "SCRIPT" &&
        (node as HTMLScriptElement).type === "application/ld+json",
      replacement: () => "",
    });

    this.turndownService.addRule("remove-inline-styles", {
      filter: (node) => node.style && node.style.length > 0,
      replacement: (content) => content,
    });
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public convertHtmlToText(html: string): string {
    const markdown = this.turndownService.turndown(html);
    return this.cleanMarkdown(markdown);
  }

  public convertMarkdownToHtml(markdown: string): string {
    return marked.parse(markdown, { async: false }).trim();
  }

  private cleanMarkdown(markdown: string): string {
    return markdown
      .replace(/\n{2,}/g, "\n")
      .replace(/\s{2,}/g, " ")
      .trim();
  }
}
