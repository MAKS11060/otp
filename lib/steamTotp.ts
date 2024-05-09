/**
 * @module
 * Generate Steam guard `totp`
 *
 * @example
 * ```ts
 * import {decodeBase64} from '@std/encoding/base64'
 * import {generateKey, getTimeCounter, steamTotp} from '@maks11060/otp'
 *
 * const steamKey = decodeBase64('STEAM_SHARED_SECRET') // Decode key to ArrayBuffer
 * steamTotp(await generateKey(steamKey, getTimeCounter())) // VWFH3
 * ```
 */

import {DT} from './hotp.ts'

const chars = '23456789BCDFGHJKMNPQRTVWXY'

/** Get `SteamTotp` code
 *
 * @example
 * ```ts
 * import {decodeBase64} from '@std/encoding/base64'
 * import {generateKey, getTimeCounter, steamTotp} from '@maks11060/otp'
 *
 * const steamKey = decodeBase64('STEAM_SHARED_SECRET')
 * steamTotp(await generateKey(steamKey, getTimeCounter())) // VWFH3
 * ```
 */
export const steamTotp = (key: ArrayBuffer): string => {
  let code = ''
  let value = DT(new Uint8Array(key).buffer)
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(value % chars.length)
    value = Math.floor(value / chars.length)
  }
  return code
}
