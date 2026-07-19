import { toString as markdownToString } from 'mdast-util-to-string'
import getReadingTime from 'reading-time'

/**
 * 统计阅读时间的remark插件
 *
 * Why: Astro需要把frontmatter存在data.astro.frontmatter内，所以npm上的reading time插件
 * 注入的data.readingTime属性无法在页面内被访问。需要单独写一个插件来处理这个逻辑
 */
export function remarkReadingTime() {
	return (tree, { data }) => {
		const textOnPage = markdownToString(tree)
		const readingTime = getReadingTime(textOnPage)
		data.astro.frontmatter.minutesRead = readingTime.minutes
	}
}
