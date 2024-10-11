import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../utils/logger.js";

class AuthMiddleware {
  static async current(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
      logger.warn("No token found, redirecting to login");
      return res.redirect("/login");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        logger.warn(
          `User not found for token with id ${decoded.id}, redirecting to login`
        );
        return res.redirect("/login");
      }

      logger.info(
        `User ${
          user.username || user.email || user._id
        } authenticated successfully`
      );
      req.user = user;
      next();
    } catch (err) {
      logger.error(
        `Token verification failed: ${err.message}, redirecting to login`
      );
      return res.redirect("/login");
    }
  }
}

export default AuthMiddleware;
