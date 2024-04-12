import {DT, generateKey} from './hotp.ts'

interface TotpOptions {
  /** The recommended secret length is above 20 bytes */
  secret: ArrayBuffer
  /** Use current time with step 30 second */
  counter?: number
  /** @default 6 */
  digits?: 6 | 7 | 8
  /** @default 30 // sec */
  stepWindow?: number
}

/**
 * Get time with step
 * @param step WindowStep in seconds
 * @returns Time Interval
 */
export const getTimeCounter = (step: number) =>
  Math.floor(Date.now() / (step * 1000))

export const topt = async (options: TotpOptions) => {
  options.digits ??= 6
  options.stepWindow ??= 30
  options.counter ??= getTimeCounter(options.stepWindow)

  const key = await generateKey(options.secret, options.counter)
  const num = DT(key)
  return (num % 10 ** options.digits).toString().padStart(options.digits, '0')
}

export interface TotpValidateOptions extends TotpOptions {
  code: string
  /** @default 3 // window = (3 * stepWindow) */
  window?: number
}

export const toptValidate = async (options: TotpValidateOptions) => {
  options.window ??= 3
  options.stepWindow ??= 30
  options.counter ??= getTimeCounter(options.stepWindow)

  const check = async (i: number) =>
    options.code === (await topt({...options, counter: options.counter! + i}))

  for (let i = 0; i < options.window; i++) {
    if ((await check(i)) || (await check(-i - 1))) {
      // 0 -1 1 -2 2 -3
      return true
    }
  }

  return false
}
