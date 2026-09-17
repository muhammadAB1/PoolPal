import type { Language } from '@/lib/types';

export const COUNTRY_CODES = ["AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW"] as const;

export type SupportedCountryCode = (typeof COUNTRY_CODES)[number];

const COUNTRY_FALLBACKS: Record<string, { en: string; es: string }> = {
  US: { en: 'United States', es: 'Estados Unidos' },
  ES: { en: 'Spain', es: 'España' },
};

export function normalizeCountryCode(value?: string | null): string {
  if (!value) return 'US';
  return value.trim().toUpperCase();
}

export function getCountryName(code: string, language: Language): string {
  const normalized = normalizeCountryCode(code);
  const fallback = COUNTRY_FALLBACKS[normalized];
  if (fallback) return fallback[language];

  try {
    const DisplayNames = (Intl as typeof Intl & { DisplayNames?: new (locales?: string | string[], options?: { type: 'region' }) => { of(code: string): string | undefined } }).DisplayNames;
    if (!DisplayNames) return normalized;
    const displayNames = new DisplayNames([language === 'es' ? 'es-ES' : 'en-US'], {
      type: 'region',
    });
    return displayNames.of(normalized) ?? normalized;
  } catch {
    return normalized;
  }
}

export function getCountryFlag(code: string): string {
  const normalized = normalizeCountryCode(code);
  if (!/^[A-Z]{2}$/.test(normalized)) return '🌐';
  return String.fromCodePoint(...normalized.split('').map((char) => 127397 + char.charCodeAt(0)));
}

export type LocalitySuggestion = {
  id: string;
  name: string;
  countryCode: string;
};

const LOCALITY_SUGGESTIONS: Record<string, readonly string[]> = {
  US: [
    'Miami', 'West Palm Beach', 'Palm Beach Gardens', 'Wellington', 'Lake Worth Beach',
    'Fort Lauderdale', 'Boca Raton', 'Orlando', 'Tampa', 'Jacksonville', 'Naples',
    'Sarasota', 'Key West', 'Austin', 'Houston', 'Dallas', 'Phoenix', 'San Diego',
    'Los Angeles', 'New York',
  ],
  ES: [
    'Valencia', 'Madrid', 'Barcelona', 'Alicante', 'Castellón de la Plana', 'Málaga',
    'Palma', 'Sevilla', 'Murcia', 'Marbella', 'Benidorm', 'Gandia', 'Torrent',
    'Paterna', 'Sagunto', 'Alzira', 'Dénia', 'Jávea', 'Torrevieja', 'Elche',
  ],
};

function slugify(value: string) {
  return value
    .trim()
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function searchLocalities(countryCode: string, query: string): LocalitySuggestion[] {
  const normalizedCountry = normalizeCountryCode(countryCode);
  const trimmed = query.trim();
  const source = LOCALITY_SUGGESTIONS[normalizedCountry] ?? [];
  const lower = trimmed.toLocaleLowerCase();

  const matches = source
    .filter((name) => !lower || name.toLocaleLowerCase().includes(lower))
    .slice(0, 30)
    .map((name) => ({
      id: `${normalizedCountry}:${slugify(name)}`,
      name,
      countryCode: normalizedCountry,
    }));

  if (
    trimmed.length >= 2 &&
    !matches.some((item) => item.name.toLocaleLowerCase() === lower)
  ) {
    matches.unshift({
      id: `${normalizedCountry}:manual:${slugify(trimmed)}`,
      name: trimmed,
      countryCode: normalizedCountry,
    });
  }

  return matches;
}
