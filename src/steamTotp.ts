import {DT, generateKey, type HotpOptions} from './hotp.ts'

/**
 * Options for generating a `SteamTOTP` code.
 */
export interface SteamTotpOptions {
  /**
   * The secret key to use for generating the `SteamTOTP` code.
   */
  secret: HotpOptions['secret']

  /**
   * The counter value to use for generating the `SteamTOTP` code.
   */
  counter?: number

  /**
   * The time offset to use for generating the `SteamTOTP` code, in seconds.
   * @default 0
   */
  timeOffset?: number
}

const chars = '23456789BCDFGHJKMNPQRTVWXY'

/**
 * Generates a `SteamTOTP` code based on the provided options.
 *
 * @param options - The options to use for generating the `SteamTOTP` code.
 * @returns A promise that resolves to the generated `SteamTOTP` code.
 *
 * @example
 * ```ts
 * import {readableTotp, steamTotp} from '@maks11060/otp'
 * import {decodeBase64} from '@std/encoding/base64'
 *
 * const secret = decodeBase64('STEAM_SHARED_SECRET')
 *
 * // Get code
 * const code = await steamTotp({secret})
 * console.log(code) // "KQXVF"
 *
 * // Codes iterator
 * for await (const {code, timeLeft} of readableTotp(steamTotp, {secret})) {
 *   console.log({code, timeLeft}) // { code: "KQXVF", timeLeft: 25 }
 * }
 * ```
 */
export const steamTotp = async (options: SteamTotpOptions): Promise<string> => {
  options = {...options} // remove external reference
  options.timeOffset ??= 0
  options.counter ??= Math.floor((Date.now() / 1000 + options.timeOffset) / 30)

  const key = await generateKey(options.secret, options.counter)

  let value = DT(key)
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(value % chars.length)
    value = Math.floor(value / chars.length)
  }
  return code
}
