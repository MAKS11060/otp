import {assert, assertEquals} from 'https://deno.land/std/assert/mod.ts'
import {topt, toptValidate} from './totp.ts'

const encoder = new TextEncoder()
const secret = encoder.encode('12345678901234567890') // test secret: https://datatracker.ietf.org/doc/html/rfc6238

Deno.test('totp', async () => {
  const code = await topt({secret, counter: 1, digits: 8})
  assertEquals(code, '94287082')
})

Deno.test('totp validate', async () => {
  const code = '94287082'

  assert(await toptValidate({secret, counter: 1, digits: 8, code}))
  assert(await toptValidate({secret, counter: 1, digits: 8, code}))
  assert(await toptValidate({secret, counter: 2, digits: 8, code}))
  assert(await toptValidate({secret, counter: 3, digits: 8, code}))
})
