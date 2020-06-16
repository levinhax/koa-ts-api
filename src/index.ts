const Koa = require('koa')
const app = new Koa()

import { Context } from 'koa'

app.use(async (ctx: Context) => {
  ctx.body = 'Hello World'
})

app.listen(5000, () => {
  console.log(`Server is running on port 5000`)
})
