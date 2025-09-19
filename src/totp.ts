import {DT, generateKey, type HotpOptions} from './hotp.ts'

/**
 * Options for generating a `TOTP` code.
 */
export interface TotpOptions {
  /**
   * The secret key to use for generating the `TOTP` code.
   *
   * The recommended `secret` length is above `20` bytes.
   */
  secret: HotpOptions['secret']

  /**
   * The number of digits to use for the `TOTP` code.
   * @default 6
   */
  digits?: 6 | 7 | 8

  /**
   * The counter value to use for generating the `TOTP` code.
   *
   * Use current time with step `30` seconds by default.
   */
  counter?: number

  /**
   * The time interval in seconds to use for generating the `TOTP` code.
   * @default 30
   */
  stepWindow?: number

  /**
   * The hashing algorithm to use for generating the `TOTP` code.
   * @default `SHA-1`
   */
  alg?: 'SHA-1' | 'SHA-256' | 'SHA-512'
}

/**
 * Options for validating a `TOTP` code.
 * Extends the {@linkcode TotpOptions} interface.
 */
export interface TotpValidateOptions extends TotpOptions {
  /**
   * The `TOTP` code to validate.
   */
  code: string

  /**
   * The time correction in multiples of `stepWindow` to use for validating the `TOTP` code.
   *
   * Defaults to 3, which corresponds to a time correction of +- 90 seconds when `stepWindow` is `30`.
   * @default 3
   */
  window?: number
}

/**
 * Get the remaining expiration time of the TOTP code.
 *
 * @param stepWindow The time interval in seconds to use for generating the `TOTP` code. Default `30`
 * @returns remaining time `TOTP`
 */
export const getRemainingTime = (stepWindow: number = 30): number => {
  return stepWindow - (Math.floor(Date.now() / 1000) % stepWindow)
}

/**
 * Returns the current time interval with the specified `step` size.
 *
 * @param step - The `step` size in seconds. Defaults to `30`.
 * @returns The current time interval.
 */
export const getTimeCounter = (step: number = 30): number => {
  return Math.floor(Date.now() / 1000 / step)
}

/**
 * Generates a `TOTP` code based on the provided options.
 *
 * @param options - The options to use for generating the `TOTP` code.
 * @returns A promise that resolves to the generated `TOTP` code.
 *
 * @example
 * ```ts
 * import {readableTotp, totp} from '@maks11060/otp'
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
 * ```
 */
export const totp = async (options: TotpOptions): Promise<string> => {
  options = {...options} // remove external reference
  options.digits ??= 6
  options.stepWindow ??= 30
  options.counter ??= getTimeCounter(options.stepWindow)

  const key = await generateKey(options.secret, options.counter, options.alg)
  const num = DT(key)
  return (num % 10 ** options.digits).toString().padStart(options.digits, '0')
}

/**
 * Validates a `TOTP` code based on the provided options.
 *
 * @param {TotpValidateOptions} options - The options to use for validating the TOTP code.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the code is valid, `false` otherwise.
 *
 * @example
 * ```ts
 * import {totp, totpValidate} from '@maks11060/otp'
 *
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 * const code = await totp({secret})
 *
 * await totpValidate({secret, code}) // true
 * ```
 */
export const totpValidate = async (options: TotpValidateOptions): Promise<boolean> => {
  options.window ??= 3
  options.stepWindow ??= 30
  options.counter ??= getTimeCounter(options.stepWindow)

  const check = async (i: number) => options.code === (await totp({...options, counter: options.counter! + i}))

  for (let i = 0; i < options.window; i++) {
    if ((await check(i)) || (await check(-i - 1))) {
      // 0 -1 1 -2 2 -3
      return true
    }
  }

  return false
}
