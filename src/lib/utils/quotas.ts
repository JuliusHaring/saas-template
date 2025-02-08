import { QuotaUsageType } from "../services/quotas-service";

export async function getQuotas(): Promise<QuotaUsageType> {
  const res = await fetch(`/api/quotas`);
  return res.json();
}
