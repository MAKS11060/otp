interface HotpOptions {
  secret: ArrayBuffer
  counter: number
  /** @default 6 */
  digits?: 6 | 7 | 8
}

export const hotp = async (options: HotpOptions): Promise<string> => {
  options.digits ??= 6

  const key = await generateKey(options.secret, options.counter)
  const num = DT(key)
  return (num % 10 ** options.digits).toString().padStart(options.digits, '0')
}

/**
 * Generate key
 * @param secret Secret
 * @param counter Counter
 * @returns
 */
export const generateKey = async (
  secret: ArrayBuffer,
  counter: number
): Promise<ArrayBuffer> => {
  const key = await crypto.subtle.importKey(
    'raw',
    secret,
    {name: 'HMAC', hash: 'SHA-1'},
    true,
    ['sign']
  )

  return await crypto.subtle.sign('HMAC', key, padCounter(counter))
}

export const padCounter = (counter: number) => {
  const buffer = new ArrayBuffer(8)
  const bView = new DataView(buffer)
  bView.setBigUint64(0, BigInt(counter))
  return buffer
}

/** Dynamic Truncation */
export const DT = (HS: ArrayBuffer): number => {
  const bView = new DataView(HS)
  const offset = bView.getUint8(19) & 0xf
  return bView.getUint32(offset) & 0x7fff_ffff
}
