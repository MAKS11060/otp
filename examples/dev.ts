#!/usr/bin/env -S deno run -A --watch

// for await (const item of ToptReadable(secret)) {
//   console.log(item)
// }

// const getCode = async () => {
//   const code = await topt({secret})
//   return code
// }

// console.log(await getCode())
// for await (const time of timeIter()) {
//   console.log(await getCode())
// }

// const totpIterator = (signal?: AbortSignal) => {
//   return {
//     async *[Symbol.asyncIterator]() {
//       while (true) {
//         if (signal && signal.aborted) break
//         await delay(1000)
//         yield 1
//       }
//     },
//   }
// }

// const store = readable(0, (set) => {})

// store.subscribe(v => {
//   console.log(v)
//   const s = new AbortController()
//   for await (const code of totpIterator(s.signal)) {
//     console.log(code)
//     s.abort()
//   }
// })

// !(async () => {
//   // const s = new AbortController()
//   // for await (const code of totpIterator(s.signal)) {
//   //   console.log(code)
//   //   s.abort()
//   // }
// })()
