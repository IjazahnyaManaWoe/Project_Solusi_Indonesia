import { TextIcon, VideoIcon } from "@/components/icons";
import type { ModuleType } from "@/lib/modules";

export function TypeBadge({ type }: { type: ModuleType }) {
  const isVideo = type === "video";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        isVideo
          ? "bg-accent-soft text-accent"
          : "bg-brand-soft text-brand"
      }`}
    >
      {isVideo ? (
        <VideoIcon className="h-4 w-4" />
      ) : (
        <TextIcon className="h-4 w-4" />
      )}
      {isVideo ? "Video" : "Teks"}
    </span>
  );
}
