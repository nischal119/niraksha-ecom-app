import JWT from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
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
      return res.status(400).send({
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
        role: user.role,
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

//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, phone, address, password } = req.body;
    //validations
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (password && password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast 6 characters long",
      });
    }
    //hash password

    const hashedPassword = password ? await hashPassword(password) : undefined;

    //update user
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,

        phone: phone || user.phone,
        address: address || user.address,
        password: hashedPassword,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in update profile",
      error,
    });
  }
};

//get orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name ");
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in get orders",
      error,
    });
  }
};

//get all orders
export const getALlOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name ")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in get orders",
      error,
    });
  }
};

//update order status
export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in update order status",
      error,
    });
  }
};

//send email controller
// export const sendEmailController = async (req, res) => {
//   try {
//     const { senderName, senderEmail, adminEmail } = req.body;
//     // console.log(senderName, senderEmail, adminEmail);
//     const transporter = nodemailer.createTransport({
//       host: "smtp.forwardemail.net",
//       port: 465,
//       secure: true,
//       auth: {
//         // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//         user: "strawluffy119@gmail.com",
//         pass: "nttu gjay urxu tpmv",
//       },
//     });

//     const mailOptions = {
//       from: process.env.GMAIL_USER_NAME, //  Gmail email
//       to: adminEmail,
//       subject: "New Seller Request",
//       text: `Name: ${senderName}\nEmail: ${senderEmail}\n\nPlease grant seller access.`,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: " + info.response);
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//         res.status(500).send("Error sending email");
//       } else {
//         console.log("Email sent: " + info.response);
//         res.status(200).send("Email sent successfully");
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error sending email");
//   }
// };
