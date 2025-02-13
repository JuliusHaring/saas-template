import TurndownService from "turndown";

export class TextService {
  private static _instance: TextService;
  private turndownService: TurndownService;

  private constructor() {
    this.turndownService = new TurndownService({
      headingStyle: "atx", // Uses `# Heading` instead of `Heading\n===`
      bulletListMarker: "-", // Uses `-` for lists instead of `*`
      codeBlockStyle: "fenced", // Uses triple backticks for code blocks
      linkStyle: "inlined", // Keeps URLs inline
    });

    // **Remove unnecessary elements**
    this.turndownService.remove(["script", "style", "meta", "link"]);

    // **Remove JSON-LD metadata**
    this.turndownService.addRule("remove-jsonld", {
      filter: (node) =>
        node.tagName === "SCRIPT" &&
        (node as HTMLScriptElement).type === "application/ld+json",
      replacement: () => "",
    });

    // **Remove inline styles**
    this.turndownService.addRule("remove-inline-styles", {
      filter: (node) => node.style && node.style.length > 0,
      replacement: (content) => content, // Keep only the text
    });
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public convertHtmlToText(html: string): string {
    const markdown = this.turndownService.turndown(html);
    return this.cleanMarkdown(markdown);
  }

  // **Helper function to clean extra whitespace**
  private cleanMarkdown(markdown: string): string {
    return markdown
      .replace(/\n{2,}/g, "\n") // Remove excessive new lines
      .replace(/\s{2,}/g, " ") // Remove excessive spaces
      .trim();
  }
}
