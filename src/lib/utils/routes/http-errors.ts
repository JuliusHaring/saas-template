import {
  Quota,
  QuotaReachedException,
  QuotaService,
} from "@/lib/services/quotas-service";
import { ChatBot, User } from "@prisma/client";

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

// Middleware for Error Handling (Optional, if you're using a framework like Express)
export const handleHttpError = (error: unknown): Response => {
  if (error instanceof HttpError) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.statusCode,
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

export async function checkAssistantQuotaReachedError(
  assistantId: ChatBot["assistantId"],
  quota: Quota,
) {
  const quotaService = QuotaService.Instance;

  await _checkQuota(
    quotaService.getAssistantQuotaRemainder(assistantId, quota, true),
  );
}

export async function checkUserQuotaReachedError(
  userId: User["userId"],
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
