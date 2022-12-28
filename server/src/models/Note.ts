import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./User";

@Table
class Note extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  userId!: string;

  @BelongsTo(() => User, "userId")
  user!: User;

  @AllowNull(false)
  @Column(DataType.TEXT)
  title!: string;

  @Column(DataType.TEXT)
  text!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;
}

export default Note;
