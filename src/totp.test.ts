import {assert, assertEquals} from 'jsr:@std/assert'
import {totp, totpValidate} from './totp.ts'

const encoder = new TextEncoder()
const secret = encoder.encode('12345678901234567890') // test secret: https://datatracker.ietf.org/doc/html/rfc6238

Deno.test('totp', async () => {
  const code = await totp({secret, counter: 0})
  assertEquals(code, '755224')
})

Deno.test('totp digits 8', async () => {
  const code = await totp({secret, counter: 1, digits: 8})
  assertEquals(code, '94287082')
})

Deno.test('totpValidate', async () => {
  const code = '94287082'

  assert(await totpValidate({secret, counter: 1, digits: 8, code}))
  assert(await totpValidate({secret, counter: 1, digits: 8, code}))
  assert(await totpValidate({secret, counter: 2, digits: 8, code}))
  assert(await totpValidate({secret, counter: 3, digits: 8, code}))
})
