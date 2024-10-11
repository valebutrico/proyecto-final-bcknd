import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import AuthController from "../controllers/authController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import UserController from "../controllers/userController.js";
import logger from "../utils/logger.js";

const router = Router();

// Login
router.get("/login", (req, res) => res.render("login"));
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      logger.error(`Error during login authentication: ${err.message}`);
      return next(err);
    }
    if (!user) {
      logger.warn("Failed login attempt: No user found");
      req.flash("error", info.message);
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        logger.error(`Error during user login: ${err.message}`);
        return next(err);
      }
      logger.info(`User ${user.username} logged in successfully`);
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      return res.redirect("/api/products");
    });
  })(req, res, next);
});

// Register
router.get("/register", (req, res) => res.render("register"));
router.post("/register", AuthController.register);

// Logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error(`Error during logout: ${err.message}`);
      return res.status(500).json({ message: "Error logging out" });
    }
    logger.info(`User logged out successfully`);
    res.clearCookie("token");
    res.redirect("/login");
  });
});

// Github
router.get(
  "/auth/github",
  (req, res, next) => {
    logger.info("GitHub authentication initiated");
    next();
  },
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    logger.info(
      `GitHub authentication successful for user ${req.user.username}`
    );
    res.redirect("/api/products");
  }
);

// Current
router.get("/current", AuthMiddleware.current, UserController.getCurrentUser);

// Recuperación de contraseña
router.get('/reset-password-request', (req, res) => {
  res.render('resetPasswordRequest'); 
});

router.post("reset-password-request", AuthController.sendPasswordResetEmail);

router.get('/reset-password/:token', AuthController.verifyResetToken);

router.post('/update-password', AuthController.updatePassword);

export default router;
