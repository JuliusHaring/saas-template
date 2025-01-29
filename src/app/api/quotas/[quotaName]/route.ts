import { Quota, QuotaService } from "@/lib/services/quotas-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { BadRequest, handleHttpError } from "@/lib/utils/routes/http-errors";
import { type NextRequest, NextResponse } from "next/server";

const quotaService = QuotaService.Instance;

export async function GET(req: NextRequest) {
  try {
    const quotaName = req.nextUrl.searchParams.get("quotaName")!;
    const userId = await getUserId();

    const map = await quotaService.getUserQuotas(userId);

    if (!Object.keys(Quota).includes(quotaName)) {
      throw BadRequest(`Invalid quota name ${quotaName}`);
    }

    const selectedQuota = Quota[quotaName as keyof typeof Quota];

    return NextResponse.json(map.get(selectedQuota));
  } catch (error) {
    return handleHttpError(error);
  }
}
