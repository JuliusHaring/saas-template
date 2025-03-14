import { ProductDescriptionType } from "@/lib/services/api-services/stripe-service";
import { fetchJson } from "@/lib/utils/fetch";

export class FEStripeService {
  private static _instance: FEStripeService;

  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async getProductDescriptions(): Promise<ProductDescriptionType[]> {
    return fetchJson<ProductDescriptionType[]>("/api/stripe/public");
  }
}
