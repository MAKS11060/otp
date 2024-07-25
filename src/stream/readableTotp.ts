import {delay} from '@std/async/delay'
import {totp, type TotpOptions} from '../totp.ts'

export interface ReadableTotpResult {
  timeLeft: number
  code: string
}

const getTime = () => Math.floor(Date.now() / 1000)

const getRemainingTime = (stepWindow: number) => {
  return stepWindow - (getTime() % stepWindow)
}

/**
 * Generates a stream of `TOTP` codes based on the provided options.
 *
 * @param {TotpOptions} options - The options to use for generating the `TOTP` codes.
 * @returns {ReadableStream<ReadableTotpResult>} A readable stream of objects containing the remaining time and the `TOTP` code.
 *
 * @example
 * ```ts
 * const secret = crypto.getRandomValues(new Uint8Array(20))
 * for await (const otp of readableTotp({secret})) {
 *   console.log(otp)
 * }
 * ```
 */
export const readableTotp = (
  options: TotpOptions
): ReadableStream<ReadableTotpResult> => {
  const stepWindow = options.stepWindow ?? 30

  let lastTime: number = 0
  let code: string = ''

  return new ReadableStream<ReadableTotpResult>(
    {
      async start(controller) {
        lastTime = Math.floor(getTime() / stepWindow)
        code = await totp(options)
        controller.enqueue({
          timeLeft: getRemainingTime(stepWindow),
          code,
        })
      },
      async pull(controller) {
        await delay(1000)

        // update code in cache
        if (lastTime !== Math.floor(getTime() / stepWindow)) {
          lastTime = Math.floor(getTime() / stepWindow)
          code = await totp(options)
        }

        controller.enqueue({
          timeLeft: getRemainingTime(stepWindow),
          code,
        })
      },
    },
    {highWaterMark: 0}
  )
}
