import { NextRequest } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { UserService } from "@/lib/services/user-service";
import { BadRequest, withErrorHandling } from "@/lib/utils/routes/http-errors";

const userService = UserService.Instance;

export const POST = withErrorHandling(async (request: NextRequest) => {
  const payload = (await request.json()) as WebhookEvent;

  if (payload.type === "user.created" || payload.type === "user.updated") {
    const email_id = payload.data.primary_email_address_id;
    const email = payload.data.email_addresses.find(
      (addr) => addr.id === email_id,
    )!.email_address;
    await userService.createOrUpdateUser(payload.data.id, email!);

    return { success: true };
  }

  if (payload.type === "user.deleted") {
    await userService.deleteUser(payload.data.id!);

    return { success: true };
  }

  throw BadRequest("Unhandled clerk event");
});
