import { config } from "dotenv";
import { Sequelize } from "sequelize-typescript";
import Token from "../models/Token";
import User from "../models/User";
import Note from "../models/Note";
import Image from "../models/Image";

config();

const connectToDatabase = async () => {
  const dbURI = process.env.DB_URI;
  if (dbURI === undefined) {
    console.log("Failed to connect to database");
    return;
  }

  // Connect to database
  const sequelize = new Sequelize(dbURI);
  sequelize.addModels([User, Token, Note, Image]);

  // Test connection
  try {
    await sequelize.authenticate();
  } catch (err) {
    console.log(err);
  }

  // Reset database to match new models
  // TODO use migrations for production
  await sequelize.sync({ alter: true });
};

export default connectToDatabase;
