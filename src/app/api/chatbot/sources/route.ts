import { SourcesService } from "@/lib/services/sources-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { NextResponse } from "next/server";

const sourcesService = SourcesService.Instance;

export async function GET() {
  const userId = await getUserId();

  const sources = await sourcesService.getSources(userId);

  return NextResponse.json(sources);
}
