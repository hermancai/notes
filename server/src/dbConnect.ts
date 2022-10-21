import { config } from "dotenv";
import { Sequelize } from "sequelize-typescript";
import User from "./models/User";

config();

const connectToDatabase = async () => {
  const dbURI = process.env.DB_URI;
  if (dbURI === undefined) {
    console.log("failed to connect to database");
    return;
  }

  // Connect to database
  const sequelize = new Sequelize(dbURI);
  sequelize.addModels([User]);

  try {
    await sequelize.authenticate();
    console.log("Connected to database successfully");
  } catch (err) {
    console.log("Connection error: ", err);
  }

  // // Resets database to match new models.
  // await sequelize.sync({ force: true });
};

export default connectToDatabase;
