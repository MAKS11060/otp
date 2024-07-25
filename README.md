# otp • Collection of one-time password algorithms

[![JSR][JSR badge]][JSR]
[![CI][CI badge]][CI]

[JSR]: https://jsr.io/@maks11060/otp
[JSR badge]: https://jsr.io/badges/@maks11060/otp
[CI]: https://github.com/MAKS11060/otp/actions/workflows/ci.yml
[CI badge]: https://github.com/maks11060/otp/actions/workflows/ci.yml/badge.svg

## Supported Algorithms
- [HOTP](https://datatracker.ietf.org/doc/html/rfc4226)
- [TOTP](https://datatracker.ietf.org/doc/html/rfc6238)
- SteamTOTP

## Usage
```ts
import {otpauth, totp, toptValidate} from "@maks11060/otp"

const secret = crypto.getRandomValues(new Uint8Array(20))

// Generate totp code
const code = await totp({secret}) // 123456

// Validate totp with time window
await toptValidate({secret, code}) // true

// Create otpauth uri
otpauth({secret, issuer: 'App name', label: '@user'}).toString()
// otpauth://totp/lable?secret=00&algorithm=SHA1&issuer=App+name
```

### Use Readable
```ts
import {readableTotp} from '@maks11060/otp/readable'

const secret = crypto.getRandomValues(new Uint8Array(20))
for await (const otp of readableTotp({secret})) {
  console.log(otp)
}
```

## Supported apps
|                    Apps |  Algs  | Period | Digits |
| ----------------------: | :----: | :----: | :----: |
|    Google Authenticator | `SHA1` |  `30`  |  `6`   |
| Microsoft Authenticator | `SHA1` |  `30`  |  `6`   |
