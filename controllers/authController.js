import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    //validations

    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //register user

    const hashedPassword = await hashPassword(password);
    //save user

    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    }).save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

//POST login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validations

    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    //check user

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not found",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Incorrect password",
      });
    }

    //token

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",

      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//check email and answer

export const checkEmailController = async (req, res, next) => {
  const { email, answer } = req.body;
  try {
    if (!email || !answer) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    next();

    res.status(200).send({
      success: true,
      message: "Email and answer matched",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in forgot password",
      error,
    });
  }
};

//forgot password

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const checkOldPassword = await comparePassword(newPassword, user.password);

    if (checkOldPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }
    const hash = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hash });

    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in forgot password",
      error,
    });
  }
};

//test

export const testController = async (req, res) => {
  try {
    res.send({ message: "Protected route" });
  } catch (error) {
    res.send(error);
    res.status(500).json({
      success: false,
      message: "Error in admin middleware",
      error,
    });
  }
};
