export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const res = await fetch(input, init);
  const data = await res.json();
  return data as T;
}
