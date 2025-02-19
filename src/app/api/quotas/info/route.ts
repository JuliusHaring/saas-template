import { QuotaService } from "@/lib/services/api-services/quotas-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";

const quotaService = await QuotaService.getInstance();

export const GET = withErrorHandling(async () => {
  const userId = await getUserId();

  const tiersWithQuotas = await quotaService.getTierQuotasLimitInfo(userId);
  return tiersWithQuotas;
});
