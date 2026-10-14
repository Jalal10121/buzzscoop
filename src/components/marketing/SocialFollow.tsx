const SOCIALS = [
  {
    name: "Twitter / X",
    handle: "@buzzscoop",
    url: "https://twitter.com/buzzscoop",
    icon: "𝕏",
    color: "hover:bg-black hover:text-white",
  },
  {
    name: "Instagram",
    handle: "@buzzscoop",
    url: "https://instagram.com/buzzscoop",
    icon: "📷",
    color: "hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white",
  },
  {
    name: "YouTube",
    handle: "@buzzscoop",
    url: "https://youtube.com/@buzzscoop",
    icon: "▶️",
    color: "hover:bg-red-600 hover:text-white",
  },
  {
    name: "Facebook",
    handle: "BuzzScoop",
    url: "https://facebook.com/buzzscoop",
    icon: "f",
    color: "hover:bg-blue-600 hover:text-white",
  },
  {
    name: "TikTok",
    handle: "@buzzscoop",
    url: "https://tiktok.com/@buzzscoop",
    icon: "🎵",
    color: "hover:bg-black hover:text-white",
  },
  {
    name: "Telegram",
    handle: "@buzzscoop",
    url: "https://t.me/buzzscoop",
    icon: "✈️",
    color: "hover:bg-sky-500 hover:text-white",
  },
  {
    name: "WhatsApp",
    handle: "BuzzScoop",
    url: "https://whatsapp.com/channel/buzzscoop",
    icon: "💬",
    color: "hover:bg-green-500 hover:text-white",
  },
];

export function SocialFollow({ variant = "footer" }: { variant?: "footer" | "inline" }) {
  if (variant === "inline") {
    return (
      <div className="my-8 p-6 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-black">📢 Follow BuzzScoop</h3>
          <p className="text-sm text-gray-600 mt-1">
            Join 100,000+ fans getting daily entertainment scoops
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SOCIALS.slice(0, 4).map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg transition ${s.color}`}
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs font-bold">{s.name}</span>
              <span className="text-xs text-gray-500">{s.handle}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {SOCIALS.slice(0, 5).map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          className={`w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-white text-sm transition ${s.color}`}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}