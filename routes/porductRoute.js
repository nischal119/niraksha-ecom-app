import express from "express";
import { isAdmin, requireSignin } from "../middleware/authMiddleware.js";
import {
  brainTreePaymentController,
  brainTreeTokenController,
  createProductController,
  deleteProductController,
  getProductsController,
  getSimilarProductsController,
  getSingleProductController,
  productCountController,
  productListController,
  productPhotoController,
  productsCategoryController,
  productsFilterController,
  searchProductController,
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

//search
router.post("/search/:keyword", searchProductController);

//simalar products
router.get("/similar-products/:pid/:cid", getSimilarProductsController);

//category wise products routes
router.get("/product-category/:slug", productsCategoryController);
//payment routes

router.get("/braintree/token", brainTreeTokenController);

//payment

router.post("/braintree/payment",requireSignin, brainTreePaymentController)