import {
  ChatBotIdType,
  CreateWebsiteSourceType,
} from "@/lib/db/types";
import { SourcesService } from "@/lib/services/sources-service";
import { getUserId } from "@/lib/utils/routes/auth";
import {
  UnprocessableContent,
  withErrorHandling,
} from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

const sourcesService = SourcesService.Instance;

enum SourceType {
  WEBSITE_SOURCE = "websiteSource",
  G_DRIVE_SOURCE = "gDriveSource",
}

export const GET = withErrorHandling(async () => {
  const userId = await getUserId();

  const sources = await sourcesService.getSources(userId);

  return sources;
});

export const POST = withErrorHandling(async (request: NextRequest) => {
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
    default:
      throw UnprocessableContent(
        `SourceType '${sourceType}' not allowed, only accepts: ${Object.values(SourceType).join(", ")}`,
      );
  }

  return createdSource;
});
