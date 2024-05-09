#!/usr/bin/env -S deno run -A --watch

import {delay} from 'jsr:@std/async'
import {getTimeCounter} from '../mod.ts'

const getTime = () => Math.floor(Date.now() / 1000)

/**
 * @example
 * ```ts
 * timeLeftCounter(30, (c) => {
 *   console.log(c)
 * })
 * ```
 */
export const timeLeftCounter = (
  stepWindow: number = 30,
  cb: (i: number) => void
) => {
  const int = setInterval(() => {
    cb(
      Math.ceil(
        stepWindow - (getTime() - getTimeCounter(stepWindow) * stepWindow)
      )
    )
  }, 1000)

  return () => clearInterval(int)
}

const makeTimeLeftCounter = (stepWindow: number = 30) => {
  let int: number
  return new ReadableStream<number>({
    start(controller) {
      const write = () => {
        controller.enqueue(
          Math.ceil(
            stepWindow - (getTime() - getTimeCounter(stepWindow) * stepWindow)
          )
        )
      }
      write()
      int = setInterval(write, 1000)
    },
    cancel() {
      clearInterval(int)
    },
  })
}

export const timeIter = (stepWindow: number = 30) => {
  return {
    async *[Symbol.asyncIterator]() {
      while (true) {
        yield Math.ceil(
          stepWindow - (getTime() - getTimeCounter(stepWindow) * stepWindow)
        )
        await delay(1000)
      }
    },
  }
}

// for await (const time of timeIter()) {
//   console.log(time)
// }

// for await (const item of makeTimeLeftCounter(30)) {
//   console.log(item)
// }
