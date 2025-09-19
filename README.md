# **OTP**

### Collection of one-time password algorithms

[![JSR][JSR badge]][JSR] [![CI][CI badge]][CI]

[JSR]: https://jsr.io/@maks11060/otp
[JSR badge]: https://jsr.io/badges/@maks11060/otp
[CI]: https://github.com/MAKS11060/otp/actions/workflows/ci.yml
[CI badge]: https://github.com/maks11060/otp/actions/workflows/ci.yml/badge.svg

## Supported Algorithms

- [HOTP](https://datatracker.ietf.org/doc/html/rfc4226)
- [TOTP](https://datatracker.ietf.org/doc/html/rfc6238)
- SteamTOTP

## Usage

### Generate `TOTP`

```ts
import {otpauth, readableTotp, totp, totpValidate} from '@maks11060/otp'

const secret = crypto.getRandomValues(new Uint8Array(20))

// Get code
const code = await totp({secret}) // 380577

// Codes iterator
for await (const {code, timeLeft} of readableTotp(totp, {secret})) {
  console.log({code, timeLeft}) // { code: "380577", timeLeft: 15 }
}

// Create otpauth uri
otpauth({secret, issuer: 'App name', label: '@username'}).toString()
// otpauth://totp/lable?secret=00&algorithm=SHA1&issuer=App+name

// Validate totp with time window
await totpValidate({secret, code}) // true
```

### Generate `HOTP`

```ts
import {hotp, readableTotp} from '@maks11060/otp'

const secret = crypto.getRandomValues(new Uint8Array(20))
const code = await hotp({secret, counter: 1})
```

### Generate `SteamTOTP`

```ts
import {readableTotp, steamTotp} from '@maks11060/otp'
import {decodeBase64} from '@std/encoding/base64'

const secret = decodeBase64('STEAM_SHARED_SECRET') // Decode key to ArrayBuffer

// Get code
const code = await steamTotp({secret})
console.log(code) // "KQXVF"

// Codes iterator
for await (const {code, timeLeft} of readableTotp(steamTotp, {secret})) {
  console.log({code, timeLeft}) // { code: "KQXVF", timeLeft: 25 }
}
```

## Supported apps

|                    Apps |  Algs  | Period | Digits |
| ----------------------: | :----: | :----: | :----: |
|    Google Authenticator | `SHA1` |  `30`  |  `6`   |
| Microsoft Authenticator | `SHA1` |  `30`  |  `6`   |
