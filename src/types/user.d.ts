import IBase from './base'
export as namespace IUser

export interface Item extends IBase.Item {
  id: number
  userName: string
  userPass: string
  role: 1 | 2 | 3
  userEmail?: string
  userAvatar?: string
  place?: string
}
