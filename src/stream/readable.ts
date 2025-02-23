/**
 * A module for generating readable streams of `TOTP` and `SteamTOTP` codes.
 *
 * @example
 * ```ts
 * import {readableTotp} from '@maks11060/otp/readable'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 * for await (const otp of readableTotp({secret})) {
 *   console.log(otp)
 * }
 * ```
 *
 * @module
 */

export type {HotpOptions} from '../hotp.ts'
export type {TotpOptions} from '../totp.ts'
export {
  readableSteamTotp,
  type ReadableSteamTotpResult
} from './readableSteamTotp.ts'
export {readableTotp, type ReadableTotpResult} from './readableTotp.ts'

