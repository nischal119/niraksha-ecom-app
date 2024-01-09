import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//protected routes

export const requireSignin = (req, res, next) => {
  const request = req.headers.authorization.split(" ");
  const token = request[1];
  try {
    const decode = JWT.verify(token, process.env.JWT_SECRET);

    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
export const requireSigninProtected = (req, res, next) => {
  try {
    const token = req?.headers?.authorization;
    const decode = JWT.verify(token, process.env.JWT_SECRET);

    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

//admin access

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    // console.log(user);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in admin middleware",
      error,
    });
  }
};
