"use client";

import { useRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insert(before: string, after: string = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newText = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  }

  const toolbar = [
    { label: "B", title: "Bold", action: () => insert("**", "**") },
    { label: "I", title: "Italic", action: () => insert("*", "*") },
    { label: "H2", title: "Heading 2", action: () => insert("\n## ", "\n") },
    { label: "H3", title: "Heading 3", action: () => insert("\n### ", "\n") },
    { label: "🔗", title: "Link", action: () => insert("[", "](https://)") },
    { label: "•", title: "Bullet", action: () => insert("\n- ", "") },
    { label: "1.", title: "Numbered", action: () => insert("\n1. ", "") },
    { label: "❝", title: "Quote", action: () => insert("\n> ", "\n") },
    { label: "`", title: "Code", action: () => insert("`", "`") },
    { label: "🖼", title: "Image", action: () => insert("![alt](", ")") },
    { label: "—", title: "Divider", action: () => insert("\n---\n", "") },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
        {toolbar.map((t) => (
          <button
            key={t.title}
            type="button"
            onClick={t.action}
            title={t.title}
            className="px-3 py-1.5 text-sm font-bold rounded hover:bg-yellow-400 hover:text-black transition"
          >
            {t.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 self-center px-2">
          {value.length} chars • {value.split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={20}
        className="w-full p-4 focus:outline-none font-mono text-sm"
        placeholder="Write your article... Markdown supported"
      />
    </div>
  );
}