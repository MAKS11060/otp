import {DT, generateKey} from './hotp.ts'

export interface TotpOptions {
  /** The recommended secret length is above `20` bytes */
  secret: ArrayBuffer
  /** @default 6 */
  digits?: 6 | 7 | 8
  /** Use current time with step 30 second @default getTimeCounter(30) */
  counter?: number
  /** @default 30 // sec */
  stepWindow?: number
  /** @default `SHA-1` */
  alg?: 'SHA-1' | 'SHA-256' | 'SHA-512'
}

export interface TotpValidateOptions extends TotpOptions {
  /** `totp` code */
  code: string
  /** @default 3 // window = (3 * stepWindow) */
  window?: number
}

/**
 * Get time interval with step
 * @param step WindowStep in seconds. default: `30`
 * @returns Time Interval
 */
export const getTimeCounter = (step: number = 30): number =>
  Math.floor(Date.now() / (step * 1000))

/**
 * Get `totp` code
 * @example
 * ```ts
 * import {totp} from '@maks11060/otp'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 *
 * const code = await totp({secret})
 * ```
 */
export const totp = async (options: TotpOptions): Promise<string> => {
  options.digits ??= 6
  options.stepWindow ??= 30
  options.counter ??= getTimeCounter(options.stepWindow)

  const key = await generateKey(options.secret, options.counter, options.alg)
  const num = DT(key)
  return (num % 10 ** options.digits).toString().padStart(options.digits, '0')
}

/**
 * Validate `totp` code
 *  * @example
 * ```ts
 * import {totp, totpValidate} from '@maks11060/otp'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 *
 * const code = await totp({secret})
 * await totpValidate({secret, code}) // true
 * ```
 */
export const totpValidate = async (
  options: TotpValidateOptions
): Promise<boolean> => {
  options.window ??= 3
  options.stepWindow ??= 30
  options.counter ??= getTimeCounter(options.stepWindow)

  const check = async (i: number) =>
    options.code === (await totp({...options, counter: options.counter! + i}))

  for (let i = 0; i < options.window; i++) {
    if ((await check(i)) || (await check(-i - 1))) {
      // 0 -1 1 -2 2 -3
      return true
    }
  }

  return false
}
