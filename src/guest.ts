// Wedding couple, used by the admin message generator.
export const BRIDE_NAME = 'Oshani';
export const GROOM_NAME = 'Hari';

export const PREFIXES = [
  { code: 'mr', label: 'Mr.' },
  { code: 'mrs', label: 'Mrs.' },
  { code: 'miss', label: 'Miss' },
  { code: 'mrmrs', label: 'Mr. & Mrs.' },
  { code: 'family', label: 'Family' },
  { code: 'dear', label: 'Dear' },
] as const;

export type PrefixCode = (typeof PREFIXES)[number]['code'];

/**
 * Combines prefix + name into the guest's display name.
 * "Dear" is a greeting style, not a title, so it adds nothing here;
 * the greeting itself always supplies the single "Dear".
 */
export function buildDisplayName(prefix: PrefixCode, rawName: string): string {
  const name = rawName.trim().replace(/\s+/g, ' ');
  if (!name) return '';
  switch (prefix) {
    case 'mr': return `Mr. ${name}`;
    case 'mrs': return `Mrs. ${name}`;
    case 'miss': return `Miss ${name}`;
    case 'mrmrs': return `Mr. & Mrs. ${name}`;
    case 'family': return `${name} and Family`;
    case 'dear':
    default: return name;
  }
}

/** {baseURL}/{guestName}, plus ?p=<prefix> so the invitation can show the full display name. */
export function buildInviteLink(baseUrl: string, prefix: PrefixCode, rawName: string): string {
  const name = rawName.trim().replace(/\s+/g, ' ');
  const base = baseUrl.replace(/\/+$/, '');
  const query = prefix === 'dear' ? '' : `?p=${prefix}`;
  return `${base}/${encodeURIComponent(name)}${query}`;
}

export function buildMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${GROOM_NAME} & ${BRIDE_NAME}`;
}

/** Reads the guest from the current URL (/{guestName}?p=prefix). Returns '' when none. */
export function getGuestFromUrl(): string {
  const segment = window.location.pathname.split('/').filter(Boolean)[0];
  if (!segment || segment.toLowerCase() === 'admin') return '';
  let name = '';
  try {
    name = decodeURIComponent(segment);
  } catch {
    return '';
  }
  const p = new URLSearchParams(window.location.search).get('p') || 'dear';
  const valid = PREFIXES.some((x) => x.code === p);
  return buildDisplayName((valid ? p : 'dear') as PrefixCode, name);
}
