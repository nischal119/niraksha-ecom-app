import express from "express";
import { isAdmin, requireSignin } from "../middleware/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductsController,
  getSingleProductController,
  productCountController,
  productListController,
  productPhotoController,
  productsFilterController,
  updateProductController,
} from "../controllers/porductController.js";
import formidable from "express-formidable";
const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignin,
  isAdmin,
  formidable(),
  createProductController
);

//get products

router.get("/get-products", getProductsController);

//delete product
router.delete(
  "/delete-product/:id",
  requireSignin,
  isAdmin,
  deleteProductController
);

//update product
router.put(
  "/update-product/:id",
  requireSignin,
  isAdmin,
  formidable(),
  updateProductController
);

//get single product
router.get("/single-product/:slug", getSingleProductController);

//get photo

router.get("/product-photo/:pid", productPhotoController);

//filter products
router.post("/products-filter", productsFilterController);

//product count
router.get("/products-count", productCountController);

//product per page

router.get("/products-list/:page", productListController);
export default router;
