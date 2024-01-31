import fs from "fs";
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import dotenv from "dotenv";
//payment gateway

dotenv.config();
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_ID,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
console.log(process.env.BRAINTREE_PUBLIC_ID);
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
    if (!name || !description || !quantity || !price) {
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

//filter products
export const productsFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length) {
      args.price = {
        $gte: radio[0],
        $lte: radio[1],
      };
    }
    const products = await productModel.find(args);
    // console.log(products);
    res.status(200).send({
      message: "Filtered products",
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while filtering products",
      success: false,
      error,
    });
  }
};

//product count

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      message: "Product count",
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting product count",
      success: false,
      error,
    });
  }
};

//product per page

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page || 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      message: "Products per page",
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting product per page",
      success: false,
      error,
    });
  }
};

//search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while searching product",
      success: false,
      error,
    });
  }
};

//similar products
export const getSimilarProductsController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({ _id: { $ne: pid }, category: cid })
      .limit(3)
      .select("-photo")
      .populate("category");
    res.status(200).send({
      message: "Similar products",
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting similar products",
      success: false,
      error,
    });
  }
};

//category wise products
export const productsCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      message: "Category wise products",
      success: true,
      products,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting category wise products",
      success: false,
      error,
    });
  }
};

//token controller
export const brainTreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        return res.status(500).send({
          message: "Error while getting braintree token",
          success: false,
          error: err,
        });
      }
      res.status(200).send({
        message: "Braintree token",
        success: true,
        response,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting braintree token",
      success: false,
      error,
    });
  }
};

//payment controller
export const brainTreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.forEach((item) => {
      total += item.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while payment",
      success: false,
      error,
    });
  }
};
