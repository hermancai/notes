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
class Image extends Model {
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
  fileName!: string;

  @Column(DataType.TEXT)
  fileNameResized!: string;

  @Column(DataType.TEXT)
  description!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;
}

export default Image;
