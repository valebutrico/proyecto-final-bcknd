import { Router } from "express";
import UserController from "../controllers/userController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import logger from "../utils/logger.js"; 

const router = Router();

router.get("/users", (req, res, next) => {
  try {
    UserController.getAllUsers(req, res);
    logger.info('Fetched all users successfully');
  } catch (error) {
    logger.error(`Error fetching all users: ${error.message}`);
    next(error);
  }
});

router.get("/users/:id", (req, res, next) => {
  try {
    UserController.getUserById(req, res);
    logger.info(`Fetched user with id ${req.params.id} successfully`);
  } catch (error) {
    logger.error(`Error fetching user with id ${req.params.id}: ${error.message}`);
    next(error);
  }
});

router.get("/current", AuthMiddleware.current, (req, res, next) => {
  try {
    UserController.getCurrentUser(req, res);
    logger.info('Fetched current user successfully');
  } catch (error) {
    logger.error(`Error fetching current user: ${error.message}`);
    next(error);
  }
});

router.post("/users", (req, res, next) => {
  try {
    UserController.createUser(req, res);
    logger.info('User created successfully');
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    next(error);
  }
});

router.put("/users/:id", (req, res, next) => {
  try {
    UserController.updateUser(req, res);
    logger.info(`User with id ${req.params.id} updated successfully`);
  } catch (error) {
    logger.error(`Error updating user with id ${req.params.id}: ${error.message}`);
    next(error);
  }
});

router.delete("/users/:id", (req, res, next) => {
  try {
    UserController.deleteUser(req, res);
    logger.info(`User with id ${req.params.id} deleted successfully`);
  } catch (error) {
    logger.error(`Error deleting user with id ${req.params.id}: ${error.message}`);
    next(error);
  }
});

export default router;
