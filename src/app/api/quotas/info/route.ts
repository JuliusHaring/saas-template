import { QuotaService } from "@/lib/services/api-services/quotas-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

const quotaService = await QuotaService.getInstance();

export const GET = withErrorHandling(async (request: NextRequest) => {
  const userId = await getUserId(request);

  const tiersWithQuotas = await quotaService.getTierQuotasLimitInfo(userId);
  return tiersWithQuotas;
});
