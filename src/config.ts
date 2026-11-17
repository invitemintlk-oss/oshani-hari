// Google Apps Script Web App that saves RSVPs to the Oshani & Hari Google Sheet.
export const GOOGLE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyl2gop2zlYCBT6gcRIfsazSa0fAdU9XG_SHH487e5O10XRsoovwAGeSGu5Dp0OVOUQ3w/exec';

export async function submitToSheet(sheet: 'RSVP' | 'WISH', data: Record<string, string>) {
  // URL-encoded body = "simple" request, so the browser sends no CORS preflight
  // (Apps Script cannot answer preflight requests).
  const body = new URLSearchParams({ sheet, ...data });
  const res = await fetch(GOOGLE_APPS_SCRIPT_URL, { method: 'POST', body });
  const json = await res.json().catch(() => ({ ok: res.ok }));
  if (!json.ok) throw new Error(json.error || 'Submission failed');
  return json;
}
