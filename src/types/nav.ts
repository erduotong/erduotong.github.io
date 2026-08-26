export interface NavLinkItem {
	type: 'link'
	title: string
	href: string
}

export interface NavLeafItem {
	title: string
	href: string
}

export interface NavMenuGroup {
	type: 'menu'
	title: string
	children: NavLeafItem[]
}

export type NavItem = NavLinkItem | NavMenuGroup
