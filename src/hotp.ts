/**
 * Options for generating a `HOTP` code.
 */
export interface HotpOptions {
  /**
   * The secret key to use for generating the `HOTP` code.
   * The recommended secret length is above `20` bytes.
   */
  secret: ArrayBuffer | Uint8Array
  /**
   * The counter value to use for generating the `HOTP` code.
   */
  counter: number
  /**
   * The number of digits to use for the `HOTP` code.
   * @default 6
   */
  digits?: 6 | 7 | 8
  /**
   * The hashing algorithm to use for generating the `HOTP` code.
   * @default 'SHA-1'
   */
  alg?: 'SHA-1' | 'SHA-256' | 'SHA-512'
}

/**
 * Generates a `HOTP` code based on the provided options.
 *
 * @param {HotpOptions} options - The options to use for generating the HOTP code.
 * @returns {Promise<string>} A promise that resolves to the generated HOTP code.
 *
 * @example
 * ```ts
 * import {hotp} from '@maks11060/otp'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 *
 * const code = await hotp({secret, counter: 1})
 * ```
 */
export const hotp = async (options: HotpOptions): Promise<string> => {
  options.digits ??= 6

  const key = await generateKey(options.secret, options.counter)
  const num = DT(key)
  return (num % 10 ** options.digits).toString().padStart(options.digits, '0')
}

/**
 * Generates a key based on the provided secret and counter.
 *
 * @param {ArrayBuffer|Uint8Array} secret - The secret key to use for generating the key.
 * @param {number} counter - The counter value to use for generating the key.
 * @param {HotpOptions['alg']} [alg='SHA-1'] - The hashing algorithm to use for generating the key. Defaults to 'SHA-1'.
 * @returns {Promise<ArrayBuffer>} A promise that resolves to the generated key.
 *
 * @example
 * ```ts
 * import {generateKey} from '@maks11060/otp'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 * const key = await generateKey(secret, 0)
 * ```
 */
export const generateKey = async (
  secret: ArrayBuffer | Uint8Array,
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

  return crypto.subtle.sign('HMAC', key, padCounter(counter))
}

const padCounter = (counter: number): ArrayBuffer => {
  const buffer = new ArrayBuffer(8)
  const bView = new DataView(buffer)
  bView.setBigUint64(0, BigInt(counter))
  return buffer
}

/**
 * Performs dynamic truncation on the provided hash value.
 * @param {ArrayBuffer|Uint8Array} HS - The hash value to truncate.
 * @returns {number} The truncated hash value.
 */
export const DT = (HS: ArrayBuffer | Uint8Array): number => {
  const bView = new DataView(new Uint8Array(HS).buffer)
  const offset = bView.getUint8(HS.byteLength - 1) & 0xf
  return bView.getUint32(offset) & 0x7fff_ffff
}
