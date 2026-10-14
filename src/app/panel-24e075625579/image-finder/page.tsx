"use client";
import { useState, useEffect, useRef } from "react";

const SOURCES = [
  { name: "Unsplash", icon: "📸", color: "bg-black text-white", search: "https://unsplash.com/s/photos/{q}", best: "Real photos", license: "Free" },
  { name: "Pexels", icon: "🎬", color: "bg-teal-600 text-white", search: "https://www.pexels.com/search/{q}/", best: "Lifestyle", license: "Free" },
  { name: "Pixabay", icon: "🖼️", color: "bg-green-600 text-white", search: "https://pixabay.com/images/search/{q}/", best: "General", license: "Free" },
  { name: "Bing AI", icon: "🤖", color: "bg-blue-600 text-white", search: "https://www.bing.com/images/create?q={q}", best: "AI images", license: "Free" },
  { name: "Leonardo", icon: "🎨", color: "bg-purple-600 text-white", search: "https://app.leonardo.ai/ai-generations?prompt={q}", best: "AI art", license: "Free tier" },
  { name: "Netflix", icon: "🎥", color: "bg-red-600 text-white", search: "https://www.netflix.com/tudum", best: "Netflix", license: "Press" },
  { name: "Google", icon: "🔍", color: "bg-gray-700 text-white", search: "https://www.google.com/search?tbm=isch&q={q}", best: "Backup", license: "Check" },
  { name: "Pinterest", icon: "📌", color: "bg-red-500 text-white", search: "https://pinterest.com/search/pins/?q={q}", best: "Trending", license: "Check" },
];

const AI_PROMPTS = [
  { key: "netflix", label: "🎬 Netflix", prompt: "Cinematic Netflix promotional poster, dark moody atmosphere, dramatic red lighting, streaming service thumbnail, editorial quality, 16:9, no text, no logos, no faces" },
  { key: "hollywood", label: "🌟 Hollywood", prompt: "Hollywood red carpet event, paparazzi flash, glamorous, cinematic, professional, silhouettes, no faces, no text, 16:9" },
  { key: "thriller", label: "🔥 Thriller", prompt: "Dark thriller poster, mysterious, dramatic shadows, cinematic, moody blue and red lighting, no faces, no text, 16:9" },
  { key: "romance", label: "💕 Romance", prompt: "Romantic cinematic scene, warm golden hour, soft bokeh, editorial, no faces, no text, 16:9" },
  { key: "music", label: "🎵 Music", prompt: "Concert stage dramatic lighting, atmospheric smoke, cinematic, silhouettes, no faces, no text, 16:9" },
  { key: "action", label: "⚡ Action", prompt: "Action movie poster, dynamic lighting, explosive atmosphere, thriller, 16:9, no text, no faces" },
  { key: "scifi", label: "🚀 Sci-Fi", prompt: "Sci-fi cinematic, futuristic, dramatic neon lighting, editorial, no text, no logos, 16:9" },
  { key: "drama", label: "🎭 Drama", prompt: "Dramatic cinematic scene, moody, warm and cool contrast, editorial, no faces, no text, 16:9" },
];

export default function ImageFinder() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [urlPaste, setUrlPaste] = useState("");
  const [detectedSource, setDetectedSource] = useState("");
  const [customPrompts, setCustomPrompts] = useState<any[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ label: "", prompt: "" });
  const [imageInfo, setImageInfo] = useState<any>(null);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem("buzzscoop-image-searches") || "[]"));
      setFavorites(JSON.parse(localStorage.getItem("buzzscoop-image-favorites") || "[]"));
      setCustomPrompts(JSON.parse(localStorage.getItem("buzzscoop-custom-prompts") || "[]"));
    } catch {}
  }, []);

  function addRecent(term: string) {
    const updated = [term, ...recent.filter(r => r !== term)].slice(0, 8);
    setRecent(updated);
    localStorage.setItem("buzzscoop-image-searches", JSON.stringify(updated));
  }

  function openSource(s: any) {
    const term = (query.trim() || "netflix trending").slice(0, 100);
    addRecent(term);
    window.open(s.search.replace("{q}", encodeURIComponent(term)), "_blank", "noopener");
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  function detectSource(url: string) {
    setUrlPaste(url);
    if (!url) { setDetectedSource(""); return; }
    if (url.includes("unsplash")) setDetectedSource("Unsplash (Free)");
    else if (url.includes("pexels")) setDetectedSource("Pexels (Free)");
    else if (url.includes("pixabay")) setDetectedSource("Pixabay (Free)");
    else if (url.includes("netflix")) setDetectedSource("Netflix (Press)");
    else if (url.includes("bing")) setDetectedSource("Bing AI");
    else if (url.includes("cloudfront") || url.includes("amazonaws")) setDetectedSource("AWS CDN");
    else setDetectedSource("Unknown source");

    // Extract image info
    setImageInfo({ url, source: url.includes("unsplash") ? "Unsplash" : "Unknown" });
  }

  function addFavorite() {
    if (!urlPaste.trim()) return;
    const fav = { url: urlPaste, addedAt: new Date().toISOString(), label: query || "Untitled" };
    const updated = [fav, ...favorites].slice(0, 50);
    setFavorites(updated);
    localStorage.setItem("buzzscoop-image-favorites", JSON.stringify(updated));
    setUrlPaste("");
    setDetectedSource("");
  }

  function removeFavorite(index: number) {
    const updated = favorites.filter((_, i) => i !== index);
    setFavorites(updated);
    localStorage.setItem("buzzscoop-image-favorites", JSON.stringify(updated));
  }

  function addCustomPrompt() {
    if (!newPrompt.label || !newPrompt.prompt) return;
    const updated = [...customPrompts, { ...newPrompt, key: "custom-" + Date.now() }];
    setCustomPrompts(updated);
    localStorage.setItem("buzzscoop-custom-prompts", JSON.stringify(updated));
    setNewPrompt({ label: "", prompt: "" });
    setShowCustomForm(false);
  }

  function removeCustomPrompt(index: number) {
    const updated = customPrompts.filter((_, i) => i !== index);
    setCustomPrompts(updated);
    localStorage.setItem("buzzscoop-custom-prompts", JSON.stringify(updated));
  }

  function saveAllFavorites() {
    const text = favorites.map(f => f.url).join("\n");
    navigator.clipboard.writeText(text);
    setCopied("all-favs");
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black">🎨 Image Finder — Advanced</h1>
        <p className="text-gray-500 text-sm mt-1">12 features — free, no API, unlimited</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border-2 border-yellow-300 p-6 mb-6">
        <label className="block text-sm font-bold mb-2">🔍 Search term</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Netflix Wednesday Season 3..."
            className="flex-1 px-4 py-3 border-2 rounded-lg text-lg font-medium focus:border-yellow-400 focus:outline-none"
            onKeyDown={e => { if (e.key === "Enter") openSource(SOURCES[0]); }}
          />
          <button onClick={() => openSource(SOURCES[0])} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg">🔍 Search</button>
        </div>
        {recent.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-500 mb-2">🕐 Recent:</p>
            <div className="flex flex-wrap gap-2">
              {recent.map((r, i) => (
                <button key={i} onClick={() => setQuery(r)} className="text-xs bg-gray-100 hover:bg-yellow-100 px-3 py-1 rounded-full font-medium">{r}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* URL Detector + Favorites */}
      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-black text-lg mb-3">🔗 URL Detector + Save</h2>
          <input
            type="text"
            value={urlPaste}
            onChange={e => detectSource(e.target.value)}
            placeholder="Paste any image URL here..."
            className="w-full px-4 py-2 border rounded-lg text-sm mb-3"
          />
          {detectedSource && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
              <strong>Source:</strong> {detectedSource}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => copy(urlPaste, "url")}
              disabled={!urlPaste}
              className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 font-bold py-2 rounded-lg text-sm"
            >
              {copied === "url" ? "✅ Copied!" : "📋 Copy URL"}
            </button>
            <button
              onClick={addFavorite}
              disabled={!urlPaste}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-bold py-2 rounded-lg text-sm"
            >
              ⭐ Add to Favorites
            </button>
          </div>
          {urlPaste && (
            <img
              src={urlPaste}
              alt="preview"
              className="mt-3 w-full max-h-40 object-cover rounded border"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-lg">⭐ Favorites ({favorites.length})</h2>
            {favorites.length > 0 && (
              <button onClick={saveAllFavorites} className="text-xs bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-3 py-1 rounded">
                {copied === "all-favs" ? "✅ Copied!" : "📋 Copy All"}
              </button>
            )}
          </div>
          {favorites.length === 0 ? (
            <p className="text-gray-400 text-sm">No favorites yet. Paste URLs to save.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {favorites.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <img src={f.url} alt="" className="w-10 h-10 object-cover rounded" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{f.label}</p>
                    <p className="text-xs text-gray-500 truncate">{f.url}</p>
                  </div>
                  <button onClick={() => copy(f.url, "fav-" + i)} className="text-xs text-blue-600">{copied === "fav-" + i ? "✅" : "📋"}</button>
                  <button onClick={() => removeFavorite(i)} className="text-xs text-red-500">🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sources */}
      <h2 className="font-black text-xl mb-4">🎯 Click to Search</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {SOURCES.map(s => (
          <button key={s.name} onClick={() => openSource(s)} className="text-left bg-white rounded-xl border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg p-4">
            <div className={`${s.color} rounded-lg p-3 flex items-center gap-2 mb-3`}>
              <span className="text-3xl">{s.icon}</span>
              <div>
                <div className="font-black text-sm">{s.name}</div>
                <div className="text-xs opacity-80">{s.license}</div>
              </div>
            </div>
            <p className="text-xs text-gray-600">{s.best}</p>
          </button>
        ))}
      </div>

      {/* AI Prompts */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-xl text-purple-900">🤖 AI Prompts</h2>
          <button onClick={() => setShowCustomForm(!showCustomForm)} className="text-xs bg-purple-500 hover:bg-purple-600 text-white font-bold px-3 py-1.5 rounded">
            {showCustomForm ? "✕ Cancel" : "➕ Add Custom"}
          </button>
        </div>

        {showCustomForm && (
          <div className="bg-white rounded-lg p-4 mb-4 space-y-3">
            <input value={newPrompt.label} onChange={e => setNewPrompt({ ...newPrompt, label: e.target.value })} placeholder="Label (e.g., 🎯 My Style)" className="w-full px-3 py-2 border rounded-lg text-sm" />
            <textarea value={newPrompt.prompt} onChange={e => setNewPrompt({ ...newPrompt, prompt: e.target.value })} placeholder="Full prompt..." rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" />
            <button onClick={addCustomPrompt} className="bg-purple-500 text-white font-bold px-4 py-2 rounded-lg text-sm">Save Prompt</button>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {[...AI_PROMPTS, ...customPrompts].map(p => (
            <div key={p.key} className="bg-white rounded-lg border border-purple-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-purple-900">{p.label}</span>
                <div className="flex gap-1">
                  <button onClick={() => copy(p.prompt, p.key)} className="text-xs bg-purple-500 hover:bg-purple-600 text-white font-bold px-2 py-1 rounded">
                    {copied === p.key ? "✅" : "📋"}
                  </button>
                  {p.key.startsWith("custom-") && (
                    <button onClick={() => removeCustomPrompt(customPrompts.indexOf(p))} className="text-xs bg-red-500 text-white px-2 py-1 rounded">🗑</button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-3">{p.prompt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="font-black text-blue-900 mb-4">📖 Workflow</h2>
        <ol className="space-y-2 text-sm text-blue-800">
          <li><strong>1.</strong> Type search term → Click any source</li>
          <li><strong>2.</strong> Find image → Right-click → Copy Image Address</li>
          <li><strong>3.</strong> Paste in URL Detector above → Auto-detects source</li>
          <li><strong>4.</strong> Click "⭐ Add to Favorites" to save</li>
          <li><strong>5.</strong> "📋 Copy All" to get all URLs at once</li>
          <li><strong>6.</strong> Paste in New Article's Featured Image field</li>
        </ol>
      </div>
    </div>
  );
}