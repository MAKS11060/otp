/**
 * # **OTP**
 * ### Collection of one-time password algorithms
 *
 * - {@link https://datatracker.ietf.org/doc/html/rfc4226 HOTP}
 * - {@link https://datatracker.ietf.org/doc/html/rfc6238 TOTP}
 * - SteamTOTP
 *
 * @example Generate `TOTP`
 * ```ts
 * import {otpauth, readableTotp, totp, totpValidate} from '@maks11060/otp'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 *
 * // Get code
 * const code = await totp({secret}) // 380577
 *
 * // Codes iterator
 * for await (const {code, timeLeft} of readableTotp(totp, {secret})) {
 *   console.log({code, timeLeft}) // { code: "380577", timeLeft: 15 }
 * }
 *
 * // Create otpauth uri
 * otpauth({secret, issuer: 'App name', label: '@username'}).toString()
 * // otpauth://totp/lable?secret=00&algorithm=SHA1&issuer=App+name
 *
 * // Validate totp with time window
 * await totpValidate({secret, code}) // true
 * ```
 *
 * @example Generate `HOTP`
 * ```ts
 * import {readableTotp, hotp} from '@maks11060/otp'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 * const code = await hotp({secret, counter: 1})
 * ```
 *
 * @example Generate `SteamTOTP`
 * ```ts
 * import {readableTotp, steamTotp} from '@maks11060/otp'
 * import {decodeBase64} from '@std/encoding/base64'
 *
 * const secret = decodeBase64('STEAM_SHARED_SECRET') // Decode key to ArrayBuffer
 *
 * // Get code
 * const code = await steamTotp({secret})
 * console.log(code) // "VWFH3"
 *
 * // Codes iterator
 * for await (const {code, timeLeft} of readableTotp(steamTotp, {secret})) {
 *   console.log({code, timeLeft}) // { code: "KQXVF", timeLeft: 25 }
 * }
 * ```
 *
 * @module
 */

export {generateKey, hotp, type HotpOptions} from './src/hotp.ts'
export {otpauth, type OtpAuthUriOptions} from './src/otpauth.ts'
export {readableTotp} from './src/readable.ts'
export {steamTotp, type SteamTotpOptions} from './src/steamTotp.ts'
export {
  getRemainingTime,
  getTimeCounter,
  totp,
  type TotpOptions,
  totpValidate,
  type TotpValidateOptions,
} from './src/totp.ts'
