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
} from "sequelize-typescript";
import Token from "./Token";

@Table
class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  userId!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  username!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @HasOne(() => Token, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true,
  })
  token!: Token;
}

export default User;
