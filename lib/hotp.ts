/**
 * @module
 * Module contains function for generate {@link https://datatracker.ietf.org/doc/html/rfc4226 TOTP}
 *
 * @example
 * ```
 * import {hotp} from '@maks11060/otp'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 *
 * const code = await hopt({secret, counter: 1})
 * ```
 */

interface HotpOptions {
  /** The recommended secret length is above `20` bytes */
  secret: ArrayBuffer
  counter: number
  /** @default 6 */
  digits?: 6 | 7 | 8,
  /** @default `SHA-1` */
  alg?: 'SHA-1' | 'SHA-256' | 'SHA-512'
}

/**
 * Get `hotp` code
 * @example
 * ```
 * import {hotp} from '@maks11060/otp'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 *
 * const code = await hopt({secret, counter: 1})
 * ```
 */
export const hotp = async (options: HotpOptions): Promise<string> => {
  options.digits ??= 6

  const key = await generateKey(options.secret, options.counter)
  const num = DT(key)
  return (num % 10 ** options.digits).toString().padStart(options.digits, '0')
}

/**
 * Generate key
 * @param secret
 * @param counter `C` or `getTimeCounter()`
 * @returns counter signed by the secret
 */
export const generateKey = async (
  secret: ArrayBuffer,
  counter: number,
  alg: HotpOptions['alg'] = 'SHA-1'
): Promise<ArrayBuffer> => {
  const key = await crypto.subtle.importKey(
    'raw',
    secret,
    {name: 'HMAC', hash: alg},
    true,
    ['sign']
  )

  return await crypto.subtle.sign('HMAC', key, padCounter(counter))
}

const padCounter = (counter: number): ArrayBuffer => {
  const buffer = new ArrayBuffer(8)
  const bView = new DataView(buffer)
  bView.setBigUint64(0, BigInt(counter))
  return buffer
}

/** Dynamic Truncation */
export const DT = (HS: ArrayBuffer): number => {
  const bView = new DataView(HS)
  const offset = bView.getUint8(HS.byteLength - 1) & 0xf
  return bView.getUint32(offset) & 0x7fff_ffff
}
