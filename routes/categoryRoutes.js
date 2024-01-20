import express from "express";
import {
  isAdmin,
  requireSignin,
  requireSigninProtected,
} from "../middleware/authMiddleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";
import { get } from "mongoose";

const router = express.Router();

//routes

router.post(
  "/create-category",
  requireSigninProtected,
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
