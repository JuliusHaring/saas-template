import TurndownService from "turndown";

export class TextService {
  private static _instance: TextService;
  private turndownService: TurndownService;

  private constructor() {
    this.turndownService = new TurndownService();
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public convertHtmlToText(html: string): string {
    return this.turndownService.turndown(html);
  }
}
