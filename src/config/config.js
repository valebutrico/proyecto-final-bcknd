import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

dotenv.config();

const config = {
  port: process.env.PORT || 8080,
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
};

export const connectDB = async () => {
  try {
    await mongoose.connect(config.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to the database successfully");
  } catch (err) {
    logger.error("Error connecting to the database", err);
    process.exit(1);
  }
};

export default config;
