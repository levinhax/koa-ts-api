import Router from 'koa-router'
import { UserController } from '../controller'

const router = new Router({
  prefix: '/api',
})

router.get('/', async ctx => {
  ctx.body = 'Hello World!'
})

router.get('/test', async ctx => {
  ctx.throw(401, '请求出错, 登录已过期')
})

// router.get('/users', UserController.getAllUser)
router.post('/register', UserController.register)
router.post('/login', UserController.logIn)
router.post('/logout', UserController.logOut)
router.get('/user', UserController.getUserById)
router.get('/users', UserController.getUserList)
router.put('/user', UserController.updateUser)
router.del('/user', UserController.deleteUserById)

export const routes = router.routes()
