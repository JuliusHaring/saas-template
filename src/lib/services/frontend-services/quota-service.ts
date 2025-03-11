import {
  QuotaUsageType,
  QuotasTierLimitsInfo,
} from "@/lib/services/api-services/quotas-service";
import { fetchJson } from "@/lib/utils/fetch";

export class FEQutoaService {
  private static _instance: FEQutoaService;
  private constructor() {}

  public static get Insance() {
    return this._instance || (this._instance = new this());
  }

  public async getQuotas() {
    return fetchJson<QuotaUsageType>("/api/quotas").then((q) => {
      q.lastResetAt = new Date(q.lastResetAt);
      return q;
    });
  }

  public async getTierQuotaLimits() {
    return fetchJson<QuotasTierLimitsInfo>("/api/quotas/info");
  }
}
