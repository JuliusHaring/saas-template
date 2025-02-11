import {
  QuotasTierLimitsInfo,
  QuotaUsageType,
} from "../api-services/quotas-service";
import { fetchJson } from "../utils/fetch";

export class FEQutoaService {
  private static _instance: FEQutoaService;
  private constructor() {}

  public static get Insance() {
    return this._instance || (this._instance = new this());
  }

  public async getQuotas() {
    return fetchJson<QuotaUsageType>("/api/quotas");
  }

  public async getTierQuotaLimits() {
    return fetchJson<QuotasTierLimitsInfo>("/api/quotas/info");
  }
}
