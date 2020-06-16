import { Context } from 'koa'
import jwt from 'jsonwebtoken'
import { config } from '../config'

interface UserInfo {
  id: number
  userName: string
  role: 1 | 2 | 3
}

// 创建token
export const createToken = (userInfo: UserInfo): string => {
  const privateKey = config.jwtSecret
  const expiresIn = config.jwtExprisesIn
  const token = jwt.sign(userInfo, privateKey, {
    expiresIn,
  })
  return token
}

// 校验token
export const checkToken = async (ctx: Context, next: (err?: any) => any): Promise<any> => {
  let token
  const authorizationHeader = ctx.request.header.authorization
  if (!!authorizationHeader) {
    token = authorizationHeader.split(' ')[1]
  }
  const method = ctx.request.method.toLocaleLowerCase()

  if (!token) {
    if (method === 'get') {
      await next()
    } else {
      if (ctx.path === '/api/register' || ctx.path === '/api/login') {
        await next()
      } else {
        ctx.throw(401, '未登录, 请先登录!!!')
      }
    }
  } else {
    if (method === 'get') {
      await next()
    } else {
      if (ctx.path === '/api/register' || ctx.path === '/api/login') {
        await next()
      } else {
        // let decode: any
        try {
          jwt.verify(token, config.jwtSecret)
          // decode = jwt.verify(token, config.jwtSecret)
          // =============================================================
          // console.log(decode);
          // 返回如下
          // { id: '5c63eb3b8fe1435194d41918',
          //   iat: 1550317881,
          //   exp: 1550321481 }  // 解析后的exp=创建token的时间+之前设置的过期时间
          // ============================================================
          await next()
        } catch (err) {
          console.log('token err: ', err)
          ctx.throw(401, 'Token已过期')
        }
      }
    }
  }
}

// // 检测token权限
// export const checkToken = (ctx: Context, authList: AuthItem[]): boolean => {
//     let isPass = false
//     const verify = (token: string): any => {
//         return jwt.verify(token, TOKEN_SECRET_KEY, (err: Error, decoded: { auth: 1 | 2 }) => {
//             if (err) {
//                 return false
//             } else if (!!decoded) {
//                 const target = authList.find((item: AuthItem) => item.auth === decoded.auth)
//                 return !!target
//             }
//             return false
//         })
//     }

//     for (const item of authList) {
//         if (item.verifyTokenBy === 'headers') {
//             const authorizationHeader = ctx.headers['authorization']

//             if (!!authorizationHeader) {
//                 const token = authorizationHeader.split(' ')[1]
//                 const result = verify(token)
//                 if (result) {
//                     isPass = true
//                     break
//                 }
//             } else {
//                 const { token } = ctx.query
//                 if (token) {
//                     const t = token.split(' ')[1]
//                     const result = verify(t)
//                     if (result) {
//                         isPass = true
//                         break
//                     }
//                 }
//             }
//         }
//     }

//     return isPass
// }
