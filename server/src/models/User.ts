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
  HasMany,
} from "sequelize-typescript";
import Token from "./Token";
import Note from "./Note";

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

  @HasMany(() => Note, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true,
  })
  notes!: Note[];
}

export default User;
