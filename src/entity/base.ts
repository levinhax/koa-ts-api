import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

// 基类
abstract class BaseEntity implements IBase.Item {
  @CreateDateColumn({
    comment: '创建时间',
    type: 'timestamp',
  })
  createdAt: Date

  @UpdateDateColumn({
    comment: '更新时间',
    type: 'timestamp',
  })
  updatedAt: Date
}

export default BaseEntity
