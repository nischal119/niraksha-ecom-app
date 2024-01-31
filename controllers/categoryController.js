import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({
        message: "Name is required",
        success: false,
      });
    }
    //check existing category

    const existingCategory = await categoryModel.findOne({ name });

    if (existingCategory) {
      return res.status(400).send({
        message: "Category already exists",
        success: false,
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    res.status(201).send({
      message: "Category created successfully",
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Internal Server Error in categoryController.js",
      success: false,
      error,
    });
  }
};

//update category controller

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    res.status(200).send({
      message: "Category updated successfully",
      success: true,
      category,
    });
    if (!name) {
      return res.status(400).send({
        message: "Category name is required",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error in categoryController.js",
      success: false,
      error,
    });
  }
};

//get all categories
export const getCategoriesController = async (req, res) => {
  try {
    const category = await categoryModel.find({}).sort({ createdAt: -1 });
    res.status(200).send({
      message: "All categories",
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error while getting categories",
      success: false,
      error,
    });
  }
};

//get single category

export const singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    // console.log(slug);
    const singleCategory = await categoryModel.findOne({ slug });

    console.log(singleCategory);

    res.status(200).send({
      message: "Single category fetched",
      success: true,
      singleCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error while getting single category",
      success: false,
      error,
    });
  }
};

//DELETE CATEGORY

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        message: "Id is required",
        success: false,
      });
    }
    const deletedCategory = await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      message: "Category deleted successfully",
      success: true,
      deletedCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: " Error while deleting category",
      success: false,
      error,
    });
  }
};
