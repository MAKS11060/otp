#!/usr/bin/env -S deno run -A --unstable-hmr

import {delay} from 'jsr:@std/async/delay'

const getTime = () => Math.floor(Date.now() / 1000)

const totp = (stepWindow: number = 30) => {
  return new ReadableStream(
    {
      // start(controller) {
      //   controller.enqueue(
      //     Math.ceil(
      //       stepWindow - (getTime() - getTimeCounter(stepWindow) * stepWindow)
      //     )
      //   )
      // },
      async pull(controller) {
        await delay(1000)
        // controller.enqueue(
        //   Math.ceil(
        //     stepWindow - (getTime() - getTimeCounter(stepWindow) * stepWindow)
        //   )
        // )
        const currentTime = getTime()
        controller.enqueue(stepWindow - (currentTime % stepWindow))
      },
      cancel() {
        console.log('cancel')
      },
    },
    {highWaterMark: 0}
  )
}

for await (const otp of totp(30)) {
  console.log(otp)
}

