export class PromptService {
  private static _instance: PromptService;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}
