import {
  QuotaException,
  QuotaNotFoundException,
  QuotaReachedException,
} from "@/lib/api-services/quotas-service";
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

export const TooManyRequests = (message = "Too Many Requests") =>
  new HttpError(429, message);

export const InternalServerError = (message = "Internal Server Error") =>
  new HttpError(500, message);

export const ServiceUnavailable = (message = "Service Unavailable") =>
  new HttpError(503, message);

const _handleHttpError = (error: HttpError) => {
  return new Response(JSON.stringify({ error: error.message }), {
    status: error.statusCode,
    headers: { "Content-Type": "application/json" },
  });
};

const _handleError = (error: unknown): Response => {
  if (error instanceof HttpError) {
    return _handleHttpError(error);
  }

  if (error instanceof PrismaClientKnownRequestError) {
    let errMsg = `DB Error (${error.code}): `;
    switch (error.code) {
      case "P2025":
        errMsg += error.meta!.cause + ` (model: ${error.meta!.modelName})`;
        break;
      default:
        errMsg += error.message;
        break;
    }

    return new Response(JSON.stringify({ error: errMsg }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (error instanceof QuotaException) {
    switch (error.constructor) {
      case QuotaReachedException:
        return _handleHttpError(TooManyRequests());
      case QuotaNotFoundException:
        return _handleHttpError(NotFound());
    }
  }

  // Fallback for unexpected errors
  console.error("Unhandled Error:", error);
  return new Response(JSON.stringify({ error: (error as Error).message }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
};

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
      return _handleError(error);
    }
  };
}
