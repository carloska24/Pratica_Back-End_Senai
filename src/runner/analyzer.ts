import { parse } from "@babel/parser";
import type {
  LabModuleId,
  TeachingAnalysis,
  TeachingFunction,
} from "@/runner/contracts";
import { labModules } from "./missionCatalog";

type AstNode = {
  type: string;
  start?: number | null;
  end?: number | null;
  loc?: { start: { line: number; column: number } } | null;
  [key: string]: unknown;
};

function isNode(value: unknown): value is AstNode {
  return Boolean(value && typeof value === "object" && "type" in value && typeof (value as AstNode).type === "string");
}

function nodeText(code: string, node: unknown) {
  if (!isNode(node) || typeof node.start !== "number" || typeof node.end !== "number") return "";
  return code.slice(node.start, node.end).trim();
}

function identifierName(node: unknown): string {
  if (!isNode(node)) return nodeText("", node);
  if (node.type === "Identifier" && typeof node.name === "string") return node.name;
  if (node.type === "RestElement") return `...${identifierName(node.argument)}`;
  if (node.type === "AssignmentPattern") return identifierName(node.left);
  return "parâmetro";
}

function callName(node: unknown): string {
  if (!isNode(node)) return "chamada";
  if (node.type === "Identifier" && typeof node.name === "string") return node.name;
  if (node.type === "MemberExpression") {
    const objectName = callName(node.object);
    const propertyName = callName(node.property);
    return `${objectName}.${propertyName}`;
  }
  return "chamada";
}

function sourceVersion(code: string) {
  let hash = 2166136261;
  for (let index = 0; index < code.length; index += 1) {
    hash ^= code.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function analyzeJavaScript(code: string, moduleId: LabModuleId): TeachingAnalysis {
  const variables: TeachingAnalysis["variables"] = [];
  const functions: TeachingFunction[] = [];
  const flow: TeachingAnalysis["flow"] = [];
  const diagnostics: TeachingAnalysis["diagnostics"] = [];
  const foundConcepts = new Set<string>();
  let flowSequence = 0;
  const addFlow = (kind: TeachingAnalysis["flow"][number]["kind"], label: string, node: AstNode) => {
    flowSequence += 1;
    flow.push({ id: `flow-${flowSequence}`, kind, label, line: node.loc?.start.line ?? 1, evidence: "inferred" });
  };

  try {
    const ast = parse(code, {
      sourceType: "unambiguous",
      errorRecovery: true,
      plugins: ["typescript"],
    }) as unknown as AstNode & { errors?: Array<{ message: string; loc?: { line: number; column: number } }> };

    for (const error of ast.errors ?? []) {
      diagnostics.push({ kind: "syntax", message: error.message, line: error.loc?.line, column: error.loc?.column });
    }

    const walk = (node: unknown, currentFunction?: TeachingFunction) => {
      if (Array.isArray(node)) {
        for (const child of node) walk(child, currentFunction);
        return;
      }
      if (!isNode(node)) return;

      if (node.type === "FunctionDeclaration") {
        const id = isNode(node.id) && node.id.type === "Identifier" && typeof node.id.name === "string" ? node.id.name : "função anônima";
        const fn: TeachingFunction = {
          name: id,
          parameters: Array.isArray(node.params) ? node.params.map(identifierName) : [],
          line: node.loc?.start.line ?? 1,
          calls: [],
          returns: [],
        };
        functions.push(fn);
        foundConcepts.add("function");
        if (fn.parameters.length) foundConcepts.add("parâmetros");
        addFlow("function", `Declara a função ${fn.name}(${fn.parameters.join(", ")})`, node);
        walk(node.body, fn);
        return;
      }

      if (node.type === "VariableDeclaration" && (node.kind === "const" || node.kind === "let" || node.kind === "var") && Array.isArray(node.declarations)) {
        for (const declaration of node.declarations) {
          if (!isNode(declaration) || declaration.type !== "VariableDeclarator") continue;
          const name = identifierName(declaration.id);
          variables.push({
            name,
            declaration: node.kind,
            line: declaration.loc?.start.line ?? node.loc?.start.line ?? 1,
            initialValue: nodeText(code, declaration.init) || undefined,
            scope: currentFunction?.name ?? "global",
          });
          foundConcepts.add(node.kind);
          addFlow("variable", `Cria ${node.kind} ${name}`, declaration);

          if (isNode(declaration.init) && declaration.init.type === "ArrowFunctionExpression") {
            const fn: TeachingFunction = {
              name,
              parameters: Array.isArray(declaration.init.params) ? declaration.init.params.map(identifierName) : [],
              line: declaration.loc?.start.line ?? node.loc?.start.line ?? 1,
              calls: [],
              returns: [],
            };
            functions.push(fn);
            foundConcepts.add("arrow functions");
            if (fn.parameters.length) foundConcepts.add("parâmetros");
            addFlow("function", `Cria a arrow function ${fn.name}(${fn.parameters.join(", ")})`, declaration.init);
            if (isNode(declaration.init.body) && declaration.init.body.type === "BlockStatement") {
              walk(declaration.init.body, fn);
            } else {
              fn.returns.push(nodeText(code, declaration.init.body) || "sem valor");
            }
          }
        }
      }

      if (node.type === "CallExpression" && currentFunction) {
        const name = callName(node.callee);
        if (!currentFunction.calls.includes(name)) currentFunction.calls.push(name);
      }

      if (node.type === "CallExpression") {
        const name = callName(node.callee);
        if (name === "console.log") foundConcepts.add("console.log");
        addFlow("call", `Chama ${name}`, node);
      }

      if (node.type === "ReturnStatement" && currentFunction) {
        currentFunction.returns.push(nodeText(code, node.argument) || "sem valor");
      }

      if (node.type === "ReturnStatement") {
        foundConcepts.add("return");
        addFlow("return", `Retorna ${nodeText(code, node.argument) || "sem valor"}`, node);
      }

      if (node.type === "IfStatement" || node.type === "SwitchStatement") {
        const concept = node.type === "IfStatement" ? "if" : "switch";
        foundConcepts.add(concept);
        addFlow("decision", `Decide com ${concept}`, node);
      }

      if (["ForStatement", "ForInStatement", "ForOfStatement", "WhileStatement", "DoWhileStatement"].includes(node.type)) {
        const concept = node.type.startsWith("For") ? "for" : "while";
        foundConcepts.add(concept);
        addFlow("loop", `Repete com ${concept}`, node);
      }

      if (node.type === "ArrayExpression") foundConcepts.add("arrays");
      if (node.type === "ObjectExpression") foundConcepts.add("objetos");

      for (const [key, value] of Object.entries(node)) {
        if (["type", "loc", "start", "end", "leadingComments", "trailingComments", "innerComments"].includes(key)) continue;
        if (Array.isArray(value) || isNode(value)) walk(value, currentFunction);
      }
    };

    walk(ast);
  } catch (error) {
    const syntaxError = error as Error & { loc?: { line: number; column: number } };
    diagnostics.push({
      kind: "syntax",
      message: syntaxError.message,
      line: syntaxError.loc?.line,
      column: syntaxError.loc?.column,
    });
  }

  const module = labModules.find(item => item.id === moduleId);
  const expectedConcepts: readonly string[] = module?.concepts ?? [];
  const conceptNames = [...new Set([...expectedConcepts, ...foundConcepts])];
  const concepts = conceptNames.map(name => ({
    name,
    found: foundConcepts.has(name),
    expected: expectedConcepts.includes(name),
  }));
  const functionLabel = functions.length === 1 ? "1 função" : `${functions.length} funções`;
  const variableLabel = variables.length === 1 ? "1 variável" : `${variables.length} variáveis`;
  const summary = diagnostics.some(item => item.kind === "syntax")
    ? ["A análise encontrou um erro de sintaxe. Corrija o ponto indicado antes de interpretar o fluxo."]
    : [`O código possui ${functionLabel} e ${variableLabel}.`, flow.length ? `Foram inferidas ${flow.length} etapas estruturais sem executar o programa.` : "Nenhuma etapa executável foi identificada."];
  const firstFunction = functions[0];
  const firstVariable = variables[0];
  const question = firstFunction
    ? {
        prompt: `Qual é o papel do return na função ${firstFunction.name}?`,
        answer: firstFunction.returns.length ? firstFunction.returns.join(" ou ") : "A função ainda não possui retorno explícito.",
        explanation: "return encerra a execução da função e entrega um valor para o ponto que realizou a chamada.",
      }
    : firstVariable
      ? {
          prompt: `Qual responsabilidade a variável ${firstVariable.name} possui neste código?`,
          answer: firstVariable.initialValue ? `Ela começa com ${firstVariable.initialValue}.` : "Seu valor é definido durante a execução.",
          explanation: `A declaração ${firstVariable.declaration} associa um nome a um valor no escopo ${firstVariable.scope}.`,
        }
      : null;

  return { sourceVersion: sourceVersion(code), moduleId, summary, concepts, variables, functions, flow, diagnostics, question };
}

export function evaluateJavaScript(code: string) {
  const checks = [
    { ok: /\b(function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>|const\s+\w+\s*=\s*\w+\s*=>)/.test(code), label: "Função JavaScript identificada" },
    { ok: /\b(let|const)\s+\w+/.test(code), label: "Variável com let ou const encontrada" },
    { ok: /\b(if|switch|for|while)\b/.test(code), label: "Estrutura lógica encontrada" },
    { ok: /console\.log\s*\(/.test(code), label: "Saída com console.log encontrada" },
    { ok: (code.match(/\{/g)?.length ?? 0) === (code.match(/\}/g)?.length ?? 0), label: "Chaves balanceadas" },
    { ok: !/System\.out|public\s+static|\bint\s+\w+|\bdouble\s+\w+/.test(code), label: "Sem sintaxe Java misturada" }
  ];
  const score = Math.round(checks.filter(c => c.ok).length / checks.length * 100);
  return { checks, score };
}
