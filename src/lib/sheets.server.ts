/**
 * Appends a row to a Google Sheet via a Google Apps Script Web App URL.
 * Configure the GOOGLE_SHEETS_WEBHOOK_URL secret with the deployed script URL.
 */
export async function logToSheet(sheet: string, payload: Record<string, unknown>) {
  const url = process.env["GOOGLE_SHEETS_WEBHOOK_URL"];
  if (!url) {
    console.warn("GOOGLE_SHEETS_WEBHOOK_URL is not set — skipping sheet log", sheet);
    return { logged: false as const, error: "GOOGLE_SHEETS_WEBHOOK_URL is not configured" };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sheet, timestamp: new Date().toISOString(), ...payload }),
    });
    const responseText = await res.text();
    let response: { ok?: boolean; error?: string } = {};
    try {
      response = JSON.parse(responseText) as { ok?: boolean; error?: string };
    } catch {
      // Apps Script can return a non-JSON error page for a bad deployment.
    }
    if (!res.ok || response.ok === false) {
      console.error(`Sheet log failed [${res.status}]: ${response.error || responseText}`);
      return {
        logged: false as const,
        error: response.error || `Webhook returned HTTP ${res.status}`,
      };
    }
    return { logged: true as const };
  } catch (e) {
    console.error("Sheet log error", e);
    return {
      logged: false as const,
      error: e instanceof Error ? e.message : "Could not reach Google Sheets webhook",
    };
  }
}
