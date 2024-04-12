import {DT} from './hotp.ts'

const chars = '23456789BCDFGHJKMNPQRTVWXY'

// const stepWindow = 1000 * 30
// const getTimeCounter = () => Math.floor(Date.now() / stepWindow)

export const steamTotp = (key: ArrayBuffer) => {
  let code = ''
  let value = DT(key)
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(value % chars.length)
    value = Math.floor(value / chars.length)
  }
  return code
}
