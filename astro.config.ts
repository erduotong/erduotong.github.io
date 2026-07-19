import { unified } from '@astrojs/markdown-remark'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'
// vite和typescript奇怪的兼容性问题
// @ts-expect-error
// noinspection ES6PreferShortImport
import { remarkReadingTime } from './src/lib/remarkReadingTime'

// https://astro.build/config
export default defineConfig({
	site: 'https://erduotong.com',
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [vue(), sitemap()],
	trailingSlash: 'always',
	markdown: {
		processor: unified({
			remarkPlugins: [remarkReadingTime],
		}),
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'InterVariable',
			cssVariable: '--font-inter',
			options: {
				variants: [
					{
						weight: '100 900',
						style: 'normal',
						src: ['./src/assets/fonts/InterVariable.woff2'],
					},
				],
			},
		},
	],
})
