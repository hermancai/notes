import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  AllowNull,
  ForeignKey,
} from "sequelize-typescript";
import User from './User'

@Table
class Token extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  userId!: string;

  @AllowNull(false)
  @Column
  token!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;
}

export default Token;