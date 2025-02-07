import { ChatBotIdType, CreateWebsiteSourceType } from "@/lib/db/types";
import { SourcesService } from "@/lib/services/sources-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { handleHttpError } from "@/lib/utils/routes/http-errors";
import { NextRequest, NextResponse } from "next/server";

const sourcesService = SourcesService.Instance;

enum SourceType {
  WEBSITE_SOURCE = "websiteSource",
  G_DRIVE_SOURCE = "gDriveSource",
}

export async function GET() {
  const userId = await getUserId();

  const sources = await sourcesService.getSources(userId);

  return NextResponse.json(sources);
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();

    const body = await request.json();
    const {
      chatBotId,
      sourceType,
      websiteSourceCreate,
    }: {
      chatBotId: ChatBotIdType;
      sourceType: SourceType;
      websiteSourceCreate: CreateWebsiteSourceType;
    } = body;

    let createdSource;
    switch (sourceType) {
      case "websiteSource":
        createdSource = await sourcesService.createWebsiteSource(
          userId,
          chatBotId,
          websiteSourceCreate,
        );
        break;
    }

    return createdSource;
  } catch (error) {
    return handleHttpError(error);
  }
}
