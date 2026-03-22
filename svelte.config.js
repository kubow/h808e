import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender: {
			entries: ['/', '/tools', '/tools/astro', '/tools/calc', '/tools/map', '/tools/time'],
			handleHttpError: ({ path, status }) => {
				if (status === 404 && /^\/assets\/\d{3}\.md$/i.test(path)) {
					return;
				}

				throw new Error(`${status} ${path}`);
			}
		}
	}
};

export default config;
