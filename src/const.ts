import type { NavItem } from '@/types/nav.ts'

export const SITE_TITLE = '耳朵同的小站'
export const SITE_DESCRIPTION = '欢迎来到耳朵同的小站'
export const SITE_OWNER = '耳朵同'

export const NAVIGATION = [
	{
		type: 'link',
		title: '博客',
		href: '/blog/',
	},
	{
		type: 'menu',
		title: 'Another',
		children: [
			{
				title: '游记',
				href: '/blog/journal/',
			},
			{
				title: 'astro',
				href: '/blog/astro-intro/',
			},
		],
	},
] satisfies NavItem[]
