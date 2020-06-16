import { Context } from 'koa'

const errorHandler = async (ctx: Context, next: () => Promise<any>): Promise<any> => {
  try {
    await next()
  } catch (error) {
    console.log(error)
    ctx.status = error.statusCode || error.status || 500
    ctx.body = {
      message: error.message,
    }
  }
}

export default errorHandler
