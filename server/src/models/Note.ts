import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  PrimaryKey,
  AllowNull,
  Unique,
  HasOne,
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
  @Column
  title!: string;

  @Column
  text!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;
}

export default Note;
