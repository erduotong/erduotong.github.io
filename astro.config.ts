import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	site: 'https://erduotong.com',
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [vue(), sitemap()],
	trailingSlash: 'always',
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
