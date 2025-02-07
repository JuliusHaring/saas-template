import { ChatBotIdType, CreateWebsiteSourceType } from "@/lib/db/types";
import { SourcesService } from "@/lib/services/sources-service";
import { getUserId } from "@/lib/utils/routes/auth";
import { withErrorHandling } from "@/lib/utils/routes/http-errors";
import { NextRequest } from "next/server";

const sourcesService = SourcesService.Instance;

enum SourceType {
  WEBSITE_SOURCE = "websiteSource",
  G_DRIVE_SOURCE = "gDriveSource",
}

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
  }

  return createdSource;
});
