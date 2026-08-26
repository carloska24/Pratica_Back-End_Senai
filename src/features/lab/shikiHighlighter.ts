export type HighlightedCodeToken = {
  text: string;
  color?: string;
};

export type HighlightedCodeLine = HighlightedCodeToken[];

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

async function createJavaScriptHighlighter() {
  const [core, engine, language, theme, brackets] = await Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
    import("@shikijs/langs/javascript"),
    import("@shikijs/themes/dark-plus"),
    import("@shikijs/colorized-brackets"),
  ]);
  const highlighter = await core.createHighlighterCore({
    themes: [theme.default],
    langs: [language.default],
    engine: engine.createJavaScriptRegexEngine(),
  });
  return { highlighter, colorizedBrackets: brackets.transformerColorizedBrackets() };
}

let highlighterPromise: ReturnType<typeof createJavaScriptHighlighter> | null = null;

function getJavaScriptHighlighter() {
  highlighterPromise ??= createJavaScriptHighlighter();
  return highlighterPromise;
}

function hasClass(node: HastNode, className: string) {
  const value = node.properties?.className ?? node.properties?.class;
  return Array.isArray(value) ? value.includes(className) : String(value ?? "").split(/\s+/).includes(className);
}

function findElement(node: HastNode, tagName: string): HastNode | null {
  if (node.type === "element" && node.tagName === tagName) return node;
  for (const child of node.children ?? []) {
    const found = findElement(child, tagName);
    if (found) return found;
  }
  return null;
}

function colorFromStyle(style: unknown) {
  const match = typeof style === "string" ? style.match(/(?:^|;)color:([^;]+)/i) : null;
  return match?.[1]?.trim();
}

function collectTokens(node: HastNode, inheritedColor?: string): HighlightedCodeToken[] {
  if (node.type === "text") return [{ text: node.value ?? "", ...(inheritedColor ? { color: inheritedColor } : {}) }];
  const color = colorFromStyle(node.properties?.style) ?? inheritedColor;
  return (node.children ?? []).flatMap(child => collectTokens(child, color));
}

function mergeAdjacentTokens(tokens: HighlightedCodeToken[]): HighlightedCodeToken[] {
  const merged: HighlightedCodeToken[] = [];
  for (const token of tokens) {
    const previous = merged.at(-1);
    if (previous && previous.color === token.color) previous.text += token.text;
    else merged.push({ ...token });
  }
  return merged.length ? merged : [{ text: " " }];
}

function extractLines(root: HastNode): HighlightedCodeLine[] {
  const code = findElement(root, "code");
  if (!code) return [];
  return (code.children ?? [])
    .filter(child => child.type === "element" && child.tagName === "span" && hasClass(child, "line"))
    .map(line => mergeAdjacentTokens(collectTokens(line)));
}

export async function highlightJavaScript(code: string): Promise<HighlightedCodeLine[]> {
  const { highlighter, colorizedBrackets } = await getJavaScriptHighlighter();
  const root = highlighter.codeToHast(code, {
    lang: "javascript",
    theme: "dark-plus",
    transformers: [colorizedBrackets],
  }) as HastNode;
  return extractLines(root);
}
