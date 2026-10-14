interface Props {
  title: string;
  description: string;
  slug: string;
}

export function SEOPreview({ title, description, slug }: Props) {
  const url = `buzzscoop.news › blog › ${slug || "your-article"}`;
  const titleTrimmed = title.length > 60 ? title.slice(0, 60) + "..." : title;
  const descTrimmed = description.length > 160 ? description.slice(0, 160) + "..." : description;

  return (
    <div className="bg-white rounded-xl border p-5">
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">📊 Google Preview</h3>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>🔒</span>
          <span>{url}</span>
        </div>
        <h4 className="text-blue-700 hover:underline text-lg leading-tight cursor-pointer">
          {titleTrimmed || "Your Article Title Will Appear Here"}
        </h4>
        <p className="text-sm text-gray-600 leading-snug">
          {descTrimmed || "Your meta description will appear here. Keep it under 160 characters for best results."}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">Title length:</span>
          <span className={title.length > 60 ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
            {title.length}/60
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Description length:</span>
          <span className={description.length > 160 ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
            {description.length}/160
          </span>
        </div>
      </div>
    </div>
  );
}