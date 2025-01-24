import { Quota, QuotaService } from "@/lib/services/quotas-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { BadRequest, handleHttpError } from "@/lib/utils/routes/http-errors";
import { NextRequest, NextResponse } from "next/server";

const quotaService = QuotaService.Instance;

export async function GET(
  req: NextRequest,
  { params }: { params: { quotaName: string } },
) {
  try {
    const { quotaName } = params;
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
