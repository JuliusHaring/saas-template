import { encoding_for_model, TiktokenModel } from "tiktoken";

const encoder = encoding_for_model(
  process.env.NEXT_PUBLIC_OPENAI_EMBEDDING_MODEL! as TiktokenModel,
);

const decoder = new TextDecoder("utf-8");

export function encodeTokens(text: string) {
  return encoder.encode(text);
}

export function decodeTokens(tokens: Uint32Array) {
  return decoder.decode(encoder.decode(tokens));
}

export function countTokens(toCount: string | Uint32Array) {
  let tokens = toCount;
  if (typeof tokens === "string") {
    tokens = encodeTokens(tokens);
  }
  return tokens.length;
}
