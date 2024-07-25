import {assertEquals} from 'jsr:@std/assert'
import {steamTotp} from '../mod.ts'

const secret = new Uint8Array(20) // 0 x20

Deno.test('Steam totp', async () => {
  assertEquals(await steamTotp({secret, counter: 0}), 'RYH4D')
  assertEquals(await steamTotp({secret, counter: 1}), 'DR2DK')
})
