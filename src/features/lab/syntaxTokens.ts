export type JavaScriptSyntaxKind = "plain" | "keyword" | "literal" | "number" | "string" | "comment" | "function" | "property";

export type JavaScriptSyntaxToken = {
  kind: JavaScriptSyntaxKind;
  text: string;
};

const keywords = new Set([
  "async", "await", "break", "case", "catch", "class", "const", "continue",
  "default", "delete", "do", "else", "export", "extends", "finally", "for",
  "from", "function", "if", "import", "in", "instanceof", "let", "new", "of",
  "return", "static", "super", "switch", "this", "throw", "try", "typeof",
  "var", "void", "while", "yield",
]);

const literals = new Set(["false", "null", "true", "undefined"]);
const tokenPattern = /\/\/.*$|\/\*.*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b/g;

function classifyToken(line: string, text: string, index: number): JavaScriptSyntaxKind {
  if (text.startsWith("//") || text.startsWith("/*")) return "comment";
  if (/^["'`]/.test(text)) return "string";
  if (/^\d/.test(text)) return "number";
  if (keywords.has(text)) return "keyword";
  if (literals.has(text)) return "literal";

  const before = line.slice(0, index).trimEnd();
  if (before.endsWith(".")) return "property";
  const after = line.slice(index + text.length);
  if (/^\s*\(/.test(after)) return "function";
  return "plain";
}

export function tokenizeJavaScriptLine(line: string): JavaScriptSyntaxToken[] {
  const tokens: JavaScriptSyntaxToken[] = [];
  let cursor = 0;

  for (const match of line.matchAll(tokenPattern)) {
    const index = match.index ?? 0;
    if (index > cursor) tokens.push({ kind: "plain", text: line.slice(cursor, index) });
    tokens.push({ kind: classifyToken(line, match[0], index), text: match[0] });
    cursor = index + match[0].length;
  }

  if (cursor < line.length) tokens.push({ kind: "plain", text: line.slice(cursor) });
  return tokens.length ? tokens : [{ kind: "plain", text: line || " " }];
}
