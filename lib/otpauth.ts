import {encodeBase32} from '@std/encoding/base32'

type Hopt = {
  type?: 'hotp'
  /** Only if `type` is `hotp` */
  counter?: number
}

type Topt = {
  type?: 'totp'
  /**
   * Only if `type` is `totp`
   *
   * @Default `30` seconds
   * */
  period?: number
}

/** https://github.com/google/google-authenticator/wiki/Key-Uri-Format */
export type OtpAuthUriOptions = {
  /**
   * The label is used to identify which account a key is associated with.
   * {@link https://github.com/google/google-authenticator/wiki/Key-Uri-Format#label Label format}
   */
  label: string
  /** The recommended secret length is above `20` bytes */
  secret: ArrayBuffer
  /** The issuer parameter is a string value indicating the provider or service this account  */
  issuer?: string
  /** Default `totp` */
  type?: 'totp' | 'hotp'
  /** Default `SHA1` */
  alg?: 'SHA1' | 'SHA256' | 'SHA512'
  /** Default `6` */
  digits?: 6 | 7 | 8
} & (Topt | Hopt)

/**
 * Generate {@link https://github.com/google/google-authenticator/wiki/Key-Uri-Format otpauth} Uri
 * @param options
 * @returns {URL} URI otpauth
 *
 * @example
 * ```ts
 * import {otpauth} from "@maks11060/otp"
 *
 * // Create otpauth uri
 * otpauth({secret, issuer: 'App name', label: '@user'}).toString() // otpauth://totp/lable?secret=00&algorithm=SHA1&issuer=App+name
 * ```
 */
export const otpauth = (options: OtpAuthUriOptions): URL => {
  options.type ??= 'totp'
  options.alg ??= 'SHA1'

  const uri = new URL(`otpauth://${options.type}/${options.label}`)
  uri.searchParams.set('secret', encodeBase32(options.secret))
  uri.searchParams.set('algorithm', options.alg)

  if (options.issuer) uri.searchParams.set('issuer', options.issuer)

  if (options.type === 'totp') {
    if (options.digits) {
      uri.searchParams.set('digits', options.digits?.toString())
    } else if (options.period) {
      uri.searchParams.set('period', options.period?.toString())
    }
  }

  return uri
}
