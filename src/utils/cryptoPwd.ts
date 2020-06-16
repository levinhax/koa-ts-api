import Crypto from 'crypto'

const cryptoPwd = (pwd: string, key: string): string => {
  return Crypto.createHmac('sha256', key).update(pwd).digest('hex')
}

export { cryptoPwd }
