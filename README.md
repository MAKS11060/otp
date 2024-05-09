# otp • Collection of one-time password algorithms

[![JSR][JSR badge]][JSR]
<!-- Add test badge -->

[JSR]: https://jsr.io/@maks11060/otp
[JSR badge]: https://jsr.io/badges/@maks11060/otp


## Supported Algorithms
- [HOTP](https://datatracker.ietf.org/doc/html/rfc4226)
- [TOTP](https://datatracker.ietf.org/doc/html/rfc6238)
- SteamTOTP

## How to use
```ts
import {otpauth, topt, toptValidate} from "@maks11060/otp"

const secret = crypto.getRandomValues(new Uint8Array(20))

// Generate totp code
const code = await topt({secret}) // 123456

// Validate totp with time window
await toptValidate({secret, code}) // true

// Create otpauth uri
otpauth({secret, issuer: 'App name', label: '@user'}).toString() // otpauth://totp/lable?secret=00&algorithm=SHA1&issuer=App+name
```

## Supported apps
|                    Apps |  Algs  | Period | Digits |
| ----------------------: | :----: | :----: | :----: |
|    Google Authenticator | `SHA1` |  `30`  |  `6`   |
| Microsoft Authenticator | `SHA1` |  `30`  |  `6`   |
