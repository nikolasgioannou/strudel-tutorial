import type { FC } from 'react';
// Song-centric curriculum: every lesson is anchored to ONE real song,
// concepts taught through real examples, songs revisited as separate
// lessons (one song per lesson — recurring songs get their own lessons).
import * as lesson01 from './01-we-will-rock-you-drums';
import * as lesson02 from './02-billie-jean-drums';
import * as lesson03 from './03-sunday-bloody-sunday';
import * as lesson04 from './04-seven-nation-army';
import * as lesson05 from './05-seven-nation-army-rhythm';
import * as lesson06 from './06-we-will-rock-you-solo';
import * as lesson07 from './07-smoke-on-the-water';
import * as lesson08 from './08-ode-to-joy';
import * as lesson09 from './09-seven-nation-army-scales';
import * as lesson10 from './10-tetris';
import * as lesson11 from './11-stand-by-me';
import * as lesson12 from './12-billie-jean-full';
import * as lesson13 from './13-take-on-me';
import * as lesson14 from './14-around-the-world';
import * as lesson15 from './15-sweet-dreams-bass';
import * as lesson16 from './16-in-the-air-tonight';
import * as lesson17 from './17-mario-theme';
import * as lesson18 from './18-billie-jean-humanized';
import * as lesson19 from './19-amen-break';
import * as lesson20 from './20-sweet-dreams-full';

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
  { ...lesson18.meta, Component: lesson18.Lesson },
  { ...lesson19.meta, Component: lesson19.Lesson },
  { ...lesson20.meta, Component: lesson20.Lesson },
];

export function findLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}
