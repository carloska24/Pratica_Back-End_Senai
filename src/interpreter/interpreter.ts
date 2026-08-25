import { parse } from "@babel/parser";
import type {
  CallFrameSnapshot,
  ConsoleEntry,
  ExecutionTrace,
  InterpreterLimits,
  RuntimeDisplayValue,
  RuntimePrimitive,
  TraceOperation,
  TraceSnapshot,
  VariableSnapshot,
} from "./contracts";

type AstNode = {
  type: string;
  start?: number | null;
  end?: number | null;
  loc?: { start: { line: number }; end: { line: number } } | null;
  [key: string]: unknown;
};

type Binding = {
  declaration: VariableSnapshot["declaration"];
  scope: string;
  value: RuntimePrimitive | FunctionValue;
};

type FunctionValue = {
  kind: "function";
  name: string;
  params: string[];
  body: AstNode;
};

type ReturnSignal = { returned?: true; value?: RuntimePrimitive; broken?: true };

const DEFAULT_LIMITS: InterpreterLimits = {
  maxSteps: 1_000,
  maxDurationMs: 2_000,
  maxCallDepth: 32,
};

function isNode(value: unknown): value is AstNode {
  return Boolean(value && typeof value === "object" && "type" in value);
}

function assertSafeAst(root: AstNode) {
  const forbiddenCalls = new Set(["eval", "Function", "fetch", "XMLHttpRequest", "WebSocket", "setTimeout", "setInterval"]);
  const forbiddenGlobals = new Set(["document", "window", "globalThis", "process", "localStorage", "sessionStorage", "navigator"]);
  const forbiddenNodes = new Set(["ImportExpression", "NewExpression", "AwaitExpression", "YieldExpression", "WithStatement"]);

  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!isNode(value)) return;
    if (forbiddenNodes.has(value.type)) throw new Error(`FORBIDDEN_CAPABILITY:${value.type}`);
    if (value.type === "CallExpression" && isNode(value.callee) && value.callee.type === "Identifier" && forbiddenCalls.has(String(value.callee.name))) {
      throw new Error(`FORBIDDEN_CAPABILITY:${String(value.callee.name)}`);
    }
    if (value.type === "MemberExpression" && isNode(value.object) && value.object.type === "Identifier" && forbiddenGlobals.has(String(value.object.name))) {
      throw new Error(`FORBIDDEN_CAPABILITY:${String(value.object.name)}`);
    }
    for (const [key, child] of Object.entries(value)) {
      if (["loc", "start", "end", "type", "leadingComments", "trailingComments", "innerComments"].includes(key)) continue;
      visit(child);
    }
  };
  visit(root);
}

function displayValue(value: RuntimePrimitive | FunctionValue): RuntimeDisplayValue {
  if (typeof value === "undefined") return { type: "undefined", display: "não definido" };
  if (value === null) return { type: "null", display: "null", raw: null };
  if (typeof value === "function" || (typeof value === "object" && value.kind === "function")) {
    return { type: "function", display: `função ${(value as FunctionValue).name}` };
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    const type = typeof value === "string" ? "string" : typeof value === "number" ? "number" : "boolean";
    if (typeof value === "number" && !Number.isFinite(value)) return { type, display: String(value) };
    return { type, display: String(value), raw: value };
  }
  return { type: "undefined", display: "não definido" };
}

export function interpretJavaScript(
  code: string,
  requestedLimits: Partial<InterpreterLimits> = {},
): ExecutionTrace {
  const limits = { ...DEFAULT_LIMITS, ...requestedLimits };
  const startedAt = Date.now();
  const snapshots: TraceSnapshot[] = [];
  const consoleEntries: ConsoleEntry[] = [];
  const globalBindings = new Map<string, Binding>();
  const scopeStack: Array<Map<string, Binding>> = [globalBindings];
  const scopeKinds: Array<"global" | "function" | "block"> = ["global"];
  const scopeNames = ["global"];
  const callStack: CallFrameSnapshot[] = [{ kind: "global", name: "programa", parameters: [] }];

  const lineOf = (node: AstNode) => node.loc?.start.line ?? 1;
  const entryLineOf = (node: AstNode) => {
    if (node.type === "BlockStatement" && Array.isArray(node.body)) {
      const firstStatement = node.body.find(isNode);
      if (firstStatement) return lineOf(firstStatement);
    }
    return lineOf(node);
  };
  const textOf = (node: unknown) => {
    if (!isNode(node) || typeof node.start !== "number" || typeof node.end !== "number") return "";
    return code.slice(node.start, node.end).trim();
  };
  const identifier = (node: unknown) => isNode(node) && node.type === "Identifier" && typeof node.name === "string" ? node.name : "";

  const allVariables = (): VariableSnapshot[] => {
    const result: VariableSnapshot[] = [];
    for (const scope of scopeStack) {
      for (const [name, binding] of scope) {
        if (binding.declaration === "function") continue;
        result.push({
          name,
          declaration: binding.declaration,
          scope: binding.scope,
          value: displayValue(binding.value),
        });
      }
    }
    return result;
  };

  const addSnapshot = (
    operation: TraceOperation,
    node: AstNode,
    details: Partial<Omit<TraceSnapshot, "step" | "operation" | "line" | "variablesBefore" | "variablesAfter" | "callStack" | "console">> & {
      variablesBefore?: VariableSnapshot[];
      variablesAfter?: VariableSnapshot[];
    } = {},
  ) => {
    if (snapshots.length >= limits.maxSteps) throw new Error("STEP_LIMIT");
    if (Date.now() - startedAt > limits.maxDurationMs) throw new Error("TIME_LIMIT");
    const before = details.variablesBefore ?? allVariables();
    const after = details.variablesAfter ?? allVariables();
    snapshots.push({
      step: snapshots.length + 1,
      operation,
      line: lineOf(node),
      source: textOf(node),
      variablesBefore: before.map(item => ({ ...item })),
      variablesAfter: after.map(item => ({ ...item })),
      callStack: callStack.map(frame => ({ ...frame, parameters: frame.parameters.map(parameter => ({ ...parameter })) })),
      console: consoleEntries.map(entry => ({ ...entry, values: entry.values.map(value => ({ ...value })) })),
      ...details,
    });
  };

  const findBinding = (name: string) => {
    for (let index = scopeStack.length - 1; index >= 0; index -= 1) {
      const binding = scopeStack[index].get(name);
      if (binding) return binding;
    }
    return undefined;
  };

  const updateBinding = (name: string, nextValue: RuntimePrimitive, node: AstNode) => {
    const binding = findBinding(name);
    if (!binding) throw new Error(`UNKNOWN_IDENTIFIER:${name}`);
    if (binding.declaration === "const") throw new Error(`CONST_ASSIGNMENT:${name}`);
    const before = allVariables();
    binding.value = nextValue;
    const after = allVariables().map(variable => variable.name === name ? { ...variable, change: "updated" as const } : variable);
    addSnapshot("assign", node, {
      variablesBefore: before,
      variablesAfter: after,
      returnValue: displayValue(nextValue),
      effect: { kind: "declaration", summary: `${name} passa a valer ${displayValue(nextValue).display}.` },
    });
    return nextValue;
  };

  const substitute = (node: AstNode): string => {
    if (node.type === "Identifier") {
      const binding = findBinding(identifier(node));
      return binding ? displayValue(binding.value).display : identifier(node);
    }
    if (node.type === "BinaryExpression" || node.type === "LogicalExpression") {
      return `${substitute(node.left as AstNode)} ${String(node.operator)} ${substitute(node.right as AstNode)}`;
    }
    return textOf(node);
  };

  const evaluate = (node: AstNode): RuntimePrimitive => {
    if (["NumericLiteral", "StringLiteral", "BooleanLiteral"].includes(node.type)) return node.value as RuntimePrimitive;
    if (node.type === "NullLiteral") return null;
    if (node.type === "Identifier") return findBinding(identifier(node))?.value as RuntimePrimitive;
    if (node.type === "TemplateLiteral") {
      const quasis = Array.isArray(node.quasis) ? node.quasis : [];
      const expressions = Array.isArray(node.expressions) ? node.expressions.filter(isNode) : [];
      return quasis.reduce((result, quasi, index) => {
        const cooked = isNode(quasi) && typeof quasi.value === "object" && quasi.value && "cooked" in quasi.value
          ? String((quasi.value as { cooked?: string }).cooked ?? "")
          : "";
        const expression = expressions[index];
        return `${result}${cooked}${expression ? String(evaluate(expression)) : ""}`;
      }, "");
    }
    if (node.type === "UnaryExpression") {
      const value = evaluate(node.argument as AstNode);
      switch (node.operator) {
        case "!": return !value;
        case "+": return Number(value);
        case "-": return -Number(value);
        case "typeof": return typeof value;
        default: throw new Error(`UNSUPPORTED_OPERATOR:${String(node.operator)}`);
      }
    }
    if (node.type === "BinaryExpression" || node.type === "LogicalExpression") {
      const left = evaluate(node.left as AstNode);
      if (node.operator === "&&") return Boolean(left) ? evaluate(node.right as AstNode) : left;
      if (node.operator === "||") return Boolean(left) ? left : evaluate(node.right as AstNode);
      const right = evaluate(node.right as AstNode);
      switch (node.operator) {
        case ">=": return (left as number) >= (right as number);
        case ">": return (left as number) > (right as number);
        case "<=": return (left as number) <= (right as number);
        case "<": return (left as number) < (right as number);
        case "===": return left === right;
        case "!==": return left !== right;
        case "+": return typeof left === "string" || typeof right === "string" ? `${left ?? ""}${right ?? ""}` : Number(left) + Number(right);
        case "-": return Number(left) - Number(right);
        case "*": return Number(left) * Number(right);
        case "/": return Number(left) / Number(right);
        case "%": return Number(left) % Number(right);
        case "**": return Number(left) ** Number(right);
        default: throw new Error(`UNSUPPORTED_OPERATOR:${String(node.operator)}`);
      }
    }
    if (node.type === "AssignmentExpression") {
      const name = identifier(node.left);
      const current = findBinding(name)?.value as RuntimePrimitive;
      const right = evaluate(node.right as AstNode);
      switch (node.operator) {
        case "=": return updateBinding(name, right, node);
        case "+=": return updateBinding(name, typeof current === "string" || typeof right === "string" ? `${current ?? ""}${right ?? ""}` : Number(current) + Number(right), node);
        case "-=": return updateBinding(name, Number(current) - Number(right), node);
        case "*=": return updateBinding(name, Number(current) * Number(right), node);
        case "/=": return updateBinding(name, Number(current) / Number(right), node);
        default: throw new Error(`UNSUPPORTED_OPERATOR:${String(node.operator)}`);
      }
    }
    if (node.type === "UpdateExpression") {
      const name = identifier(node.argument);
      const current = Number(findBinding(name)?.value);
      return updateBinding(name, node.operator === "++" ? current + 1 : current - 1, node);
    }
    if (node.type === "CallExpression") return call(node);
    throw new Error(`UNSUPPORTED_EXPRESSION:${node.type}`);
  };

  const executeBlock = (block: AstNode, createScope = true): ReturnSignal | undefined => {
    if (createScope) {
      scopeStack.push(new Map());
      scopeKinds.push("block");
      scopeNames.push(`bloco L${lineOf(block)}`);
    }
    try {
      const body = Array.isArray(block.body) ? block.body : [];
      for (const statement of body) {
        if (!isNode(statement)) continue;
        const signal = executeStatement(statement);
        if (signal?.returned || signal?.broken) return signal;
      }
      return undefined;
    } finally {
      if (createScope) {
        scopeStack.pop();
        scopeKinds.pop();
        scopeNames.pop();
      }
    }
  };

  const call = (node: AstNode): RuntimePrimitive => {
    const callee = node.callee as AstNode;
    if (callee.type === "MemberExpression" && textOf(callee) === "console.log") {
      const values = (Array.isArray(node.arguments) ? node.arguments : []).filter(isNode).map(evaluate);
      const step = snapshots.length + 1;
      consoleEntries.push({ step, level: "log", text: values.map(value => String(value)).join(" "), values: values.map(displayValue) });
      addSnapshot("console", node, { effect: { kind: "output", summary: "O valor foi enviado para o console." } });
      return undefined;
    }

    const name = identifier(callee);
    if (["eval", "Function", "fetch", "XMLHttpRequest", "WebSocket", "setTimeout", "setInterval"].includes(name)) {
      throw new Error(`FORBIDDEN_CAPABILITY:${name}`);
    }
    const candidate = findBinding(name)?.value;
    if (!candidate || typeof candidate !== "object" || candidate.kind !== "function") throw new Error(`UNKNOWN_FUNCTION:${name}`);
    const fn: FunctionValue = candidate;
    const args = (Array.isArray(node.arguments) ? node.arguments : []).filter(isNode).map(evaluate);
    if (callStack.length >= limits.maxCallDepth) throw new Error("CALL_DEPTH_LIMIT");
    addSnapshot("call", node, { effect: { kind: "call", summary: `A execução entra na função ${name}.`, nextLine: lineOf(fn.body) } });

    const local = new Map<string, Binding>();
    fn.params.forEach((parameter, index) => local.set(parameter, { declaration: "parameter", scope: name, value: args[index] }));
    scopeStack.push(local);
    scopeKinds.push("function");
    scopeNames.push(name);
    callStack.push({
      kind: "function",
      name,
      parameters: fn.params.map((parameter, index) => ({ name: parameter, value: displayValue(args[index]) })),
    });
    const signal = executeBlock(fn.body, false);
    callStack.pop();
    scopeStack.pop();
    scopeKinds.pop();
    scopeNames.pop();
    return signal?.value;
  };

  const executeStatement = (node: AstNode): ReturnSignal | undefined => {
    if (node.type === "FunctionDeclaration") {
      const name = identifier(node.id);
      const params = (Array.isArray(node.params) ? node.params : []).map(identifier);
      globalBindings.set(name, { declaration: "function", scope: "global", value: { kind: "function", name, params, body: node.body as AstNode } });
      addSnapshot("declare", node, { source: `function ${name}(${params.join(", ")})`, effect: { kind: "declaration", summary: `A função ${name} fica disponível para chamadas.` } });
      return undefined;
    }
    if (node.type === "VariableDeclaration") {
      for (const declaration of Array.isArray(node.declarations) ? node.declarations : []) {
        if (!isNode(declaration)) continue;
        const name = identifier(declaration.id);
        let targetIndex = scopeStack.length - 1;
        if (node.kind === "var") {
          for (let index = scopeKinds.length - 1; index >= 0; index -= 1) {
            if (scopeKinds[index] !== "block") { targetIndex = index; break; }
          }
        }
        const scopeName = scopeNames[targetIndex];
        const before = [...allVariables(), { name, declaration: node.kind as "const" | "let" | "var", scope: scopeName, value: displayValue(undefined) }];
        const value = isNode(declaration.init) ? evaluate(declaration.init) : undefined;
        scopeStack[targetIndex].set(name, { declaration: node.kind as "const" | "let" | "var", scope: scopeName, value });
        const after = allVariables().map(variable => variable.name === name && variable.scope === scopeName ? { ...variable, change: "created" as const } : variable);
        addSnapshot("assign", node, { variablesBefore: before, variablesAfter: after, returnValue: displayValue(value), effect: { kind: "declaration", summary: `${node.kind} ${name} recebe ${displayValue(value).display}.` } });
      }
      return undefined;
    }
    if (node.type === "IfStatement") {
      const test = node.test as AstNode;
      const result = Boolean(evaluate(test));
      addSnapshot("condition", node, {
        expression: { source: textOf(test), substituted: substitute(test), result: displayValue(result) },
        effect: {
          kind: "branch",
          summary: result ? "A condição é verdadeira; a execução entra no bloco do if." : "A condição é falsa; a execução segue pelo caminho alternativo.",
          nextLine: result ? entryLineOf(node.consequent as AstNode) : isNode(node.alternate) ? entryLineOf(node.alternate) : node.loc?.end.line,
        },
      });
      const chosen = result ? node.consequent : node.alternate;
      if (isNode(chosen)) return chosen.type === "BlockStatement" ? executeBlock(chosen) : executeStatement(chosen);
      return undefined;
    }
    if (node.type === "SwitchStatement") {
      const discriminant = node.discriminant as AstNode;
      const selectedValue = evaluate(discriminant);
      const cases = (Array.isArray(node.cases) ? node.cases : []).filter(isNode);
      let selectedIndex = cases.findIndex(item => isNode(item.test) && evaluate(item.test) === selectedValue);
      if (selectedIndex < 0) selectedIndex = cases.findIndex(item => !item.test);
      const selectedCase = selectedIndex >= 0 ? cases[selectedIndex] : undefined;
      addSnapshot("condition", node, {
        expression: {
          source: textOf(discriminant),
          substituted: displayValue(selectedValue).display,
          result: displayValue(selectedValue),
        },
        effect: {
          kind: "branch",
          summary: selectedCase && isNode(selectedCase.test)
            ? `O switch escolhe o case ${textOf(selectedCase.test)}.`
            : selectedCase ? "Nenhum case corresponde; o switch escolhe default." : "Nenhum caminho do switch foi encontrado.",
          nextLine: selectedCase ? lineOf(selectedCase) : node.loc?.end.line,
        },
      });
      if (!selectedCase) return undefined;
      for (let index = selectedIndex; index < cases.length; index += 1) {
        const consequent = cases[index].consequent;
        const statements: unknown[] = Array.isArray(consequent) ? consequent : [];
        for (const statement of statements) {
          if (!isNode(statement)) continue;
          const signal = executeStatement(statement);
          if (signal?.broken) return undefined;
          if (signal?.returned) return signal;
        }
      }
      return undefined;
    }
    if (node.type === "ForStatement") {
      if (isNode(node.init)) executeStatement(node.init);
      while (true) {
        const test = isNode(node.test) ? node.test : undefined;
        const result = test ? Boolean(evaluate(test)) : true;
        addSnapshot("loop", test ?? node, {
          expression: {
            source: test ? textOf(test) : "true",
            substituted: test ? substitute(test) : "true",
            result: displayValue(result),
          },
          effect: {
            kind: "branch",
            summary: result ? "A condição do for é verdadeira; começa uma nova iteração." : "A condição do for é falsa; o laço termina.",
            nextLine: result && isNode(node.body) ? entryLineOf(node.body) : node.loc?.end.line,
          },
        });
        if (!result) break;
        if (isNode(node.body)) {
          const signal = node.body.type === "BlockStatement" ? executeBlock(node.body) : executeStatement(node.body);
          if (signal?.returned) return signal;
        }
        if (isNode(node.update)) evaluate(node.update);
      }
      return undefined;
    }
    if (node.type === "WhileStatement" || node.type === "DoWhileStatement") {
      let first = true;
      while (true) {
        const test = node.test as AstNode;
        const result = node.type === "DoWhileStatement" && first ? true : Boolean(evaluate(test));
        first = false;
        addSnapshot("loop", test, {
          expression: { source: textOf(test), substituted: substitute(test), result: displayValue(result) },
          effect: {
            kind: "branch",
            summary: result ? "A condição do laço é verdadeira; começa uma nova iteração." : "A condição do laço é falsa; o laço termina.",
            nextLine: result && isNode(node.body) ? entryLineOf(node.body) : node.loc?.end.line,
          },
        });
        if (!result) break;
        if (isNode(node.body)) {
          const signal = node.body.type === "BlockStatement" ? executeBlock(node.body) : executeStatement(node.body);
          if (signal?.returned) return signal;
        }
        if (node.type === "DoWhileStatement" && !Boolean(evaluate(test))) {
          addSnapshot("loop", test, {
            expression: { source: textOf(test), substituted: substitute(test), result: displayValue(false) },
            effect: { kind: "branch", summary: "A condição do laço é falsa; o laço termina.", nextLine: node.loc?.end.line },
          });
          break;
        }
      }
      return undefined;
    }
    if (node.type === "ReturnStatement") {
      const value = isNode(node.argument) ? evaluate(node.argument) : undefined;
      addSnapshot("return", node, { returnValue: displayValue(value), effect: { kind: "return", summary: `A função devolve ${displayValue(value).display}.` } });
      return { returned: true, value };
    }
    if (node.type === "BreakStatement") return { broken: true };
    if (node.type === "ExpressionStatement" && isNode(node.expression)) {
      evaluate(node.expression);
      return undefined;
    }
    if (node.type === "BlockStatement") return executeBlock(node);
    throw new Error(`UNSUPPORTED_STATEMENT:${node.type}`);
  };

  try {
    const ast = parse(code, { sourceType: "script" }) as unknown as AstNode;
    const program = ast.program as AstNode;
    assertSafeAst(program);
    const programBody = Array.isArray(program.body) ? program.body.filter(isNode) : [];
    addSnapshot("start", program, { source: "Início do programa", effect: { kind: "completion", summary: "A execução pedagógica foi preparada.", nextLine: programBody[0] ? lineOf(programBody[0]) : 1 } });
    executeBlock(program, false);
    callStack.pop();
    addSnapshot("complete", program, { source: "Fim do programa", effect: { kind: "completion", summary: "O programa terminou sem erros." } });
    return { status: "complete", snapshots, console: consoleEntries };
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    const limitExceeded = ["STEP_LIMIT", "TIME_LIMIT", "CALL_DEPTH_LIMIT"].includes(message);
    return {
      status: limitExceeded ? "limit-exceeded" : "error",
      snapshots,
      console: consoleEntries,
      error: { code: message.split(":")[0], message },
    };
  }
}
