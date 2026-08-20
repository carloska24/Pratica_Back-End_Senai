"use client";

import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  ariaLabel?: string;
  maxHeight?: number;
};

export default function CodeViewer({ code, ariaLabel = "Código JavaScript da aula", maxHeight = 620 }: Props) {
  const lineCount = code.split("\n").length;
  const height = Math.min(maxHeight, Math.max(190, lineCount * 25 + 30));

  return (
    <div className="monaco-viewer" aria-label={ariaLabel} style={{ height }}>
      <Editor
        height="100%"
        language="javascript"
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 25,
          lineNumbersMinChars: 3,
          folding: false,
          glyphMargin: false,
          renderLineHighlight: "none",
          scrollBeyondLastLine: false,
          overviewRulerLanes: 0,
          padding: { top: 14, bottom: 14 },
          wordWrap: "on",
          scrollbar: {
            alwaysConsumeMouseWheel: false,
            horizontalScrollbarSize: 8,
            verticalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}
