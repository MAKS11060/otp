import {assertEquals} from 'jsr:@std/assert'
import {steamTotp} from '../mod.ts'

Deno.test('Steam totp', async () => {
  const secret = new Uint8Array(20)

  assertEquals(await steamTotp({secret, counter: 0}), 'RYH4D')
  assertEquals(await steamTotp({secret, counter: 1}), 'DR2DK')
})
