import {encodeBase32} from 'https://deno.land/std/encoding/base32.ts'

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
   * {@link https://github.com/google/google-authenticator/wiki/Key-Uri-Format#label Label format}
   */
  label: string
  secret: ArrayBuffer
  issuer?: string
  /** Default `totp` */
  type?: 'totp' | 'hotp'
  /** Default `SHA1` */
  algorithm?: 'SHA1' | 'SHA256' | 'SHA512'
  /** Default `6` */
  digits?: 6 | 7 | 8
} & (Topt | Hopt)

/**
 * Generate `otpauth` uri
 * @param options
 * @returns {URL} URI otpauth
 */
export const createOtpAuthUri = (options: OtpAuthUriOptions) => {
  options.type ??= 'totp'
  options.algorithm ??= 'SHA1'

  const uri = new URL(`otpauth://${options.type}/${options.label}`)
  uri.searchParams.set('secret', encodeBase32(options.secret))
  uri.searchParams.set('algorithm', options.algorithm)

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
