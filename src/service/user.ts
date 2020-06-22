import { Context } from 'koa'
import { getRepository } from 'typeorm'
// import { validate, ValidationError } from 'class-validator'
import User from '../entity/user'
import { cryptoPwd, createToken, getOrderByStatus } from '../utils'

class UserService {
  public static async createUser(ctx: Context, user: any): Promise<any> {
    let res
    const userRepository = getRepository(User)
    const createUser: IUser.Item = user
    createUser.userPass = cryptoPwd(user.userPass, user.userName)
    const checkUser = await userRepository.findOne({ userName: user.userName })
    if (!!checkUser) {
      res = {
        code: -1,
        message: '用户名已被注册',
      }
      // ctx.throw(400, '用户名已被注册')
    } else {
      const newUser = userRepository.create(createUser)
      await userRepository.save(newUser)
      res = { code: 200, message: '注册成功' }
    }
    return res
  }

  public static async loginIn(ctx: Context, user: any): Promise<any> {
    let res
    const userRepository = getRepository(User)
    const queryResult = await userRepository.findOne({
      userName: user.userName,
      // userPass: cryptoPwd(user.userPass, user.userName)
    })
    if (queryResult) {
      const userData = {
        id: queryResult.id,
        userName: queryResult.userName,
        role: queryResult.role,
      }
      const token = createToken(userData)
      res = {
        code: 200,
        data: {
          token,
          ...userData,
        },
        message: '登录成功',
      }
    } else {
      res = {
        code: -1,
        message: '用户不存在',
      }
    }
    return res
  }

  public static async getUserById(id: number): Promise<any> {
    let res
    const userRepository = getRepository(User)
    // const userData = await userRepository.findOne({ where: { id } })
    const userData = await userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.userName', 'user.role'])
      .where('user.id like :id', { id })
      .getOne()
    if (userData === undefined) {
      res = {
        code: -1,
        data: userData,
        message: '用户不存在',
      }
    } else {
      res = {
        code: 1,
        data: userData,
      }
    }
    return res
  }

  public static async getUserList(params: any): Promise<any> {
    const userRepository = getRepository(User)
    const orderByStatus = getOrderByStatus('user', params.sortName, params.sortType)
    const users = await userRepository
      .createQueryBuilder('user')
      .skip(params.pageSize * (params.page - 1))
      .take(params.pageSize)
      .select(['user.id', 'user.userName', 'user.role', 'user.userEmail', 'user.createdAt'])
      .where('user.role != 1')
      .orderBy({
        [orderByStatus.sortName]: orderByStatus.sortType,
      })
      .where('user.userName like :userName', {
        userName: `%${!!params.keyword ? params.keyword : ''}%`,
      })
      .andWhere('user.role like :role', { role: 3 })
      .getManyAndCount()

    const res = {
      code: 1,
      data: { list: users[0], total: users[1], current: Number(params.page) },
    }
    return res
  }

  public static async updateUser(user: any): Promise<any> {
    // 使用save进行更新，因为save包含update功能，但是同时效率较低
    // 使用update更新需要先把关联的信息解除，再进行保存
    const userRepository = getRepository(User)
    const existUser = await userRepository.findOne({ where: { id: user.id } })
    existUser.place = user.place
    existUser.updatedAt = new Date()
    await userRepository.save(existUser)
    const res = {
      code: 1,
      message: '更新成功',
    }
    return res
  }

  public static async deleteUserById(id: number): Promise<any> {
    let res
    const userRepository = getRepository(User)
    try {
      await userRepository.delete({ id })
      res = {
        code: 1,
        message: '删除成功',
      }
    } catch (err) {
      res = {
        code: -1,
        data: err,
        message: '删除失败',
      }
    }
    return res
  }
}

export default UserService
