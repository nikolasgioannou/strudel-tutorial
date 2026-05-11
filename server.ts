// Dev/prod server. `bun --hot ./server.ts` enables HMR via the development flag.
// In production (`bun run start`) the dev flag falls back to false automatically.
import index from './index.html';

const isProd = process.env.NODE_ENV === 'production';

const server = Bun.serve({
  routes: {
    // Single-page app: every route falls through to the HTML entry. The React
    // router takes over client-side.
    '/': index,
    '/*': index,
  },

  development: !isProd && {
    hmr: true,
    console: true, // pipe browser console into the terminal — handy for debugging
  },

  port: Number(process.env.PORT ?? 3000),

  fetch() {
    return new Response('Not found', { status: 404 });
  },
});

console.info(`Listening on ${server.url}`);
