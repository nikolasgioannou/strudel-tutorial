import type { Track } from '../tracks';

interface Props {
  track: Track;
}

/**
 * Visual card for a real-world song we're recreating. Renders the title,
 * artist, tempo / key / year metadata, and the embedded official video.
 *
 * The card owns both pieces of chrome — outer border + rounded corners and
 * a divider between metadata and video — so the iframe stays a bare
 * aspect-ratio container with no styling of its own.
 */
export function SongCard({ track }: Props) {
  const meta = [track.year && String(track.year), `${track.tempo} BPM`, track.key]
    .filter(Boolean)
    .join(' · ');

  // youtube-nocookie keeps tracking minimal compared to the default embed host.
  const src = `https://www.youtube-nocookie.com/embed/${track.youtubeId}`;

  return (
    <div className="overflow-hidden rounded-md border border-neutral-800 bg-neutral-900">
      <div className="px-4 py-3">
        <div className="font-mono text-xs tracking-wider text-neutral-500 uppercase">The song</div>
        <div className="mt-1 text-base font-semibold text-neutral-100">
          {track.title}
          <span className="ml-2 font-normal text-neutral-400">— {track.artist}</span>
        </div>
        <div className="mt-1 text-xs text-neutral-500">{meta}</div>
      </div>
      <div className="aspect-video border-t border-neutral-800 bg-black">
        <iframe
          src={src}
          title={`${track.artist} — ${track.title}`}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
