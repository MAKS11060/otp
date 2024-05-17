/**
 * @module
 * OTP Collection of one-time password algorithms
 *
 * - {@link https://datatracker.ietf.org/doc/html/rfc4226 HOTP}
 * - {@link https://datatracker.ietf.org/doc/html/rfc6238 TOTP}
 * - SteamTOTP
 *
 * @example Generate TOTP
 * ```ts
 * import {otpauth, totp, totpValidate} from '@maks11060/otp'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 * const code = await totp({secret}) // 123456
 *
 * // Create otpauth uri
 * otpauth({secret, issuer: 'App name', label: '@username'}).toString() // otpauth://totp/lable?secret=00&algorithm=SHA1&issuer=App+name
 *
 * // Validate totp with time window
 * await totpValidate({secret, code}) // true
 * ```
 *
 * @example Generate HOTP
 * ```ts
 * import {hotp} from '@maks11060/otp'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 *
 * const code = await hotp({secret, counter: 1})
 * ```
 *
 * @example Generate SteamTOTP
 * ```ts
 * import {decodeBase64} from '@std/encoding/base64'
 * import {generateKey, getTimeCounter, steamTotp} from '@maks11060/otp'
 *
 * const steamKey = decodeBase64('STEAM_SHARED_SECRET') // Decode key to ArrayBuffer
 * steamTotp(await generateKey(steamKey, getTimeCounter())) // VWFH3
 * ```
 */

export {generateKey, hotp} from './lib/hotp.ts'
export {otpauth} from './lib/otpauth.ts'
export {steamTotp} from './lib/steamTotp.ts'
export {getTimeCounter, totp, totpValidate} from './lib/totp.ts'

