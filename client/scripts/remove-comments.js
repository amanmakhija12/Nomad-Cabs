const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "src");
const exts = new Set([".js", ".jsx", ".ts", ".tsx"]);
const PRESERVE_KEYWORDS = ["eslint", "license", "copyright", "@preserve"];

async function walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile() && exts.has(path.extname(entry.name))) {
      await processFile(full);
    }
  }
}

function shouldPreserveTopComment(text) {
  const lower = text.toLowerCase();
  return PRESERVE_KEYWORDS.some((k) => lower.includes(k));
}

function stripCommentsKeepTop(content) {
  // Identify leading region (from start until first non-whitespace/comment char)
  let i = 0;
  const len = content.length;
  let leading = "";

  // Helper to check if at position starts with comment
  const startsWith = (pos, s) => content.substr(pos, s.length) === s;

  while (i < len) {
    // skip whitespace
    if (/\s/.test(content[i])) {
      leading += content[i++];
      continue;
    }
    if (startsWith(i, "//")) {
      // consume until newline
      let j = i + 2;
      while (j < len && content[j] !== "\n") j++;
      leading += content.slice(i, j);
      i = j;
      continue;
    }
    if (startsWith(i, "/*")) {
      let j = i + 2;
      while (j < len && !startsWith(j, "*/")) j++;
      if (j < len) j += 2;
      leading += content.slice(i, j);
      i = j;
      continue;
    }
    break;
  }

  const rest = content.slice(i);
  const preserve = shouldPreserveTopComment(leading);

  // Now remove all comments from rest using simple state machine
  let out = "";
  let inSingle = false,
    inDouble = false,
    inTemplate = false,
    inRegex = false;
  for (let k = 0; k < rest.length; k++) {
    const ch = rest[k];
    const next = rest[k + 1];

    if (!inSingle && !inDouble && !inTemplate) {
      // handle line comment
      if (ch === "/" && next === "/") {
        k += 2;
        while (k < rest.length && rest[k] !== "\n") k++;
        if (k < rest.length) out += "\n";
        continue;
      }
      // handle block comment
      if (ch === "/" && next === "*") {
        k += 2;
        while (k < rest.length && !(rest[k] === "*" && rest[k + 1] === "/"))
          k++;
        k += 1; // will be incremented by loop
        continue;
      }
    }

    // strings handling
    if (ch === '"' && !inSingle && !inTemplate) {
      out += ch;
      // check escaping
      let idx = k - 1;
      let escaped = false;
      while (idx >= 0 && rest[idx] === "\\") {
        escaped = !escaped;
        idx--;
      }
      if (!escaped) inDouble = !inDouble;
      continue;
    }
    if (ch === "'" && !inDouble && !inTemplate) {
      out += ch;
      let idx = k - 1;
      let escaped = false;
      while (idx >= 0 && rest[idx] === "\\") {
        escaped = !escaped;
        idx--;
      }
      if (!escaped) inSingle = !inSingle;
      continue;
    }
    if (ch === "`" && !inSingle && !inDouble) {
      out += ch;
      let idx = k - 1;
      let escaped = false;
      while (idx >= 0 && rest[idx] === "\\") {
        escaped = !escaped;
        idx--;
      }
      if (!escaped) inTemplate = !inTemplate;
      continue;
    }

    out += ch;
  }

  const final = (preserve ? leading : "") + out;
  return final;
}

async function processFile(filePath) {
  try {
    const content = await fs.promises.readFile(filePath, "utf8");
    const newContent = stripCommentsKeepTop(content);
    if (newContent !== content) {
      await fs.promises.writeFile(filePath, newContent, "utf8");
      console.log("Processed:", filePath);
    }
  } catch (err) {
    console.error("Error processing", filePath, err);
  }
}

(async () => {
  console.log("Scanning", ROOT);
  await walk(ROOT);
  console.log("Done");
})();
