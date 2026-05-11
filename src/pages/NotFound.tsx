import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="space-y-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-neutral-200">Lesson not found</h1>
      <p className="text-neutral-500">That lesson doesn't exist yet.</p>
      <Link to="/" className="inline-block text-brand-300 hover:text-brand-500">
        ← Back to all lessons
      </Link>
    </div>
  );
}
