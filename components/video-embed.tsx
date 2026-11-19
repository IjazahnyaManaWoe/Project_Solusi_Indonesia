export function VideoEmbed({
  embedUrl,
  title,
}: {
  embedUrl: string;
  title: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-black">
      <div className="aspect-video w-full">
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
