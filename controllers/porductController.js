import productModel from "../models/productModel.js";
import slugify from "slugify";
import fs from "fs";
import e from "express";

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, quantity, price } = req.fields;
    // console.log(req.fields);
    const { photo } = req.files;
    if (!name || !description || !quantity || !price || !photo) {
      return res.status(400).send({
        message: "All fields are required",
        success: false,
      });
    }
    if (photo && photo.size > 2000000) {
      return res.status(400).send({
        message: "Image size should be less than 2MB",
        success: false,
      });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      message: "Product created successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error while creating product",
      success: false,
      error,
    });
  }
};

//get products

export const getProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select("-photo")
      .limit(10)
      .sort({ createdAt: -1 });
    res.status(200).send({
      message: "All products",
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: " Error while getting product",
      success: false,
      error,
    });
  }
};

//delete product
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);
    res.status(200).send({
      message: "Product deleted successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while deleting product",
      success: false,
      error,
    });
  }
};

//update product
export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, quantity, price } = req.fields;
    const { photo } = req.files;
    if (!name || !description || !quantity || !price ) {
      return res.status(400).send({
        message: "All fields are required",
        success: false,
      });
    }
    if (photo && photo.size > 2000000) {
      return res.status(400).send({
        message: "Image size should be less than 2MB",
        success: false,
      });
    }
    const product = await productModel.findByIdAndUpdate(
      id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(200).send({
      message: "Product updated successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while updating product",
      success: false,
      error,
    });
  }
};

//get single product
export const getSingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel
      .findOne({ slug })
      .select("-photo")
      .populate("category");
    if (!product) {
      return res.status(400).send({
        message: "Product not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Single product fetched",
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting single product",
      success: false,
      error,
    });
  }
};

//get photo
export const productPhotoController = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productModel.findById(pid).select("photo");
    if (!product) {
      return res.status(400).send({
        message: "Product not found",
        success: false,
      });
    }
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting photo",
      success: false,
      error,
    });
  }
};
