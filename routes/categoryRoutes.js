import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";
import {
  isAdmin,
  requireSignin
} from "../middleware/authMiddleware.js";


const router = express.Router();

//routes

router.post(
  "/create-category",
  requireSignin,
  isAdmin,
  createCategoryController
);

//update category

router.put(
  "/update-category/:id",
  requireSignin,
  isAdmin,
  updateCategoryController
);

//get all categories

router.get("/get-category", getCategoriesController);

//get single category

router.get("/single-category/:slug", singleCategoryController);
export default router;

//delete category

router.delete(
  "/delete-category/:id",
  requireSignin,
  isAdmin,
  deleteCategoryController
);
