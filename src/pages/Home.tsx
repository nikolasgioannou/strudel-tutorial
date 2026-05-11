import { Link } from 'react-router';
import { lessons } from '../lessons';

/** Lists every available lesson. The lessons array is the single source of truth. */
export function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
          Learn Strudel by playing
        </h1>
        <p className="mt-3 text-neutral-400">
          Strudel is a live-coding music environment that runs entirely in your browser. In these
          short lessons, you'll write code that plays sound — and you'll hear the change instantly
          when you edit it.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium tracking-wider text-neutral-500 uppercase">
          Lessons
        </h2>
        <ol className="space-y-2">
          {lessons.map((lesson) => (
            <li key={lesson.slug}>
              <Link
                to={`/lessons/${lesson.slug}`}
                className="card flex items-baseline gap-4 transition hover:border-brand-700"
              >
                <span className="font-mono text-sm text-brand-300">
                  {String(lesson.order).padStart(2, '0')}
                </span>
                <span>
                  <div className="font-medium text-neutral-100">{lesson.title}</div>
                  <div className="text-sm text-neutral-400">{lesson.blurb}</div>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
