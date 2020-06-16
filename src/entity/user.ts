import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Length, IsEmail } from 'class-validator'
import IUser from '../types/user'
import BaseEntity from './base'

@Entity()
class UserEntity extends BaseEntity implements IUser.Item {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 30,
  })
  @Length(6, 30)
  userName: string

  @Column({
    type: 'char',
    length: 120,
  })
  userPass: string

  @Column({ type: 'tinyint', width: 4 })
  role: 1 | 2 | 3

  @Column({
    length: 100,
  })
  @Length(10, 100)
  @IsEmail()
  userEmail?: string | null

  @Column()
  userAvatar?: string | null

  @Column()
  place?: string
}

export default UserEntity
