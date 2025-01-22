type QuotaKey = "USER_ASSISTANT_COUNT";
type QuotaValue = {
  type: "MAX" | "MIN";
  value: number;
};

export class QuotaNotFoundException extends Error {}

export class QuotaReachedException extends Error {}

export class QuotaService {
  private static _instance: QuotaService;
  private quotas = new Map<QuotaKey, QuotaValue>([
    ["USER_ASSISTANT_COUNT", { type: "MAX", value: 3 }],
  ]);

  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public getQuota(quotaName: QuotaKey): QuotaValue {
    if (
      !this.quotas.has(quotaName) ||
      typeof this.quotas.get(quotaName) === "undefined"
    ) {
      throw new QuotaNotFoundException();
    }
    return this.quotas.get(quotaName)!;
  }

  public assessQuota(quotaName: QuotaKey, currentValue: QuotaValue["value"]) {
    const quota = this.getQuota(quotaName);

    switch (quota.type) {
      case "MAX":
        if (currentValue > quota.value) {
          throw new QuotaReachedException();
        }
        break;
      case "MIN":
        if (currentValue < quota.value) {
          throw new QuotaReachedException();
        }
        break;
    }
  }
}
