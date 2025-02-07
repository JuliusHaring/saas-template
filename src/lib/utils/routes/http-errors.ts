import { ChatBotIdType, UserIdType } from "@/lib/db/types";
import {
  Quota,
  QuotaReachedException,
  QuotaService,
} from "@/lib/services/quotas-service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
  }
}

// Common HTTP Error Factories
export const BadRequest = (message = "Bad Request") =>
  new HttpError(400, message);

export const UnprocessableContent = (message = "Unprocessable Content") =>
  new HttpError(422, message);

export const Unauthorized = (message = "Unauthorized") =>
  new HttpError(401, message);

export const QuotaReached = (message = "Quota Reached") =>
  new HttpError(402, message);

export const Forbidden = (message = "Forbidden") => new HttpError(403, message);

export const NotFound = (message = "Not Found") => new HttpError(404, message);

export const InternalServerError = (message = "Internal Server Error") =>
  new HttpError(500, message);

export const ServiceUnavailable = (message = "Service Unavailable") =>
  new HttpError(503, message);

const _handleHttpError = (error: unknown): Response => {
  if (error instanceof HttpError) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    let errMsg = `DB Error (${error.code}): ` + error.message;
    switch (error.code) {
      case "P2025":
        errMsg = error.meta!.cause + ` (model: ${error.meta!.modelName})`;
        break;
    }

    return new Response(JSON.stringify({ error: errMsg }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fallback for unexpected errors
  console.error("Unhandled Error:", error);
  return new Response(JSON.stringify({ error: "Internal Server Error" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
};

export async function checkChatBotQuotaReachedError(
  chatBotId: ChatBotIdType,
  quota: Quota,
) {
  const quotaService = QuotaService.Instance;

  await _checkQuota(
    quotaService.getChatBotQuotaRemainder(chatBotId, quota, true),
  );
}

export async function checkUserQuotaReachedError(
  userId: UserIdType,
  quota: Quota,
) {
  const quotaService = QuotaService.Instance;

  await _checkQuota(quotaService.getUserQuotaRemainder(userId, quota, true));
}

async function _checkQuota(numberFunc: Promise<number>) {
  try {
    await numberFunc;
  } catch (e) {
    if (e instanceof QuotaReachedException) {
      throw QuotaReached(e.message);
    }
    throw BadRequest(`Error while reading the user quota.`);
  }
}

export function withErrorHandling<T>(
  handler: (req: NextRequest) => Promise<T>,
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    try {
      const result = await handler(req);
      if (result instanceof NextResponse) {
        throw Error(`unable to process NextResponse in Error Handler`);
      }
      return NextResponse.json(result);
    } catch (error) {
      return _handleHttpError(error);
    }
  };
}
