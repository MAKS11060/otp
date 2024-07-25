import {assertEquals} from 'jsr:@std/assert/equals'
import {readableSteamTotp} from './readableSteamTotp.ts'
import {readableTotp} from './readableTotp.ts'

const secret = new Uint8Array(20) // 0 x20

Deno.test('readableTotp', async () => {
  for await (const otp of readableTotp({secret, counter: 0})) {
    assertEquals(otp.code, '328482')
    break
  }
  for await (const otp of readableTotp({secret, counter: 1})) {
    assertEquals(otp.code, '812658')
    break
  }
})

Deno.test('readableSteamTotp', async () => {
  for await (const otp of readableSteamTotp({secret, counter: 0})) {
    assertEquals(otp.code, 'RYH4D')
    break
  }
  for await (const otp of readableSteamTotp({secret, counter: 1})) {
    assertEquals(otp.code, 'DR2DK')
    break
  }
})
