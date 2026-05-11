/**
 * A "track" is a real-world song we recreate across the curriculum. Each
 * track is built up in stages: first the drums, then later the bass, then
 * chords, etc. Each stage is introduced in a specific lesson — so a track
 * acts as a thread that weaves through several lessons.
 */
export interface Track {
  /** Stable id, used in URLs and lookups. */
  id: string;
  title: string;
  artist: string;
  year?: number;
  /** YouTube video id (the part after `?v=`). */
  youtubeId: string;
  /** Tempo in beats per minute. */
  tempo: number;
  /** How many beats one cycle of the pattern covers — used to derive cpm. */
  beatsPerCycle: number;
  /** Musical key, e.g. "F# minor". Optional. */
  key?: string;
  /** Free-form notes about the production. */
  notes?: string;
  /** Stages of building up this track. Ordered by introduction in lessons. */
  stages: TrackStage[];
}

export interface TrackStage {
  /** Unique within the parent track, e.g. "drums", "with-bass". */
  id: string;
  /** Human-friendly label. */
  label: string;
  /** Slug of the lesson where this stage is introduced. */
  lesson: string;
  /** What this stage adds compared to the previous one. */
  description?: string;
  /** Strudel code for this stage. */
  code: string;
}
