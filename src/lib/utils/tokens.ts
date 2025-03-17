import { NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL } from "@/lib/utils/environment";
import { encodingForModel, TiktokenModel } from "js-tiktoken";

const encoder = encodingForModel(
  NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL as TiktokenModel,
);

export function encodeTokens(text: string) {
  return encoder.encode(text);
}

export function decodeTokens(tokens: number[]) {
  return encoder.decode(tokens);
}

export function countTokens(toCount: string | number[]) {
  let tokens = toCount;
  if (typeof tokens === "string") {
    tokens = encodeTokens(tokens);
  }
  return tokens.length;
}
