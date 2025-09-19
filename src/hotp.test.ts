import {encodeHex} from '@std/encoding/hex'
import {assert, assertEquals} from 'jsr:@std/assert'
import {generateKey, hotp} from './hotp.ts'

const encoder = new TextEncoder()
const secret = encoder.encode('12345678901234567890') // test secret

Deno.test('generateKey', async () => {
  const key = await generateKey(secret, 0)
  assertEquals(encodeHex(key), 'cc93cf18508d94934c64b65d8ba7667fb7cde4b0')
})

Deno.test('hotp', async () => {
  // Test values from: https://datatracker.ietf.org/doc/html/rfc4226
  const codes = [
    '755224',
    '287082',
    '359152',
    '969429',
    '338314',
    '254676',
    '287922',
    '162583',
    '399871',
    '520489',
  ]

  for (let i = 0; i < 10; i++) {
    const code = await hotp({secret, counter: i})
    assert(code === codes[i])
  }
})
