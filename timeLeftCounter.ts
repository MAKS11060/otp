const getTime = () => Math.floor(Date.now() / 1000)
const getCounter = (step = 30) => Math.floor(getTime() / step)

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
      Math.ceil(stepWindow - (getTime() - getCounter(stepWindow) * stepWindow))
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
            stepWindow - (getTime() - getCounter(stepWindow) * stepWindow)
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

for await (const item of makeTimeLeftCounter(30)) {
  console.log(item)
}
