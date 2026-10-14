"use client";
import { useState } from "react";

interface Props {
  title: string;
  content: string;
  onApply: (action: string, result: string) => void;
}

export function AIAssistant({ title, content, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function ask(action: string) {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, title, content }),
      });
      const data = await res.json();
      setResult(data.error || data.result || "No response");
    } catch {
      setResult("Error. Try again.");
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl text-2xl hover:scale-110 transition z-40"
        aria-label="AI Assistant"
      >
        ✨
      </button>

      {open && (
        <div className="fixed bottom-40 right-6 w-96 bg-white rounded-2xl shadow-2xl border z-40 max-h-[600px] flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-black">✨ AI Writing Assistant</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400">✕</button>
          </div>

          <div className="p-4 space-y-2">
            {[
              { key: "headlines", label: "🎯 Generate Headlines" },
              { key: "improve", label: "✨ Improve Writing" },
              { key: "seo", label: "🔍 SEO Suggestions" },
              { key: "summary", label: "📝 Summarize" },
              { key: "expand", label: "📖 Expand Content" },
            ].map((a) => (
              <button key={a.key} onClick={() => ask(a.key)} disabled={loading}
                className="w-full text-left px-3 py-2 rounded-lg border hover:bg-purple-50 hover:border-purple-300 text-sm font-medium disabled:opacity-50">
                {a.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="p-4 text-center">
              <div className="animate-pulse text-purple-500 font-bold">✨ AI thinking...</div>
            </div>
          )}

          {result && !loading && (
            <div className="flex-1 overflow-y-auto p-4 border-t">
              <div className="text-xs font-bold text-gray-500 mb-2">RESULT</div>
              <div className="text-sm whitespace-pre-wrap bg-purple-50 p-3 rounded-lg">{result}</div>
              <button onClick={() => onApply("", result)}
                className="mt-3 w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg text-sm">
                📋 Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}