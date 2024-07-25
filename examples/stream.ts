import {decodeBase64} from 'https://deno.land/std/encoding/base64.ts'
import {steamTotp} from '../lib/steamTotp.ts'
import {getTimeCounter, totp} from '../lib/totp.ts'
import {generateKey} from '../mod.ts'

export const ToptReadable = (secret: ArrayBuffer) => {
  let currentTime = 0

  return new ReadableStream<string>(
    {
      start(controller) {
        setInterval(async () => {
          const t = getTimeCounter(30)
          if (currentTime < t) {
            currentTime = t
            controller.enqueue(await totp({secret, counter: t}))
          }
        }, 500)
      },
    },
    {highWaterMark: 1}
  )
}

export const SteamTotpReadable = (secret: string) => {
  let currentTime = 0

  return new ReadableStream<string>(
    {
      start(controller) {
        setInterval(async () => {
          const t = getTimeCounter(30)
          if (currentTime < t) {
            currentTime = t
            const key = await generateKey(decodeBase64(secret), t)
            controller.enqueue(steamTotp(key))
          }
        }, 500)
      },
    },
    {highWaterMark: 1}
  )
}
