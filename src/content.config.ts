import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
	loader: glob({
		base: './content/blog',
		pattern: '**/*.{md}',
		// 32位的permalink太长了，需要缩短
		generateId: ({ data }) => {
			console.log(data)
			return '123'
		},
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updateDate: z.coerce.date().optional(),
		tags: z.array(z.string()),
		category: z.string(),
		series: z.string().optional(),
		permalink: z.string(),
	}),
})
export const collections = { blog }
