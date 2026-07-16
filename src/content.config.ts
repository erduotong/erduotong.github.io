import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
	loader: glob({
		base: './content/blog',
		pattern: '**/*.md',
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updateDate: z.coerce.date().optional(),
		tags: z.array(z.string()),
		category: z.string(),
		series: z.string().optional(),
		slug: z.string(),
	}),
})
// noinspection JSUnusedGlobalSymbols
export const collections = { blog }
