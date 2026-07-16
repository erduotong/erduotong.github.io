/**
 * 把Obsidian内的超长链转成短链
 */

import { xxh64 } from '@node-rs/xxhash'
import baseX from 'base-x'

// 使用Base58，防止O 0 I l 无法辨认
export const BASE58_ALPHABET =
	'123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

// 固定 seed，保证同一输入始终得到同一短码（不要修改，否则历史短链全部失效）
const SEED: bigint = 67n
const base58 = baseX(BASE58_ALPHABET)

/**
 * 将字符串转成恒为11位长度的链接，符合base58格式
 *
 * 该转换不可逆，无法根据短码恢复原始链接
 * @param input
 */
export function intoShortLink(input: string) {
	const data = Buffer.from(input)
	const hash = xxh64(data, SEED)
	const hashBytes = Buffer.alloc(8)
	hashBytes.writeBigUInt64BE(hash)
	return base58.encode(hashBytes).padStart(11, BASE58_ALPHABET[0])
}
