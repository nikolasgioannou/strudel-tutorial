import { useParams, Link } from 'react-router';
import { findLesson, lessons } from '../lessons';
import { NotFound } from './NotFound';

/**
 * Looks up a lesson by slug and renders its component. If no match,
 * shows the NotFound page rather than throwing.
 */
export function LessonPage() {
  const { slug } = useParams<{ slug: string }>();
  const lesson = slug ? findLesson(slug) : undefined;

  if (!lesson) return <NotFound />;

  const idx = lessons.indexOf(lesson);
  const prev = idx > 0 ? lessons[idx - 1] : undefined;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : undefined;
  const LessonBody = lesson.Component;
  const showFooterNav = prev || next;

  return (
    <article className="space-y-8">
      <header>
        {/* Breadcrumb replaces the old "Lesson 01" badge + footer "All lessons" link. */}
        <nav className="font-mono text-sm" aria-label="Breadcrumb">
          <Link to="/" className="text-neutral-500 transition hover:text-brand-300">
            All lessons
          </Link>
          <span className="mx-2 text-neutral-700">/</span>
          <span className="text-brand-300">Lesson {String(lesson.order).padStart(2, '0')}</span>
        </nav>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-50">{lesson.title}</h1>
        <p className="mt-2 text-neutral-400">{lesson.blurb}</p>
      </header>

      <LessonBody />

      {showFooterNav && (
        <nav className="flex items-center justify-between border-t border-neutral-900 pt-6 text-sm">
          {prev ? (
            <Link to={`/lessons/${prev.slug}`} className="text-neutral-400 hover:text-brand-300">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/lessons/${next.slug}`} className="text-neutral-400 hover:text-brand-300">
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </article>
  );
}
