import { Router } from "express";
import logger from "../utils/logger.js";

const router = Router();

router.get("/", (req, res, next) => {
  try {
    logger.debug("This is a debug log");
    logger.http("This is an http log");
    logger.info("This is an info log");
    logger.warn("This is a warning log");
    logger.error("This is an error log");
    logger.fatal("This is a fatal log");

    res.send("Logs generated, check your logger output.");
  } catch (error) {
    logger.error(`Unexpected error in loggerTest: ${error.message}`);
    next(error);
  }
});

export default router;
