"use client";

import { useState, useEffect } from "react";

export function TextToSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  function toggle() {
    if (!supported) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const article = document.querySelector(".prose");
    if (!article) return;

    const text = article.textContent || "";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    utterance.onend = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-yellow-600"
      aria-label={speaking ? "Stop reading" : "Read aloud"}
    >
      {speaking ? "⏸ Stop" : "🔊 Listen"}
    </button>
  );
}