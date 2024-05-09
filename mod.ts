/**
 * @module
 * OTP Collection of one-time password algorithms
 *
 * - {@link https://datatracker.ietf.org/doc/html/rfc4226 HOTP}
 * - {@link https://datatracker.ietf.org/doc/html/rfc6238 TOTP}
 * - SteamTOTP
 *
 * @example
 * ```ts
 * import {otpauth, topt, toptValidate} from '@maks11060/otp'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 * const code = await topt({secret}) // 123456
 *
 * // Create otpauth uri
 * otpauth({secret, issuer: 'App name', label: '@username'}).toString() // otpauth://totp/lable?secret=00&algorithm=SHA1&issuer=App+name
 *
 * // Validate totp with time window
 * await toptValidate({secret, code}) // true
 * ```
 */

export {generateKey, hotp} from './lib/hotp.ts'
export {otpauth} from './lib/otpauth.ts'
export {steamTotp} from './lib/steamTotp.ts'
export {getTimeCounter, topt, toptValidate} from './lib/totp.ts'

