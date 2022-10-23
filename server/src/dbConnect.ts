import { config } from "dotenv";
import { Sequelize } from "sequelize-typescript";
import Token from "./models/Token";
import User from "./models/User";

config();

const connectToDatabase = async () => {
  const dbURI = process.env.DB_URI;
  if (dbURI === undefined) {
    console.log("Failed to connect to database");
    return;
  }

  // Connect to database
  const sequelize = new Sequelize(dbURI);
  sequelize.addModels([User, Token]);

  // Test connection
  try {
    await sequelize.authenticate();
  } catch (err) {
    console.log(err);
  }

  // // Resets database to match new models.
  // await sequelize.sync({ force: true });
};

export default connectToDatabase;
