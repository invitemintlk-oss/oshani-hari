/**
 * Oshani & Hari - Wedding RSVP / Wishes endpoint
 * Paste this whole file into Extensions > Apps Script of the Google Sheet,
 * then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 */

const SPREADSHEET_ID = '1x0P_8m5KvLib1j-0aIdCSKp95gdWfPCwOW4r8V9leko';

const SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Number of Guests', 'Dietary Notes'],
    row: (p) => [new Date(), p.name || '', p.guests || '', p.dietaryNotes || ''],
  },
  WISH: {
    name: 'WISH',
    headers: ['Timestamp', 'Name', 'Message'],
    row: (p) => [new Date(), p.name || '', p.message || ''],
  },
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const payload = parsePayload_(e);
    const key = String(payload.sheet || 'RSVP').toUpperCase();
    const config = SHEETS[key];

    if (!config) {
      return jsonResponse_({ ok: false, error: 'Invalid sheet. Use RSVP or WISH.' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, config.name);
    ensureHeaders_(sheet, config.headers);
    sheet.appendRow(config.row(payload));

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: String(error && error.message ? error.message : error),
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse_({ ok: true, message: 'Oshani & Hari wedding endpoint is running.' });
}

function parsePayload_(e) {
  const params = e && e.parameter ? e.parameter : {};
  if (Object.keys(params).length > 0) return params;

  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) return {};

  try {
    return JSON.parse(contents);
  } catch (_error) {
    return {};
  }
}

function getOrCreateSheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
