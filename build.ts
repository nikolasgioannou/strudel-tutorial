// Production build. `bun build` CLI doesn't yet load plugins from bunfig.toml,
// so we call Bun.build() directly and pass the Tailwind plugin explicitly.
import tailwind from 'bun-plugin-tailwind';

const result = await Bun.build({
  entrypoints: ['./index.html'],
  outdir: './dist',
  minify: true,
  sourcemap: 'linked',
  plugins: [tailwind],
});

if (!result.success) {
  console.error('Build failed:');
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

console.info(`Built ${result.outputs.length} files to ./dist`);
