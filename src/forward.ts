import consola from "consola";

export const forwardWebhook = async (
  forwardUrl: string,
  data: Record<string, any>
) => {
  try {
    // Parse the webhook payload
    const payload = typeof data === "string" ? JSON.parse(data) : data;

    const { httpMethod, meta } = payload;
    const { body, headers, query } = meta;

    // Construct the URL with query parameters
    const targetUrl = new URL(forwardUrl);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        targetUrl.searchParams.append(key, value as string);
      });
    }

    // Prepare headers, filtering out headers that should be set automatically by fetch
    const forwardHeaders: Record<string, string> = {};
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        // Skip headers that will be set automatically by fetch
        const skipHeaders = [
          "host",
          "connection",
          "content-length",
          "transfer-encoding",
        ];
        if (!skipHeaders.includes(key.toLowerCase())) {
          forwardHeaders[key] = value as string;
        }
      });
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method: httpMethod,
      headers: forwardHeaders,
    };

    // Add body if present and method supports it
    if (body && !["GET", "HEAD"].includes(httpMethod.toUpperCase())) {
      requestOptions.body =
        typeof body === "string" ? body : JSON.stringify(body);
    }

    // Make the forwarded request
    const response = await fetch(targetUrl.toString(), requestOptions);

    if (response.ok) {
      consola.success(
        `Successfully forwarded ${httpMethod} request to ${targetUrl.toString()} with status ${
          response.status
        }`
      );
    } else {
      consola.error(
        `Failed to forward request: ${response.status} ${response.statusText}`
      );
    }

    return response;
  } catch (error) {
    console.error("Error forwarding webhook:", error);
    throw error;
  }
};
