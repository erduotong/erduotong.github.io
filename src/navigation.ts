interface BaseNavigationItem {
	name: string
	// lucide icon
	icon?: string
}

interface LinkItem extends BaseNavigationItem {
	href: string
	children?: never
}

interface DropdownItem extends BaseNavigationItem {
	children: BaseNavigationItem[]
	href: never
}

export type NavigationItem = LinkItem | DropdownItem

export const Navigation: NavigationItem[] = [
	{
		name: '主页',
		href: '/',
	},
] as const
