import {assertEquals} from 'jsr:@std/assert'
import {otpauth} from './otpauth.ts'

const encoder = new TextEncoder()
const secret = encoder.encode('12345678901234567890') // test secret: https://datatracker.ietf.org/doc/html/rfc6238

Deno.test('create otpauth uri', async () => {
  const uri = otpauth({
    secret,
    type: 'totp',
    label: 'label',
    issuer: 'iss',
  })

  assertEquals(
    uri.toString(),
    'otpauth://totp/label?secret=GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ&algorithm=SHA1&issuer=iss'
  )
})
