import { expect, test } from 'vitest'
import { BASE58_ALPHABET, intoShortLink } from './shortLink'

test('输出长度为11位', () => {
	const result = intoShortLink('hello')
	expect(result.length).toBe(11)
})

test('输出符合Base58格式', () => {
	const result = intoShortLink('hello')
	for (const ch of result) {
		expect(BASE58_ALPHABET).toContain(ch)
	}
})

test('指定输入生成短链', () => {
	const result = intoShortLink('toic42pks4dvdjcbncdoiiybk8moaf84')
	expect(result).toMatchInlineSnapshot(`"RyR1MofnUtU"`)
})
