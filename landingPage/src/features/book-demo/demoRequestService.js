import { appConfig } from "../../config";
const base = appConfig.apiBaseUrl;

export async function createDemoRequest(payload) {
  if (!base && import.meta.env.PROD)
    throw Object.assign(
      new Error("The demo request service is not configured."),
      { code: "API_NOT_CONFIGURED" },
    );
  let response;
  try {
    response = await fetch(`${base || "/api/v1"}/demo-requests`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw Object.assign(
      new Error(
        "We could not submit your demo request. Please check your connection and try again.",
      ),
      { code: "NETWORK_ERROR" },
    );
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw Object.assign(
      new Error(
        body.message ||
          "We could not submit your demo request. Please check your connection and try again.",
      ),
      {
        status: response.status,
        code: body.code,
        errors: body.errors || body.details?.fieldErrors,
      },
    );
  return body.data;
}
export async function getDemoConfirmation(requestId) {
  const response = await fetch(
      `${base || "/api/v1"}/demo-requests/confirmation/${encodeURIComponent(requestId)}`,
    ),
    body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      body.message || "We could not load your demo confirmation.",
    );
  return body.data;
}
