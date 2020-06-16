import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import koaStatic from 'koa-static'
import { createConnection } from 'typeorm'

import { routes } from './routes'
import errorHandler from './middlewares/errorHandler'
import { checkToken } from './utils'

const path = require('path')

const app = new Koa()

createConnection()
  .then(() => {
    app
      .use(cors())
      .use(bodyParser())
      .use(errorHandler)
      .use(checkToken)
      .use(routes)
      .use(koaStatic(path.join(__dirname + '/static/')))

    app.listen(5000, () => {
      console.log(`数据库连接成功，Server is running on port 5000 ^-^`)
    })
  })
  .catch(error => console.log('TypeOrm连接失败： ', error))
