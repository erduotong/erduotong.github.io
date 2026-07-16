import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { intoShortLink } from '@/lib/shortLink.ts'

const generatedIds = new Set<string>()

const blog = defineCollection({
	loader: glob({
		base: './content/blog',
		pattern: '**/*.md',
		// 32位的permalink太长了，需要缩短方便阅读
		generateId: ({ data }) => {
			const permalink = z.string().parse(data.permalink)
			const shortId = intoShortLink(permalink)

			// 防碰撞防线：如果发生哈希碰撞，抛出错误中断构建，避免数据静默丢失
			if (generatedIds.has(shortId)) {
				throw new Error(
					`[Blog] 发生短链碰撞: ${shortId}, Permalink: ${permalink}, Data: ${JSON.stringify(data, null, 2)}`,
				)
			}
			generatedIds.add(shortId)
			return shortId
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
		permalink: z.string().length(32, '必须为32个字符'),
	}),
})
// noinspection JSUnusedGlobalSymbols
export const collections = { blog }
