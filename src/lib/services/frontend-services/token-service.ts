import { SignTokenType } from "@/app/api/token/sign/route";
import { fetchJson } from "@/lib/utils/fetch";

export class FETokenService {
  private static _instance: FETokenService;

  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public signToken(
    chatBotId: SignTokenType["chatBotId"],
    allowedDomains: SignTokenType["allowedDomains"],
  ) {
    const body: SignTokenType = {
      chatBotId,
      allowedDomains,
    };
    return fetchJson<string>(`/api/token/sign`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
}
