const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "src");
const exts = new Set([".js", ".jsx", ".ts", ".tsx"]);
const PRESERVE_KEYWORDS = ["eslint", "license", "copyright", "@preserve"];

async function walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.isFile() && exts.has(path.extname(entry.name)))
      await processFile(full);
  }
}

function shouldPreserveTopComment(text) {
  const lower = text.toLowerCase();
  return PRESERVE_KEYWORDS.some((k) => lower.includes(k));
}

function removeComments(content) {
  // Preserve top-of-file leading comment block(s)
  let i = 0;
  const len = content.length;
  let leading = "";
  const startsWith = (pos, s) => content.substr(pos, s.length) === s;
  while (i < len) {
    if (/\s/.test(content[i])) {
      leading += content[i++];
      continue;
    }
    if (startsWith(i, "//")) {
      let j = i + 2;
      while (j < len && content[j] !== "\n") j++;
      leading += content.slice(i, j);
      i = j;
      continue;
    }
    if (startsWith(i, "/*")) {
      let j = i + 2;
      while (j < len && !(content[j] === "*" && content[j + 1] === "/")) j++;
      if (j < len) j += 2;
      leading += content.slice(i, j);
      i = j;
      continue;
    }
    break;
  }

  const rest = content.slice(i);
  const preserve = shouldPreserveTopComment(leading);

  let out = "";
  let inSingle = false,
    inDouble = false,
    inTemplate = false;
  for (let k = 0; k < rest.length; k++) {
    const ch = rest[k];
    const next = rest[k + 1];
    const next2 = rest[k + 2];

    // JSX comment start '{/*'
    if (
      !inSingle &&
      !inDouble &&
      !inTemplate &&
      ch === "{" &&
      next === "/" &&
      next2 === "*"
    ) {
      k += 3; // position after '{/*'
      while (
        k < rest.length &&
        !(rest[k] === "*" && rest[k + 1] === "/" && rest[k + 2] === "}")
      )
        k++;
      k += 2; // will be incremented by loop
      continue;
    }

    if (!inSingle && !inDouble && !inTemplate) {
      // line comment
      if (ch === "/" && next === "/") {
        k += 2;
        while (k < rest.length && rest[k] !== "\n") k++;
        if (k < rest.length) out += "\n";
        continue;
      }
      // block comment
      if (ch === "/" && next === "*") {
        k += 2;
        while (k < rest.length && !(rest[k] === "*" && rest[k + 1] === "/"))
          k++;
        k += 1;
        continue;
      }
    }

    // handle strings
    if (ch === '"' && !inSingle && !inTemplate) {
      out += ch;
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

  return (preserve ? leading : "") + out;
}

async function processFile(filePath) {
  try {
    const content = await fs.promises.readFile(filePath, "utf8");
    const newContent = removeComments(content);
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
