import { IConfig } from '../types/config'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()
// dotenv.config({ path: '.env' });

// 关于 jwtExprisesIn: 例如：60，“ 2天”，“ 10h”，“ 7d”。 数值解释为秒计数。
// 如果使用字符串，请确保提供时间单位（天，小时等），否则默认使用毫秒单位（“ 120”等于“ 120ms”）
const config: IConfig = {
  port: +process.env.NODE_PORT || 5000,
  isPrettyLog: process.env.NODE_ENV == 'development',
  routerBaseApi: '/api',
  jwtSecret: process.env.JWT_SECRET || 'pwd-jwt',
  jwtExprisesIn: 60 * 60, // jwtExprisesIn: '1h'
}

export { config }
