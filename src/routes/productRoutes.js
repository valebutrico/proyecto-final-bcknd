import { Router } from "express";
import ProductController from "../controllers/productController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import logger from "../utils/logger.js";

const router = Router();
const productController = new ProductController();

router.get("/", AuthMiddleware.current, (req, res, next) => {
  try {
    productController.getProducts.bind(productController)(req, res);
    logger.info("Products fetched successfully");
  } catch (error) {
    logger.error(`Error fetching products: ${error.message}`);
    next(error);
  }
});

router.post(
  "/",
  AuthMiddleware.current,
  roleMiddleware.checkRoles(["admin"]),
  (req, res, next) => {
    try {
      productController.createProduct.bind(productController)(req, res);
      logger.info("Product created successfully");
    } catch (error) {
      logger.error(`Error creating product: ${error.message}`);
      next(error);
    }
  }
);

router.put(
  "/:id",
  AuthMiddleware.current,
  roleMiddleware.checkRoles(["admin"]),
  (req, res, next) => {
    try {
      productController.updateProduct.bind(productController)(req, res);
      logger.info(`Product with id ${req.params.id} updated successfully`);
    } catch (error) {
      logger.error(`Error updating product: ${error.message}`);
      next(error);
    }
  }
);

router.delete(
  "/:id",
  AuthMiddleware.current,
  roleMiddleware.checkRoles(["admin"]),
  (req, res, next) => {
    try {
      productController.deleteProduct.bind(productController)(req, res);
      logger.info(`Product with id ${req.params.id} deleted successfully`);
    } catch (error) {
      logger.error(`Error deleting product: ${error.message}`);
      next(error);
    }
  }
);

export default router;
