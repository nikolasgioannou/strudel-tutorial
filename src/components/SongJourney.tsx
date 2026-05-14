import { Link } from 'react-router';
import { findTrack } from '../tracks';
import { lessons } from '../lessons';

interface Props {
  /** Track id whose journey to display. */
  trackId: string;
  /** Slug of the lesson currently being viewed. Marks itself as the current step. */
  currentLessonSlug: string;
}

interface JourneyStep {
  lessonSlug: string;
  lessonTitle: string;
  lessonOrder: number;
  stageLabel: string;
  position: 'past' | 'current' | 'future';
}

/**
 * Breadcrumb-style view of a song's path through the curriculum. When a song
 * is built up across multiple lessons (e.g. Billie Jean: drums → +bass → +
 * variations), this shows the user "you did X earlier; you're adding Y here;
 * you'll get to Z later." Past lessons link back, future lessons are previews,
 * the current one is highlighted.
 */
export function SongJourney({ trackId, currentLessonSlug }: Props) {
  const track = findTrack(trackId);
  if (!track) return null;

  // Order the stages by lesson order so the spiral makes sense visually.
  const steps: JourneyStep[] = track.stages
    .map((stage) => {
      const lesson = lessons.find((l) => l.slug === stage.lesson);
      if (!lesson) return null;
      return {
        lessonSlug: lesson.slug,
        lessonTitle: lesson.title,
        lessonOrder: lesson.order,
        stageLabel: stage.label,
        position:
          stage.lesson === currentLessonSlug
            ? ('current' as const)
            : lesson.order < (lessons.find((l) => l.slug === currentLessonSlug)?.order ?? 0)
              ? ('past' as const)
              : ('future' as const),
      };
    })
    .filter((s): s is JourneyStep => s !== null)
    .sort((a, b) => a.lessonOrder - b.lessonOrder);

  // Only show the breadcrumb if the song actually appears in multiple lessons.
  // For a one-shot song, this would just be the current lesson — useless.
  if (steps.length < 2) return null;

  return (
    <nav
      aria-label="Song journey"
      className="rounded-md border border-neutral-800 bg-neutral-900/40 p-3 text-xs"
    >
      <header className="mb-2 font-mono tracking-wider text-neutral-500 uppercase">
        This song across the curriculum
      </header>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {steps.map((step, idx) => (
          <li key={step.lessonSlug} className="flex items-center gap-2">
            <StepLabel step={step} />
            {idx < steps.length - 1 && <span className="text-neutral-700">→</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function StepLabel({ step }: { step: JourneyStep }) {
  const lessonBadge = `Lesson ${String(step.lessonOrder).padStart(2, '0')}`;
  if (step.position === 'current') {
    return (
      <span className="rounded bg-brand-700/30 px-2 py-0.5 text-brand-300">
        <span className="font-mono">{lessonBadge}</span>{' '}
        <span className="text-brand-100">{step.stageLabel}</span>
      </span>
    );
  }
  if (step.position === 'past') {
    return (
      <Link
        to={`/lessons/${step.lessonSlug}`}
        className="rounded px-2 py-0.5 text-neutral-400 transition hover:bg-neutral-800 hover:text-brand-300"
      >
        <span className="font-mono">{lessonBadge}</span>{' '}
        <span className="text-neutral-500">{step.stageLabel}</span>
      </Link>
    );
  }
  return (
    <span className="rounded px-2 py-0.5 text-neutral-600">
      <span className="font-mono">{lessonBadge}</span> <span>{step.stageLabel}</span>
    </span>
  );
}
