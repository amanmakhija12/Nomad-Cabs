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

function parseDateSafe(value, { assumeUTCForMySQL = true } = {}) {
  try {
    if (!value) return null;

    if (value instanceof Date && !isNaN(value.getTime())) return value;
    if (typeof value === "number") return new Date(value);

    if (typeof value === "string") {
      let dateString = value;
      if (
        assumeUTCForMySQL &&
        dateString.length === 19 &&
        dateString.includes(" ")
      ) {
        dateString = dateString.replace(" ", "T") + "Z";
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export function formatDateSafe(
  value,
  {
    locale = undefined,
    timeZone = undefined,
    variant = "date",
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
        month: "short",
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
