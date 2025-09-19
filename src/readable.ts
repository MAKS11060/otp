import {delay} from '@std/async/delay'
import type {Uint8Array_} from './types.ts'
import {getRemainingTime} from './totp.ts'

/**
 * An object containing the remaining time and the `TOTP` code.
 */
export interface TotpCode {
  /**
   * The remaining time until the next `TOTP` code is generated, in seconds.
   */
  timeLeft: number

  /**
   * The generated `TOTP` code.
   */
  code: string
}

/**
 * Creates an iterable `TOTP` code generator.
 *
 * @param fn - A function with a `TOTP` code generation algorithm
 * @param options - Parameters for the generation function
 *
 * @example
 * ```ts
 * import {readableTotp, totp} from '@maks11060/otp'
 *
 * for await (const {code, timeLeft} of readableTotp(totp, {secret})) {
 *   console.log({code, timeLeft}) // { code: "380577", timeLeft: 15 }
 * }
 * ```
 */
export async function* readableTotp<
  T extends {
    secret: ArrayBuffer | Uint8Array_
    counter?: number
    stepWindow?: number
  },
>(
  fn: (options: T) => Promise<string>,
  options: T & {
    /**
     * @default 1000 ms
     */
    updateInterval?: number
  },
): AsyncGenerator<TotpCode> {
  const stepWindow = options.stepWindow ?? 30
  const updateInterval = options.updateInterval ?? 1000

  let lastTime: number = 0
  let code: string = ''

  while (true) {
    // cache otp
    if (lastTime !== Math.floor(Date.now() / 1000 / stepWindow)) {
      lastTime = Math.floor(Date.now() / 1000 / stepWindow)
      code = await fn(options)
    }

    yield {
      timeLeft: getRemainingTime(stepWindow),
      code,
    }

    await delay(updateInterval)
  }
}
