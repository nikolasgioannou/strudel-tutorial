import type { FC } from 'react';
import * as lesson01 from './01-first-sounds';
import * as lesson02 from './02-we-will-rock-you';
import * as lesson03 from './03-subdividing-time';
import * as lesson04 from './04-billie-jean';

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
];

export function findLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}
