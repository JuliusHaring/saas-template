import { QuotaService } from "@/lib/services/quotas-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { NextResponse } from "next/server";

const quotaService = QuotaService.Instance;

export async function GET(request: Request) {
  const userId = await getUserId();

  const map = await quotaService.getUserQuotas(userId);
  return NextResponse.json(Object.fromEntries(map));
}
