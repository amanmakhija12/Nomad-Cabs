export function parseMySQLTimestamp(s, { asUTC = true } = {}) {
	if (typeof s !== "string") return null;
	const raw = s.trim().replace(/^['"]|['"]$/g, "");
	if (!raw) return null;

	const m = raw.match(
		/^(\d{4})-(\d{2})-(\d{2}) T:(\d{2}):(\d{2})(\.(\d{1,6}))?$/
	);
	if (!m) return null;

	const Y = +m[1],
		M = +m[2],
		D = +m[3],
		h = +m[4],
		i = +m[5],
		s2 = +m[6];
	const frac = m[8] || "";
	const ms = frac ? Math.floor(Number(frac.padEnd(3, "0").slice(0, 3))) : 0;

	const d = asUTC
		? new Date(Date.UTC(Y, M - 1, D, h, i, s2, ms))
		: new Date(Y, M - 1, D, h, i, s2, ms);

	return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Safely parses a date string, number, or Date object.
 * This is crucial because JavaScript's Date parser is notoriously
 * inconsistent, especially with MySQL-style timestamps.
 *
 * @param {string | number | Date} value - The date to parse
 * @param {object} [options] - Parsing options
 * @param {boolean} [options.assumeUTCForMySQL=true] - Fixes MySQL (YYYY-MM-DD HH:MM:SS) parsing
 * @returns {Date | null} A valid Date object or null
 */
function parseDateSafe(value, { assumeUTCForMySQL = true } = {}) {
  try {
    if (!value) return null;

    // If it's already a valid Date object
    if (value instanceof Date && !isNaN(value.getTime())) return value;
    
    // If it's a number (timestamp)
    if (typeof value === "number") return new Date(value);

    // If it's a string
    if (typeof value === "string") {
      let dateString = value;
      
      // FIX: A "YYYY-MM-DD HH:MM:SS" string (from MySQL) is parsed
      // by browsers as LOCAL time. We must force it to parse as UTC
      // by replacing the space with a 'T' and adding 'Z'.
      if (assumeUTCForMySQL && dateString.length === 19 && dateString.includes(" ")) {
        dateString = dateString.replace(" ", "T") + "Z";
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null; // Invalid date string
      return date;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}


/**
 * Safely formats a date value into a human-readable string.
 *
 * @param {string | number | Date} value - The date to format
 * @param {object} [options] - Formatting options
 * @param {string} [options.variant="date"] - 'date', 'datetime', 'iso', or 'year'
 * @param {string} [options.fallback="—"] - String to return if date is invalid
 */
export function formatDateSafe(
  value,
  {
    locale = undefined, // 'en-IN'
    timeZone = undefined, // 'Asia/Kolkata'
    variant = "date", // 'date' | 'datetime' | 'iso' | 'month-year'
    fallback = "—",
    assumeUTCForMySQL = true,
  } = {}
) {
  const date = parseDateSafe(value, { assumeUTCForMySQL });
  if (!date) return fallback;

  if (variant === "iso") return date.toISOString();

  let options = { timeZone };

  switch (variant) {
    case "datetime":
      options = {
        ...options,
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      break;

    case "month-year":
      options = {
        ...options,
        year: "numeric",
		month: "short"
      };
      break;

    case "date":
    default:
      options = {
        ...options,
        year: "numeric",
        month: "short",
        day: "2-digit",
      };
      break;
  }

  return date.toLocaleString(locale, options);
}

/**
 * Convert a Date to "YYYY-MM-DD HH:MM:SS(.SSS)".
 * asUTC=true means we take UTC components (recommended for consistency).
 */
export function toMySQLFromDate(date, { asUTC = true, withMs = true } = {}) {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
	const pad = (n, w = 2) => String(n).padStart(w, "0");

	const Y = asUTC ? date.getUTCFullYear() : date.getFullYear();
	const M = (asUTC ? date.getUTCMonth() : date.getMonth()) + 1;
	const D = asUTC ? date.getUTCDate() : date.getDate();
	const h = asUTC ? date.getUTCHours() : date.getHours();
	const m = asUTC ? date.getUTCMinutes() : date.getMinutes();
	const s = asUTC ? date.getUTCSeconds() : date.getSeconds();
	const ms = asUTC ? date.getUTCMilliseconds() : date.getMilliseconds();

	const base = `${Y}-${pad(M)}-${pad(D)} ${pad(h)}:${pad(m)}:${pad(s)}`;
	return withMs ? `${base}.${String(ms).padStart(3, "0")}` : base;
}
