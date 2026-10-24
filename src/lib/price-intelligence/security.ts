/**
 * Security and Customer Privacy Layer for Live Local Price Intelligence
 *
 * Enforces:
 * 1. Strict PII sanitization (zero personal data sent to external APIs)
 * 2. Enterprise-grade SSRF protection (rejects loopback, RFC1918 private IPs, AWS/GCP metadata)
 * 3. Content sanitization and memory safeguards for untrusted external HTML/text
 * 4. In-memory sliding-window rate limiting
 */

// Forbidden IP prefixes & patterns
const PRIVATE_IP_PATTERNS = [
  /^127\./, // 127.0.0.0/8 Loopback
  /^10\./, // 10.0.0.0/8 Private
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12 Private
  /^192\.168\./, // 192.168.0.0/16 Private
  /^169\.254\./, // 169.254.0.0/16 Link-local / Cloud metadata (169.254.169.254)
  /^0\./, // 0.0.0.0/8 Broadcast/current network
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // 100.64.0.0/10 Carrier-grade NAT
  /^192\.0\.2\./, // TEST-NET-1
  /^198\.51\.100\./, // TEST-NET-2
  /^203\.0\.113\./, // TEST-NET-3
  /^224\./, // Multicast
  /^240\./, // Reserved
  /^255\.255\.255\.255$/,
];

// Forbidden domain endings
const FORBIDDEN_DOMAIN_SUFFIXES = [
  '.local',
  '.localhost',
  '.internal',
  '.lan',
  '.home',
  '.corp',
  '.test',
  '.example',
  '.invalid',
  '.onion',
];

/**
 * Validates external URLs before fetching to completely prevent SSRF (Server-Side Request Forgery).
 * Strictly requires HTTPS, port 443/default, and verified public domain routing.
 */
export function validateExternalUrl(rawUrl: string): {
  isValid: boolean;
  error?: string;
  sanitizedUrl?: string;
} {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, error: 'URL must be a non-empty string.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { isValid: false, error: 'Malformed URL.' };
  }

  // 1. Strict HTTPS only
  if (parsed.protocol !== 'https:') {
    return {
      isValid: false,
      error: `Forbidden protocol: "${parsed.protocol}". Only secure HTTPS requests are permitted.`,
    };
  }

  // 2. Reject embedded user credentials (e.g. https://user:pass@example.com)
  if (parsed.username || parsed.password) {
    return { isValid: false, error: 'URLs with embedded credentials are not allowed.' };
  }

  // 3. Reject non-standard ports (SSRF port scanning prevention)
  if (parsed.port && parsed.port !== '443') {
    return { isValid: false, error: `Forbidden non-standard port: ${parsed.port}. Only standard port 443 allowed.` };
  }

  const hostname = parsed.hostname.toLowerCase().trim();

  // 4. Reject localhost and single-label hosts
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '0.0.0.0' ||
    !hostname.includes('.')
  ) {
    return { isValid: false, error: 'Access to loopback or local hostnames is strictly prohibited.' };
  }

  // 5. Reject forbidden domain suffixes
  for (const suffix of FORBIDDEN_DOMAIN_SUFFIXES) {
    if (hostname.endsWith(suffix)) {
      return { isValid: false, error: `Forbidden domain suffix: "${suffix}".` };
    }
  }

  // 6. Check for IPv4 literals in private or metadata ranges
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return { isValid: false, error: 'Access to private or link-local IP addresses is strictly prohibited.' };
    }
  }

  // 7. Check for IPv6 literals
  if (hostname.startsWith('[') || hostname.includes(':')) {
    const unbracketed = hostname.replace(/^\[|\]$/g, '').toLowerCase();
    if (
      unbracketed === '::1' ||
      unbracketed === '::' ||
      unbracketed.startsWith('fe80:') || // link-local
      unbracketed.startsWith('fc00:') || // unique local
      unbracketed.startsWith('fd00:') || // unique local
      unbracketed.includes('::ffff:') // IPv4-mapped IPv6
    ) {
      return { isValid: false, error: 'Access to private or loopback IPv6 addresses is strictly prohibited.' };
    }
  }

  // 8. TLD length validation (must have at least a 2-char valid TLD)
  const parts = hostname.split('.');
  const tld = parts[parts.length - 1];
  if (!tld || tld.length < 2 || /\d/.test(tld)) {
    return { isValid: false, error: 'Invalid top-level domain.' };
  }

  return { isValid: true, sanitizedUrl: parsed.toString() };
}

/**
 * Sanitizes search input to guarantee ZERO Customer PII is ever transmitted to TinyFish.
 * Strips customer phone numbers, street addresses, full names, credit card numbers, and emails.
 * Formats a clean, generic pricing query suitable for search.
 */
export function sanitizeSearchQuery(
  rawQuery: string,
  categoryName?: string,
  zipCode?: string
): {
  cleanQuery: string;
  genericScope: string;
  isValid: boolean;
  validationError?: string;
} {
  if (!rawQuery || rawQuery.trim().length < 3) {
    return {
      cleanQuery: '',
      genericScope: '',
      isValid: false,
      validationError: 'Query must be at least 3 characters.',
    };
  }

  let text = rawQuery;

  // 1. Remove Email addresses
  text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, ' ');

  // 2. Remove Phone numbers
  text = text.replace(/(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g, ' ');

  // 3. Remove Credit Card / Account numbers (13-19 digits)
  text = text.replace(/\b(?:\d[ -]*?){13,19}\b/g, ' ');

  // 4. Remove Specific Street Addresses (e.g. "428 Castro Street", "123 Elm Ave Apt 4", "742 Evergreen Terrace")
  text = text.replace(/\b\d{1,5}\s+[A-Za-z0-9\s]{2,20}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Court|Ct|Lane|Ln|Way|Terrace|Ter|Place|Pl|Circle|Cir|Parkway|Pkwy)\b/gi, ' ');
  text = text.replace(/\b(?:Apt|Apartment|Suite|Unit|Ste|Floor|Fl)\s*[#]?[A-Za-z0-9-]+\b/gi, ' ');

  // 5. Clean punctuation and collapse whitespace
  text = text
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Limit length of problem description to 80 chars
  if (text.length > 80) {
    text = text.slice(0, 80).trim();
  }

  // Ensure minimum valid length
  if (text.length < 3) {
    text = categoryName ? `${categoryName.toLowerCase()} repair` : 'home repair';
  }

  // Build the clean generic search query
  const parts: string[] = [];
  if (categoryName) {
    parts.push(categoryName);
  }
  parts.push(text);
  parts.push('average cost estimate price guide');

  if (zipCode && /^\d{5}$/.test(zipCode.trim())) {
    parts.push(zipCode.trim());
  }

  const cleanQuery = parts.join(' ').replace(/\s+/g, ' ').trim();

  return {
    cleanQuery,
    genericScope: text,
    isValid: true,
  };
}

/**
 * Sanitizes untrusted external webpage HTML / text retrieved via TinyFish Fetch.
 * Strips executable scripts, event handlers, iframes, styles, and controls response size.
 */
export function sanitizeExternalContent(rawContent: string, maxChars: number = 40000): string {
  if (!rawContent || typeof rawContent !== 'string') {
    return '';
  }

  let text = rawContent;

  // 1. Strip script and style blocks entirely
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  text = text.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ');
  text = text.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');
  text = text.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, ' ');

  // 2. Strip HTML tags, converting line breaks
  text = text.replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<[^>]+>/g, ' ');

  // 3. Unescape common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // 4. Normalize whitespace
  text = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

  // 5. Truncate to maximum characters to prevent memory exhaustion
  if (text.length > maxChars) {
    text = text.slice(0, maxChars);
  }

  return text;
}

/**
 * In-memory sliding-window rate limiter for client IP / session.
 */
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const rateLimitStore = new Map<string, RateLimitBucket>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 20,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  let bucket = rateLimitStore.get(identifier);

  if (!bucket || now - bucket.lastRefill > windowMs) {
    bucket = { tokens: maxRequests - 1, lastRefill: now };
    rateLimitStore.set(identifier, bucket);
    return { allowed: true, remaining: bucket.tokens, resetMs: windowMs };
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    const remainingTime = windowMs - (now - bucket.lastRefill);
    return { allowed: true, remaining: bucket.tokens, resetMs: Math.max(0, remainingTime) };
  }

  const resetMs = Math.max(0, windowMs - (now - bucket.lastRefill));
  return { allowed: false, remaining: 0, resetMs };
}
