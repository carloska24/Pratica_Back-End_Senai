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
