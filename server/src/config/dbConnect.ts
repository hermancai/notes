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
    console.log("Missing database URI in environment variables.");
    return;
  }

  // Connect to database
  const sequelize = new Sequelize(dbURI, { logging: false });
  sequelize.addModels([User, Token, Note, Image]);

  // Test connection
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to database.");
  } catch (err) {
    console.log("Failed connection test: \n" + err);
  }
};

export default connectToDatabase;
