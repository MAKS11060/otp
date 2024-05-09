import {assertEquals} from 'jsr:@std/assert'
import {generateKey, steamTotp} from '../mod.ts'

const steamKey = new Uint8Array(20) // 0 x20

Deno.test('Steam totp', async () => {
  assertEquals(steamTotp(await generateKey(steamKey, 0)), 'RYH4D')
  assertEquals(steamTotp(await generateKey(steamKey, 1)), 'DR2DK')
})
