import type { FC } from 'react';
import * as lesson01 from './01-first-sounds';
import * as lesson02 from './02-we-will-rock-you';
import * as lesson03 from './03-subdividing-time';
import * as lesson04 from './04-billie-jean';
import * as lesson05 from './05-seven-nation-army';
import * as lesson06 from './06-scales';
import * as lesson07 from './07-billie-jean-bass';
import * as lesson08 from './08-note-durations';
import * as lesson09 from './09-filters-and-envelopes';
import * as lesson10 from './10-pattern-transforms';
import * as lesson11 from './11-chords-stand-by-me';
import * as lesson12 from './12-every-and-off';
import * as lesson13 from './13-signals-and-modulation';
import * as lesson14 from './14-probability';
import * as lesson15 from './15-reverb-and-delay';
import * as lesson16 from './16-sample-chopping';
import * as lesson17 from './17-full-song-sweet-dreams';

/** Metadata that every lesson exports alongside its component. */
export interface LessonMeta {
  slug: string;
  title: string;
  blurb: string;
  order: number;
}

export interface Lesson extends LessonMeta {
  Component: FC;
}

/**
 * Registry of all lessons in display order. Adding a lesson is two steps:
 *   1. Create `src/lessons/NN-name.tsx` that exports `meta` and `Lesson`.
 *   2. Import it here and append to the array.
 */
export const lessons: Lesson[] = [
  { ...lesson01.meta, Component: lesson01.Lesson },
  { ...lesson02.meta, Component: lesson02.Lesson },
  { ...lesson03.meta, Component: lesson03.Lesson },
  { ...lesson04.meta, Component: lesson04.Lesson },
  { ...lesson05.meta, Component: lesson05.Lesson },
  { ...lesson06.meta, Component: lesson06.Lesson },
  { ...lesson07.meta, Component: lesson07.Lesson },
  { ...lesson08.meta, Component: lesson08.Lesson },
  { ...lesson09.meta, Component: lesson09.Lesson },
  { ...lesson10.meta, Component: lesson10.Lesson },
  { ...lesson11.meta, Component: lesson11.Lesson },
  { ...lesson12.meta, Component: lesson12.Lesson },
  { ...lesson13.meta, Component: lesson13.Lesson },
  { ...lesson14.meta, Component: lesson14.Lesson },
  { ...lesson15.meta, Component: lesson15.Lesson },
  { ...lesson16.meta, Component: lesson16.Lesson },
  { ...lesson17.meta, Component: lesson17.Lesson },
];

export function findLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}
