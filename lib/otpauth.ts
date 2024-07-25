import {encodeBase32} from '@std/encoding/base32'

/**
 * Options for generating a HOTP code.
 */
interface Hopt {
  type?: 'hotp'
  /**
   * The counter value to use for generating the `HOTP` code.
   *
   * Only required if `type` is `'hotp'`.
   */
  counter?: number
}

/**
 * Options for generating a TOTP code.
 */
interface Topt {
  type?: 'totp'
  /**
   * The time interval in seconds to use for generating the `TOTP` code.
   *
   * Only required if `type` is `'totp'`.
   * @default 30 seconds
   * */
  period?: number
}

/**
 * Options for generating an `OTP` authentication URI.
 * {@link https://github.com/google/google-authenticator/wiki/Key-Uri-Format Format}
 */
export type OtpAuthUriOptions = {
  /**
   * The `label` to use for identifying the account associated with the key.
   * {@link https://github.com/google/google-authenticator/wiki/Key-Uri-Format#label Label format}
   */
  label: string
  /**
   * The `secret` key to use for generating the `OTP` code.
   *
   * The recommended secret length is above `20` bytes.
   */
  secret: ArrayBuffer
  /**
   * The issuer parameter indicating the provider or service this account is associated with.
   */
  issuer?: string
  /**
   * The type of code to generate.
   * @default `totp`
   */
  type?: 'totp' | 'hotp'
  /**
   * The hashing algorithm to use for generating the `OTP` code.
   * @default `SHA1`
   */
  alg?: 'SHA1' | 'SHA256' | 'SHA512'
  /**
   * The number of digits to use for the `OTP` code.
   * @default `6`
   */
  digits?: 6 | 7 | 8
} & (Topt | Hopt)

/**
 * Generate {@link https://github.com/google/google-authenticator/wiki/Key-Uri-Format otpauth} URI
 *
 * @param {OtpAuthUriOptions} options - The options to use for generating the URI.
 * @returns {URL} The generated `OTP` authentication URI.
 *
 * @example
 * ```ts
 * import {otpauth} from "@maks11060/otp"
 *
 * otpauth({secret, issuer: 'App name', label: '@user'}).toString()
 * // otpauth://totp/lable?secret=00&algorithm=SHA1&issuer=App+name
 * ```
 */
export const otpauth = (options: OtpAuthUriOptions): URL => {
  options.type ??= 'totp'
  options.alg ??= 'SHA1'

  const uri = new URL(`otpauth://${options.type}/${options.label}`)
  uri.searchParams.set('secret', encodeBase32(options.secret))
  uri.searchParams.set('algorithm', options.alg)

  if (options.issuer) uri.searchParams.set('issuer', options.issuer)
  if (options.digits) uri.searchParams.set('digits', options.digits?.toString())

  if (options.type === 'totp') {
    if (options.period) {
      uri.searchParams.set('period', options.period?.toString())
    }
  } else if (options.type === 'hotp') {
    if (options.counter) {
      uri.searchParams.set('counter', options.counter?.toString())
    }
  }

  return uri
}
