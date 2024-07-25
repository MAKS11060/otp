import {delay} from '@std/async/delay'
import {steamTotp, type SteamTotpOptions} from '../steamTotp.ts'

/**
 * An object containing the remaining time and the `SteamTOTP` code.
 */
export interface ReadableSteamTotpResult {
  /**
   * The remaining time until the next `SteamTOTP` code is generated, in seconds.
   */
  timeLeft: number
  /**
   * The generated `SteamTOTP` code.
   */
  code: string
}

const getTime = () => Math.floor(Date.now() / 1000)

const getRemainingTime = (stepWindow: number) => {
  return stepWindow - (getTime() % stepWindow)
}

/**
 * Generates a readable stream of `SteamTOTP` codes based on the provided options.
 *
 * @param {SteamTotpOptions} options - The options to use for generating the SteamTOTP codes.
 * @returns {ReadableStream<ReadableSteamTotpResult>} A readable stream of objects containing the remaining time and the SteamTOTP code.
 *
 * @example
 * ```ts
 * const secret = decodeBase64('STEAM_SHARED_SECRET')
 * for await (const otp of readableSteamTotp({secret})) {
 *   console.log(otp)
 * }
 * ```
 */
export const readableSteamTotp = (
  options: SteamTotpOptions
): ReadableStream<ReadableSteamTotpResult> => {
  const stepWindow = 30

  let lastTime: number = 0
  let code: string = ''

  return new ReadableStream<ReadableSteamTotpResult>(
    {
      async start(controller) {
        lastTime = Math.floor(getTime() / stepWindow)
        code = await steamTotp(options)
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
          code = await steamTotp(options)
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
