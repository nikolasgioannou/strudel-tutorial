import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/** App shell — just centers the page content; no chrome on top or bottom. */
export function Layout({ children }: Props) {
  return <main className="mx-auto w-full max-w-3xl px-6 py-10">{children}</main>;
}
