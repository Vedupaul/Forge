"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[520px] items-center justify-center bg-[#111512] text-sm text-[#aebbb4]">
      Loading editor...
    </div>
  ),
});

export function CodeEditor({
  path,
  language,
  content,
}: {
  path: string;
  language: string;
  content: string;
}) {
  return (
    <MonacoEditor
      key={path}
      height="520px"
      language={language === "tsx" ? "typescript" : language}
      value={content}
      theme="vs-dark"
      options={{
        readOnly: false,
        minimap: { enabled: false },
        fontSize: 12,
        fontLigatures: true,
        lineHeight: 22,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
      }}
    />
  );
}
