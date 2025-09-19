#!/usr/bin/env -S deno run -A --watch

import {readableTotp, totp} from '@maks11060/otp'

const secret = new Uint8Array(20)

// === test
const codes = readableTotp(totp, {secret})
for await (const {code, timeLeft} of codes) {
  console.log({code, timeLeft})
  break
}
