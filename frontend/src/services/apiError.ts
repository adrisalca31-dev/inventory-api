export async function handleApiResponse<T>(
  response: Response,
  fallbackMessage: string
): Promise<T> {
  if (!response.ok) {
    let message = fallbackMessage;

    try {
      const data = await response.json();

      if (typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // Keep the fallback message when the response has no JSON body.
    }

    throw new Error(message);
  }

  return response.json();
}