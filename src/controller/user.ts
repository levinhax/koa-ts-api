import { Context } from 'koa'
import { UserService } from '../service'
import IUser from '../types/user'

class UserController {
  public static async getAllUser(ctx: Context): Promise<any> {
    // const result = await userService.getAllUser();
    // return OK status code and loaded users array
    const result = {
      data: 'all users',
    }
    ctx.body = result
  }

  // 注册
  public static async register(ctx: Context): Promise<any> {
    let result
    const { userName, userPass } = ctx.request.body
    if (userName === '' || userPass === '') {
      // ctx.throw(400, '用户名和密码不能为空')
      result = {
        code: -1,
        message: '用户名或密码不能为空',
      }
    } else {
      const userData: IUser.Item = {
        id: null,
        userName,
        userPass,
        role: 3,
        userEmail: '',
        userAvatar: '',
        place: '',
        updatedAt: new Date(),
        createdAt: new Date(),
      }
      result = await UserService.createUser(ctx, userData)
    }
    ctx.body = result
  }

  // 登录
  public static async logIn(ctx: Context): Promise<any> {
    const user = {
      userName: ctx.request.body.userName,
      userPass: ctx.request.body.userPass,
    }
    const result = await UserService.loginIn(ctx, user)
    ctx.body = result
  }

  // 登出
  public static async logOut(ctx: Context): Promise<any> {
    ctx.body = {
      code: 1,
      message: '登出成功',
    }
  }

  // 获取用户信息
  public static async getUserById(ctx: Context): Promise<any> {
    const { id } = ctx.query
    const result = await UserService.getUserById(id)
    ctx.body = result
  }

  // 获取用户列表
  public static async getUserList(ctx: Context): Promise<any> {
    const { page = 1, pageSize = 10, sortName = 'createdAt', sortType, keyword } = ctx.query
    const params = {
      keyword,
      sortType,
      sortName,
      page,
      pageSize,
    }
    const result = await UserService.getUserList(params)
    ctx.body = result
  }

  // 更改用户信息
  public static async updateUser(ctx: Context): Promise<any> {
    const params = {
      id: ctx.request.body.id,
      place: ctx.request.body.place,
    }
    const result = await UserService.updateUser(params)
    ctx.body = result
  }

  // 删除用户
  public static async deleteUserById(ctx: Context): Promise<any> {
    const { id } = ctx.query
    const result = await UserService.deleteUserById(id)
    ctx.body = result
  }
}

export default UserController
