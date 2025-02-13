export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  try {
    const res = await fetch(input, init);

    if (!res.ok) {
      const errorBody = await res.text(); // Try to capture response body
      throw new Error(
        `HTTP error! Status: ${res.status} - ${res.statusText}, Response: ${errorBody}`,
      );
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(
      `fetchJson error: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
}
