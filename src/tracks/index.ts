import type { Track, TrackStage } from './types';
import { weWillRockYou } from './we-will-rock-you';
import { billieJean } from './billie-jean';
import { sevenNationArmy } from './seven-nation-army';
import { standByMe } from './stand-by-me';
import { aroundTheWorld } from './around-the-world';
import { amenBreak } from './amen-break';

export type { Track, TrackStage } from './types';

export const tracks: Track[] = [
  weWillRockYou,
  billieJean,
  sevenNationArmy,
  standByMe,
  aroundTheWorld,
  amenBreak,
];

export function findTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

/** Look up a (track, stage) pair by their ids. */
export function findStage(
  trackId: string,
  stageId: string,
): { track: Track; stage: TrackStage } | undefined {
  const track = findTrack(trackId);
  const stage = track?.stages.find((s) => s.id === stageId);
  if (!track || !stage) return undefined;
  return { track, stage };
}

/**
 * Like `find` but throws if the stage is missing. Used by lessons that
 * statically reference a stage they expect to exist — turns a silent
 * "undefined" bug into a loud error at module load time.
 */
export function requireStage(track: Track, stageId: string): TrackStage {
  const stage = track.stages.find((s) => s.id === stageId);
  if (!stage) {
    throw new Error(`Stage "${stageId}" missing from track "${track.id}"`);
  }
  return stage;
}
