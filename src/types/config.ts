export interface IConfig {
  port: number
  isPrettyLog: boolean
  routerBaseApi: string
  jwtSecret: string
  jwtExprisesIn: number | string
}
