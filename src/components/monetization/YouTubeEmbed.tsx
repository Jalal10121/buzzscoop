interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export function YouTubeEmbed({ videoId, title = "Watch on YouTube" }: YouTubeEmbedProps) {
  return (
    <div className="my-8">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full"
        />
      </div>
      <p className="text-center text-sm text-gray-500 mt-3">
        🎥 Subscribe to our{" "}
        <a
          href="https://youtube.com/@buzzscoop"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 font-bold hover:underline"
        >
          YouTube channel
        </a>{" "}
        for more!
      </p>
    </div>
  );
}